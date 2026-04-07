"""
Routes pour le systeme de sequences email automatisees.
- Routes publiques : trigger, process (cron), unsubscribe
- Routes admin : list, detail, actions, stats
"""

import os
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel, EmailStr
from typing import Optional

logger = logging.getLogger(__name__)

sequence_router = APIRouter(prefix="/api")

# ─── Modeles Pydantic ────────────────────────────────────────────────────────

class TriggerSequenceRequest(BaseModel):
    email: EmailStr
    name: str
    sequence_type: str  # post_diagnostic, post_purchase, post_tripwire, lead_magnet
    trigger_data: dict = {}


class SequenceActionRequest(BaseModel):
    action: str  # pause, resume, cancel


# ─── DB & Service access ────────────────────────────────────────────────────

_db = None
_sequence_service = None

def init_sequence_routes(db, sequence_service):
    """Appele au demarrage depuis server.py pour injecter les dependances."""
    global _db, _sequence_service
    _db = db
    _sequence_service = sequence_service


# ─── Routes publiques ────────────────────────────────────────────────────────

@sequence_router.post("/sequences/trigger")
async def trigger_sequence(data: TriggerSequenceRequest):
    """Demarre une sequence email. Appele par le frontend ou les webhooks."""
    if not _sequence_service:
        raise HTTPException(status_code=503, detail="Service non initialise")

    result = await _sequence_service.start_sequence(
        _db,
        email=data.email,
        name=data.name,
        sequence_type=data.sequence_type,
        trigger_data=data.trigger_data,
    )

    if result:
        return {"success": True, "sequence_id": result["id"], "steps": result["total_steps"]}
    return {"success": False, "message": "Sequence non demarree (doublon, desabonne, ou type invalide)"}


@sequence_router.post("/sequences/process")
async def process_sequences(request: Request):
    """Traite les emails en attente. Appele par le cron Vercel toutes les 15 min."""
    # Verifier le secret cron
    cron_secret = os.getenv("CRON_SECRET", "")
    auth_header = request.headers.get("x-cron-secret", "")
    if not cron_secret or auth_header != cron_secret:
        raise HTTPException(status_code=401, detail="Cron secret invalide")

    if not _sequence_service:
        raise HTTPException(status_code=503, detail="Service non initialise")

    stats = await _sequence_service.process_pending_emails(_db)
    return {"success": True, **stats}


@sequence_router.get("/sequences/unsubscribe")
async def unsubscribe(token: str = Query(...)):
    """Desabonnement par token. Redirige vers la page de confirmation."""
    if not _sequence_service:
        raise HTTPException(status_code=503, detail="Service non initialise")

    success = await _sequence_service.cancel_sequence(_db, unsubscribe_token=token)
    if success:
        return {"success": True, "message": "Desabonnement effectue"}
    return {"success": False, "message": "Token invalide ou sequence deja terminee"}


# ─── Routes admin (protegees par JWT via le middleware existant) ──────────────

@sequence_router.get("/admin/sequences")
async def list_sequences(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    sequence_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    """Liste paginee des sequences email."""
    # Auth check (le middleware admin_routes verifie deja le cookie)
    from services.auth_service import get_current_admin
    admin = await get_current_admin(request, _db)
    if not admin:
        raise HTTPException(status_code=401, detail="Non autorise")

    query = {}
    if status:
        query["status"] = status
    if sequence_type:
        query["sequence_type"] = sequence_type
    if search:
        query["$or"] = [
            {"subscriber_email": {"$regex": search, "$options": "i"}},
            {"subscriber_name": {"$regex": search, "$options": "i"}},
        ]

    total = await _db.email_sequences.count_documents(query)
    skip = (page - 1) * per_page

    cursor = _db.email_sequences.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(per_page)
    sequences = await cursor.to_list(length=per_page)

    return {
        "sequences": sequences,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": max(1, -(-total // per_page)),
    }


@sequence_router.get("/admin/sequences/stats")
async def sequence_stats(request: Request):
    """Statistiques agregees des sequences."""
    from services.auth_service import get_current_admin
    admin = await get_current_admin(request, _db)
    if not admin:
        raise HTTPException(status_code=401, detail="Non autorise")

    total_active = await _db.email_sequences.count_documents({"status": "active"})
    total_completed = await _db.email_sequences.count_documents({"status": "completed"})
    total_cancelled = await _db.email_sequences.count_documents({"status": "cancelled"})
    total_paused = await _db.email_sequences.count_documents({"status": "paused"})

    # Emails envoyes aujourd'hui
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    pipeline = [
        {"$unwind": "$steps"},
        {"$match": {"steps.status": "sent", "steps.sent_at": {"$gte": today_start}}},
        {"$count": "count"},
    ]
    sent_today_result = await _db.email_sequences.aggregate(pipeline).to_list(1)
    sent_today = sent_today_result[0]["count"] if sent_today_result else 0

    # Emails en attente
    pending_pipeline = [
        {"$match": {"status": "active"}},
        {"$unwind": "$steps"},
        {"$match": {"steps.status": "pending"}},
        {"$count": "count"},
    ]
    pending_result = await _db.email_sequences.aggregate(pending_pipeline).to_list(1)
    pending = pending_result[0]["count"] if pending_result else 0

    # Taux de desabonnement
    total_subscribers = await _db.email_subscribers.count_documents({})
    unsubscribed = await _db.email_subscribers.count_documents({"unsubscribed": True})
    unsub_rate = round(unsubscribed / total_subscribers * 100, 1) if total_subscribers else 0

    # Par type
    by_type = {}
    for stype in ["post_diagnostic", "post_purchase", "post_tripwire", "lead_magnet"]:
        by_type[stype] = await _db.email_sequences.count_documents({"sequence_type": stype, "status": "active"})

    return {
        "total_active": total_active,
        "total_completed": total_completed,
        "total_cancelled": total_cancelled,
        "total_paused": total_paused,
        "emails_sent_today": sent_today,
        "emails_pending": pending,
        "unsubscribe_rate": unsub_rate,
        "by_type": by_type,
    }


@sequence_router.get("/admin/sequences/{sequence_id}")
async def get_sequence(sequence_id: str, request: Request):
    """Detail d'une sequence."""
    from services.auth_service import get_current_admin
    admin = await get_current_admin(request, _db)
    if not admin:
        raise HTTPException(status_code=401, detail="Non autorise")

    seq = await _db.email_sequences.find_one({"id": sequence_id}, {"_id": 0})
    if not seq:
        raise HTTPException(status_code=404, detail="Sequence introuvable")
    return seq


@sequence_router.patch("/admin/sequences/{sequence_id}")
async def update_sequence(sequence_id: str, data: SequenceActionRequest, request: Request):
    """Pause, resume ou cancel une sequence."""
    from services.auth_service import get_current_admin
    admin = await get_current_admin(request, _db)
    if not admin:
        raise HTTPException(status_code=401, detail="Non autorise")

    if data.action == "pause":
        ok = await _sequence_service.pause_sequence(_db, sequence_id)
    elif data.action == "resume":
        ok = await _sequence_service.resume_sequence(_db, sequence_id)
    elif data.action == "cancel":
        ok = await _sequence_service.cancel_sequence(_db, sequence_id=sequence_id)
    else:
        raise HTTPException(status_code=400, detail="Action invalide (pause/resume/cancel)")

    if ok:
        return {"success": True, "action": data.action}
    raise HTTPException(status_code=404, detail="Sequence introuvable ou action impossible")


@sequence_router.get("/admin/funnels/stats")
async def funnel_stats(request: Request):
    """Statistiques de conversion des funnels."""
    from services.auth_service import get_current_admin
    admin = await get_current_admin(request, _db)
    if not admin:
        raise HTTPException(status_code=401, detail="Non autorise")

    # Compter les evenements funnel
    event_counts = {}
    for evt in [
        "diagnostic_started", "diagnostic_completed", "email_captured",
        "sequence_started", "sequence_email_sent",
        "tripwire_viewed", "tripwire_purchased",
        "upsell_shown", "upsell_accepted", "upsell_skipped",
        "lead_magnet_downloaded", "purchase",
    ]:
        event_counts[evt] = await _db.funnel_events.count_documents({"event_type": evt})

    # Revenus tripwire
    tripwire_revenue_pipeline = [
        {"$match": {"event_type": "tripwire_purchased"}},
        {"$group": {"_id": None, "total": {"$sum": "$metadata.amount"}}},
    ]
    tripwire_rev = await _db.funnel_events.aggregate(tripwire_revenue_pipeline).to_list(1)
    tripwire_revenue = tripwire_rev[0]["total"] if tripwire_rev else 0

    # Taux de conversion
    def rate(num_key, den_key):
        den = event_counts.get(den_key, 0)
        return round(event_counts.get(num_key, 0) / den * 100, 1) if den else 0

    conversion_rates = {
        "diagnostic_to_email": rate("email_captured", "diagnostic_completed"),
        "email_to_sequence": rate("sequence_started", "email_captured"),
        "sequence_to_purchase": rate("purchase", "sequence_started"),
        "tripwire_to_purchase": rate("tripwire_purchased", "tripwire_viewed"),
        "upsell_acceptance": rate("upsell_accepted", "upsell_shown"),
    }

    return {
        **event_counts,
        "tripwire_revenue": tripwire_revenue,
        "conversion_rates": conversion_rates,
    }
