import os
import logging
import requests

logger = logging.getLogger(__name__)

RESEND_API_URL = "https://api.resend.com/emails"
FROM_ADDRESS = "Aïssa BELKOUSSA <contact@aissabelkoussa.fr>"


class ResendService:
    """Service d'envoi d'emails via l'API Resend."""

    def __init__(self):
        self.api_key = os.getenv("RESEND_API_KEY", "")
        if not self.api_key:
            logger.warning("RESEND_API_KEY non defini — les sequences email ne fonctionneront pas.")

    @property
    def available(self) -> bool:
        return bool(self.api_key)

    def send_email(
        self,
        to: str,
        subject: str,
        html: str,
        reply_to: str | None = None,
        tags: list[dict] | None = None,
    ) -> dict | None:
        """Envoie un email via Resend. Retourne {'id': 're_xxx'} ou None si echec."""
        if not self.available:
            logger.error("Resend non configure — email non envoye.")
            return None

        payload: dict = {
            "from": FROM_ADDRESS,
            "to": [to],
            "subject": subject,
            "html": html,
        }
        if reply_to:
            payload["reply_to"] = reply_to
        if tags:
            payload["tags"] = tags

        try:
            resp = requests.post(
                RESEND_API_URL,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=15,
            )
            if 200 <= resp.status_code < 300:
                data = resp.json()
                logger.info(f"Email envoye via Resend a {to} — id={data.get('id')}")
                return data
            logger.error(f"Resend erreur {resp.status_code}: {resp.text}")
            return None
        except Exception as e:
            logger.error(f"Resend exception: {e}")
            return None
