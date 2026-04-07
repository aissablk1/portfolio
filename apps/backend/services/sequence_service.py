"""Moteur de sequences email automatisees.

Gere le cycle de vie des sequences : creation, envoi, pause, annulation.
Appele par les routes API (trigger) et le cron Vercel (process).
"""

import uuid
import logging
from datetime import datetime, timedelta, timezone

from services.resend_service import ResendService
from services.email_templates import render_sequence_email

logger = logging.getLogger(__name__)

SITE_URL = "https://www.aissabelkoussa.fr"

# ─── Definitions des sequences ───────────────────────────────────────────────

SEQUENCE_DEFINITIONS: dict[str, dict] = {
    "post_diagnostic": {
        "steps": [
            {"template": "post_diagnostic_j0", "delay_hours": 0},
            {"template": "post_diagnostic_j1", "delay_hours": 24},
            {"template": "post_diagnostic_j3", "delay_hours": 72},
            {"template": "post_diagnostic_j5", "delay_hours": 120},
            {"template": "post_diagnostic_j7", "delay_hours": 168},
        ],
    },
    "post_purchase": {
        "steps": [
            {"template": "post_purchase_j0", "delay_hours": 0},
            {"template": "post_purchase_j3", "delay_hours": 72},
            {"template": "post_purchase_j7", "delay_hours": 168},
        ],
    },
    "post_tripwire": {
        "steps": [
            {"template": "post_tripwire_j0", "delay_hours": 0},
            {"template": "post_tripwire_j1", "delay_hours": 24},
            {"template": "post_tripwire_j3", "delay_hours": 72},
        ],
    },
    "lead_magnet": {
        "steps": [
            {"template": "lead_magnet_j0", "delay_hours": 0},
            {"template": "lead_magnet_j1", "delay_hours": 24},
        ],
    },
}


class SequenceService:
    """Moteur de sequences email."""

    def __init__(self, resend: ResendService):
        self.resend = resend

    # ─── Demarrer une sequence ───────────────────────────────────────────

    async def start_sequence(
        self,
        db,
        email: str,
        name: str,
        sequence_type: str,
        trigger_data: dict | None = None,
    ) -> dict | None:
        """Demarre une nouvelle sequence email.

        Retourne le document de sequence cree, ou None si doublon/erreur.
        """
        trigger_data = trigger_data or {}

        definition = SEQUENCE_DEFINITIONS.get(sequence_type)
        if not definition:
            logger.error(f"Type de sequence inconnu : {sequence_type}")
            return None

        # Verifier que le subscriber n'est pas desabonne
        subscriber = await db.email_subscribers.find_one({"email": email})
        if subscriber and subscriber.get("unsubscribed"):
            logger.info(f"Subscriber {email} desabonne — sequence non demarree.")
            return None

        # Verifier les doublons (pas 2 sequences actives du meme type)
        existing = await db.email_sequences.find_one({
            "subscriber_email": email,
            "sequence_type": sequence_type,
            "status": {"$in": ["active", "paused"]},
        })
        if existing:
            logger.info(f"Sequence {sequence_type} deja active pour {email} — ignoree.")
            return None

        # Creer ou mettre a jour le subscriber
        now = datetime.now(timezone.utc)
        if not subscriber:
            await db.email_subscribers.insert_one({
                "id": str(uuid.uuid4()),
                "email": email,
                "name": name,
                "source": sequence_type.replace("post_", ""),
                "lead_score": trigger_data.get("lead_score"),
                "lead_label": trigger_data.get("lead_label"),
                "tags": [f"{sequence_type}_started"],
                "unsubscribed": False,
                "rgpd_consent": True,
                "rgpd_consent_date": now,
                "created_at": now,
            })
        else:
            await db.email_subscribers.update_one(
                {"email": email},
                {"$addToSet": {"tags": f"{sequence_type}_started"}},
            )

        # Pre-calculer les steps
        unsub_token = str(uuid.uuid4())
        steps = []
        for i, step_def in enumerate(definition["steps"]):
            scheduled = now + timedelta(hours=step_def["delay_hours"])
            steps.append({
                "step_index": i,
                "template_key": step_def["template"],
                "delay_hours": step_def["delay_hours"],
                "scheduled_at": scheduled,
                "sent_at": None,
                "status": "pending",
                "resend_id": None,
                "error": None,
            })

        sequence_doc = {
            "id": str(uuid.uuid4()),
            "subscriber_email": email,
            "subscriber_name": name,
            "sequence_type": sequence_type,
            "trigger_data": trigger_data,
            "current_step": 0,
            "total_steps": len(steps),
            "status": "active",
            "unsubscribe_token": unsub_token,
            "steps": steps,
            "pipeline_deal_id": trigger_data.get("pipeline_deal_id"),
            "created_at": now,
            "updated_at": now,
            "completed_at": None,
            "cancelled_at": None,
        }

        await db.email_sequences.insert_one(sequence_doc)
        logger.info(f"Sequence {sequence_type} demarree pour {email} ({len(steps)} steps)")

        # Log funnel event
        await db.funnel_events.insert_one({
            "id": str(uuid.uuid4()),
            "event_type": "sequence_started",
            "email": email,
            "metadata": {"sequence_type": sequence_type, "total_steps": len(steps)},
            "created_at": now,
        })

        # Envoyer le step 0 immediatement si delay=0
        if steps[0]["delay_hours"] == 0:
            await self._send_step(db, sequence_doc, 0)

        return sequence_doc

    # ─── Traiter les emails en attente (cron) ────────────────────────────

    async def process_pending_emails(self, db) -> dict:
        """Traite tous les emails dont l'heure d'envoi est passee.

        Appele par le cron Vercel toutes les 15 minutes.
        Retourne un resume {processed, sent, errors}.
        """
        now = datetime.now(timezone.utc)
        stats = {"processed": 0, "sent": 0, "errors": 0}

        # Trouver toutes les sequences actives
        cursor = db.email_sequences.find({"status": "active"})
        async for seq in cursor:
            for step in seq["steps"]:
                if step["status"] != "pending":
                    continue
                if step["scheduled_at"] > now:
                    break  # Les steps sont ordonnés, pas besoin de continuer

                stats["processed"] += 1
                success = await self._send_step(db, seq, step["step_index"])
                if success:
                    stats["sent"] += 1
                else:
                    stats["errors"] += 1

        logger.info(f"Cron sequences : {stats}")
        return stats

    # ─── Envoi d'un step ─────────────────────────────────────────────────

    async def _send_step(self, db, sequence: dict, step_index: int) -> bool:
        """Envoie un step de sequence. Idempotent."""
        step = sequence["steps"][step_index]

        # Double check idempotence
        if step["status"] == "sent":
            return True

        email = sequence["subscriber_email"]
        unsub_url = f"{SITE_URL}/api/unsubscribe?token={sequence['unsubscribe_token']}"

        try:
            subject, html = render_sequence_email(
                step["template_key"],
                {**sequence.get("trigger_data", {}), "name": sequence["subscriber_name"]},
                unsub_url,
            )

            result = self.resend.send_email(
                to=email,
                subject=subject,
                html=html,
                reply_to="contact@aissabelkoussa.fr",
                tags=[
                    {"name": "sequence", "value": sequence["sequence_type"]},
                    {"name": "step", "value": str(step_index)},
                ],
            )

            now = datetime.now(timezone.utc)

            if result:
                # Succes
                await db.email_sequences.update_one(
                    {"id": sequence["id"], f"steps.{step_index}.status": "pending"},
                    {"$set": {
                        f"steps.{step_index}.status": "sent",
                        f"steps.{step_index}.sent_at": now,
                        f"steps.{step_index}.resend_id": result.get("id"),
                        "current_step": step_index + 1,
                        "updated_at": now,
                    }},
                )

                # Verifier si la sequence est terminee
                if step_index + 1 >= sequence["total_steps"]:
                    await db.email_sequences.update_one(
                        {"id": sequence["id"]},
                        {"$set": {"status": "completed", "completed_at": now}},
                    )

                # Log funnel event
                await db.funnel_events.insert_one({
                    "id": str(uuid.uuid4()),
                    "event_type": "sequence_email_sent",
                    "email": email,
                    "metadata": {
                        "sequence_type": sequence["sequence_type"],
                        "step_index": step_index,
                        "template": step["template_key"],
                        "resend_id": result.get("id"),
                    },
                    "created_at": now,
                })

                logger.info(f"Step {step_index} envoye pour {email} ({step['template_key']})")
                return True
            else:
                await db.email_sequences.update_one(
                    {"id": sequence["id"]},
                    {"$set": {
                        f"steps.{step_index}.status": "failed",
                        f"steps.{step_index}.error": "Resend API failure",
                        "updated_at": now,
                    }},
                )
                logger.error(f"Echec envoi step {step_index} pour {email}")
                return False

        except Exception as e:
            logger.error(f"Exception lors de l'envoi step {step_index} pour {email}: {e}")
            await db.email_sequences.update_one(
                {"id": sequence["id"]},
                {"$set": {
                    f"steps.{step_index}.status": "failed",
                    f"steps.{step_index}.error": str(e)[:500],
                    "updated_at": datetime.now(timezone.utc),
                }},
            )
            return False

    # ─── Actions admin ───────────────────────────────────────────────────

    async def cancel_sequence(self, db, sequence_id: str | None = None, unsubscribe_token: str | None = None) -> bool:
        """Annule une sequence par ID ou par token d'unsubscribe."""
        query = {}
        if sequence_id:
            query["id"] = sequence_id
        elif unsubscribe_token:
            query["unsubscribe_token"] = unsubscribe_token
        else:
            return False

        now = datetime.now(timezone.utc)
        result = await db.email_sequences.update_one(
            {**query, "status": {"$in": ["active", "paused"]}},
            {"$set": {"status": "cancelled", "cancelled_at": now, "updated_at": now}},
        )

        if result.modified_count > 0:
            # Si unsubscribe, marquer le subscriber
            if unsubscribe_token:
                seq = await db.email_sequences.find_one({"unsubscribe_token": unsubscribe_token})
                if seq:
                    await db.email_subscribers.update_one(
                        {"email": seq["subscriber_email"]},
                        {"$set": {"unsubscribed": True, "unsubscribed_at": now}},
                    )
                    # Annuler aussi toutes les autres sequences actives de ce subscriber
                    await db.email_sequences.update_many(
                        {"subscriber_email": seq["subscriber_email"], "status": {"$in": ["active", "paused"]}},
                        {"$set": {"status": "cancelled", "cancelled_at": now, "updated_at": now}},
                    )
                    logger.info(f"Subscriber {seq['subscriber_email']} desabonne — toutes les sequences annulees.")
            return True
        return False

    async def pause_sequence(self, db, sequence_id: str) -> bool:
        result = await db.email_sequences.update_one(
            {"id": sequence_id, "status": "active"},
            {"$set": {"status": "paused", "updated_at": datetime.now(timezone.utc)}},
        )
        return result.modified_count > 0

    async def resume_sequence(self, db, sequence_id: str) -> bool:
        """Reprend une sequence en pause. Recalcule les dates des steps restants."""
        seq = await db.email_sequences.find_one({"id": sequence_id, "status": "paused"})
        if not seq:
            return False

        now = datetime.now(timezone.utc)
        updates = {"status": "active", "updated_at": now}

        # Recalculer les scheduled_at pour les steps pending
        for i, step in enumerate(seq["steps"]):
            if step["status"] == "pending":
                definition = SEQUENCE_DEFINITIONS.get(seq["sequence_type"], {})
                step_defs = definition.get("steps", [])
                if i < len(step_defs):
                    # Offset from now based on delay relative to the first pending step
                    first_pending_delay = step_defs[i]["delay_hours"]
                    base_delay = step_defs[seq["current_step"]]["delay_hours"] if seq["current_step"] < len(step_defs) else 0
                    relative_delay = max(0, first_pending_delay - base_delay)
                    new_scheduled = now + timedelta(hours=relative_delay)
                    updates[f"steps.{i}.scheduled_at"] = new_scheduled

        await db.email_sequences.update_one({"id": sequence_id}, {"$set": updates})
        return True
