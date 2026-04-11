import os
import logging
import requests

logger = logging.getLogger(__name__)

TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
REQUEST_TIMEOUT_SECONDS = 10


class TurnstileService:
    """Vérifie les tokens Cloudflare Turnstile côté serveur.

    Comportement :
    - Si TURNSTILE_SECRET_KEY absent → bypass total (mode dev), verify() retourne (True, None).
    - Si token absent alors que le service est configuré → (False, "missing-token").
    - Si Cloudflare répond success:true → (True, None).
    - Si Cloudflare répond success:false → (False, <error-code>).
    - Si timeout ou exception réseau → fail-open (True, "fail-open") pour ne pas bloquer le form.
    """

    def __init__(self) -> None:
        self.secret_key = os.getenv("TURNSTILE_SECRET_KEY", "")
        if not self.secret_key:
            logger.warning(
                "TURNSTILE_SECRET_KEY non défini — Turnstile est en mode bypass (dev local). "
                "Le filtrage bot repose uniquement sur SpamProtection."
            )

    @property
    def available(self) -> bool:
        return bool(self.secret_key)

    def verify(self, token: str | None, remote_ip: str | None) -> tuple[bool, str | None]:
        if not self.available:
            return True, None

        if not token:
            logger.warning("Turnstile token missing from submission while service is configured")
            return False, "missing-token"

        payload = {
            "secret": self.secret_key,
            "response": token,
        }
        if remote_ip:
            payload["remoteip"] = remote_ip

        try:
            response = requests.post(
                TURNSTILE_VERIFY_URL,
                data=payload,
                timeout=REQUEST_TIMEOUT_SECONDS,
            )
        except requests.Timeout:
            logger.error("Turnstile API timeout — fail-open, submission allowed")
            return True, "fail-open"
        except requests.RequestException as exc:
            logger.error(f"Turnstile API exception: {exc} — fail-open, submission allowed")
            return True, "fail-open"

        if response.status_code != 200:
            logger.error(
                f"Turnstile API non-200: {response.status_code} {response.text} — fail-open"
            )
            return True, "fail-open"

        try:
            data = response.json()
        except ValueError:
            logger.error("Turnstile API returned non-JSON — fail-open")
            return True, "fail-open"

        success = bool(data.get("success"))
        if success:
            return True, None

        error_codes = data.get("error-codes") or []
        first_error = error_codes[0] if error_codes else "unknown-error"
        logger.warning(f"Turnstile verification failed: {first_error} (full: {error_codes})")
        return False, first_error
