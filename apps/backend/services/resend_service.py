import os
import logging
import requests

try:
    import html2text as _html2text_mod
    _h2t = _html2text_mod.HTML2Text()
    _h2t.ignore_images = True
    _h2t.body_width = 80
    _H2T_AVAILABLE = True
except Exception:  # pragma: no cover — optional dependency
    _h2t = None
    _H2T_AVAILABLE = False

logger = logging.getLogger(__name__)

RESEND_API_URL = "https://api.resend.com/emails"
FROM_ADDRESS = "Aïssa BELKOUSSA <contact@aissabelkoussa.fr>"
CONTACT_EMAIL = "contact@aissabelkoussa.fr"


def _auto_text_from_html(html: str) -> str | None:
    """Generate a plain-text fallback from HTML via html2text (if installed)."""
    if not _H2T_AVAILABLE or _h2t is None:
        return None
    try:
        return _h2t.handle(html)
    except Exception as e:
        logger.warning(f"html2text conversion failed: {e}")
        return None


def _build_default_headers(unsubscribe_url: str | None) -> dict[str, str]:
    headers: dict[str, str] = {}
    if unsubscribe_url:
        headers["List-Unsubscribe"] = (
            f"<{unsubscribe_url}>, <mailto:{CONTACT_EMAIL}?subject=Unsubscribe>"
        )
        headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"
    return headers


class ResendService:
    """Service d'envoi d'emails via l'API Resend."""

    def __init__(self):
        self.api_key = os.getenv("RESEND_API_KEY", "")
        if not self.api_key:
            logger.warning(
                "RESEND_API_KEY non defini — les sequences email ne fonctionneront pas."
            )

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
        text: str | None = None,
        headers: dict[str, str] | None = None,
        tag: str | None = None,
        unsubscribe_url: str | None = None,
    ) -> dict | None:
        """Envoie un email via Resend.

        Retourne {'id': 're_xxx'} ou None si echec.

        Params:
            to: destinataire principal
            subject: sujet
            html: corps HTML
            reply_to: adresse Reply-To optionnelle
            tags: tags Resend bruts (forme native [{name, value}, ...])
            text: plain-text alternative (auto-generee depuis html si None et html2text dispo)
            headers: headers SMTP additionnels (fusionnes avec defauts List-Unsubscribe)
            tag: raccourci — ajoute {"name": "category", "value": tag} aux tags
            unsubscribe_url: si fourni, injecte List-Unsubscribe + List-Unsubscribe-Post
        """
        if not self.available:
            logger.error("Resend non configure — email non envoye.")
            return None

        # Auto plain-text fallback
        if text is None:
            text = _auto_text_from_html(html)

        # Merge headers (defaults from unsubscribe_url + caller-provided)
        merged_headers = _build_default_headers(unsubscribe_url)
        if headers:
            merged_headers.update(headers)

        # Tags: accept both raw list and shortcut `tag`
        merged_tags: list[dict] = list(tags) if tags else []
        if tag:
            merged_tags.append({"name": "category", "value": tag})

        payload: dict = {
            "from": FROM_ADDRESS,
            "to": [to],
            "subject": subject,
            "html": html,
        }
        if text:
            payload["text"] = text
        if reply_to:
            payload["reply_to"] = reply_to
        if merged_tags:
            payload["tags"] = merged_tags
        if merged_headers:
            payload["headers"] = merged_headers

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
                logger.info(
                    f"Email envoye via Resend a {to} — id={data.get('id')}"
                )
                return data
            logger.error(f"Resend erreur {resp.status_code}: {resp.text}")
            return None
        except Exception as e:
            logger.error(f"Resend exception: {e}")
            return None
