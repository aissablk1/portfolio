# Resend en tête de chaîne + Cloudflare Turnstile — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promouvoir Resend comme canal email principal (avec chaîne legacy SMTP → formsubmit → mailthis en fallback) et ajouter Cloudflare Turnstile en amont du spam check custom, sans supprimer de code existant.

**Architecture:** Add-on pur. Un nouveau `TurnstileService` s'insère avant `SpamProtection` dans le endpoint `/api/contact`. `EmailService.send_contact_notification()` et `send_auto_reply()` tentent Resend en premier, puis retombent sur la chaîne existante en cas d'échec. Le frontend ajoute le widget `@marsidev/react-turnstile` qui injecte un token dans le payload POST.

**Tech Stack:** FastAPI + Pydantic + pytest (backend) · Next.js 15 + React + TypeScript + `@marsidev/react-turnstile` (frontend) · Resend API · Cloudflare Turnstile API

**Spec référence :** `docs/superpowers/specs/2026-04-11-resend-turnstile-design.md`

---

## File Structure

### Backend (Python / FastAPI)

| Fichier | Action | Responsabilité |
|---|---|---|
| `apps/backend/services/turnstile_service.py` | **CRÉER** | Wrapper autour de l'API Cloudflare `siteverify`. Expose `verify(token, ip) → (bool, error_code)`. Bypass si `TURNSTILE_SECRET_KEY` absent. Fail-open sur timeout. |
| `apps/backend/models.py` | MODIFIER (lignes 6-10) | Ajouter `cf_turnstile_token: Optional[str] = None` à `ContactFormData`. |
| `apps/backend/server.py` | MODIFIER (lignes 33-40, 90-110) | Instancier `turnstile_service`, ajouter l'appel `verify()` au début de `submit_contact_form()` avant le rate limit. |
| `apps/backend/services/email_service.py` | MODIFIER | Ajouter `_get_resend()` lazy, modifier `send_contact_notification()` et `send_auto_reply()` pour tenter Resend avant la chaîne existante. Extraire `_render_auto_reply_html()` depuis `send_auto_reply()` pour éviter duplication. |
| `apps/backend/test_api.py` | ÉTENDRE | Ajouter 7 tests unitaires (voir tâches). |

### Frontend (Next.js / React)

| Fichier | Action | Responsabilité |
|---|---|---|
| `apps/frontend/package.json` | MODIFIER | Ajouter `@marsidev/react-turnstile: ^1.1.0`. |
| `apps/frontend/src/components/ContactForm.tsx` | MODIFIER | Importer `<Turnstile>`, gérer l'état `cfToken`, inclure dans le submit payload. |

### Config / Env

| Fichier | Action |
|---|---|
| `.env.example` | Ajouter `TURNSTILE_SITE_KEY=` et `TURNSTILE_SECRET_KEY=` (backend) + `NEXT_PUBLIC_TURNSTILE_SITE_KEY=` (frontend) |
| `.env.local` (git-ignored) | L'utilisateur ajoute ses vraies clés (manuel, pas dans le plan) |
| Dashboard Render (env vars prod) | `TURNSTILE_SECRET_KEY` |
| Dashboard Vercel (env vars prod) | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` |

---

## Task 1: TurnstileService — création + tests unitaires

**Files:**
- Create: `apps/backend/services/turnstile_service.py`
- Test: `apps/backend/test_api.py` (append)

### Step 1.1: Écrire les 4 tests en échec

- [ ] **Step 1.1** — Ajouter les tests à `apps/backend/test_api.py` (append en fin de fichier)

```python
# ============================================================
# Tests Turnstile
# ============================================================
import pytest
from unittest.mock import patch, MagicMock
from services.turnstile_service import TurnstileService


def test_turnstile_bypass_when_secret_missing(monkeypatch):
    """Si TURNSTILE_SECRET_KEY absent, le service est en bypass et verify retourne (True, None)."""
    monkeypatch.delenv("TURNSTILE_SECRET_KEY", raising=False)
    service = TurnstileService()
    assert service.available is False
    success, error = service.verify("any-token", "1.2.3.4")
    assert success is True
    assert error is None


def test_turnstile_verify_valid_token(monkeypatch):
    """Avec un token valide, Cloudflare répond success:true et le service retourne (True, None)."""
    monkeypatch.setenv("TURNSTILE_SECRET_KEY", "test-secret")
    with patch("services.turnstile_service.requests.post") as mock_post:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"success": True, "error-codes": []}
        mock_post.return_value = mock_response

        service = TurnstileService()
        success, error = service.verify("valid-token", "1.2.3.4")

    assert success is True
    assert error is None


def test_turnstile_verify_invalid_token(monkeypatch):
    """Avec un token invalide, Cloudflare répond success:false et le service retourne (False, code)."""
    monkeypatch.setenv("TURNSTILE_SECRET_KEY", "test-secret")
    with patch("services.turnstile_service.requests.post") as mock_post:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "success": False,
            "error-codes": ["invalid-input-response"],
        }
        mock_post.return_value = mock_response

        service = TurnstileService()
        success, error = service.verify("invalid-token", "1.2.3.4")

    assert success is False
    assert error == "invalid-input-response"


def test_turnstile_fail_open_on_timeout(monkeypatch):
    """Si Cloudflare timeout, fail-open : (True, 'fail-open') pour ne pas bloquer le form."""
    monkeypatch.setenv("TURNSTILE_SECRET_KEY", "test-secret")
    import requests as _requests
    with patch("services.turnstile_service.requests.post", side_effect=_requests.Timeout()):
        service = TurnstileService()
        success, error = service.verify("any-token", "1.2.3.4")

    assert success is True
    assert error == "fail-open"


def test_turnstile_missing_token_when_configured(monkeypatch):
    """Si secret configuré mais token absent dans la requête, retourne (False, 'missing-token')."""
    monkeypatch.setenv("TURNSTILE_SECRET_KEY", "test-secret")
    service = TurnstileService()
    success, error = service.verify(None, "1.2.3.4")
    assert success is False
    assert error == "missing-token"
```

- [ ] **Step 1.2** — Lancer les tests pour vérifier qu'ils échouent (ImportError)

Run: `cd apps/backend && pytest test_api.py -v -k turnstile`
Expected: `ERROR` ou `ModuleNotFoundError: No module named 'services.turnstile_service'` — les 5 tests n'existent pas encore parce que l'import échoue.

### Step 1.2: Créer TurnstileService

- [ ] **Step 1.3** — Créer `apps/backend/services/turnstile_service.py`

```python
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
```

- [ ] **Step 1.4** — Relancer les tests

Run: `cd apps/backend && pytest test_api.py -v -k turnstile`
Expected: `5 passed` (bypass, valid, invalid, timeout, missing-token)

- [ ] **Step 1.5** — Commit

```bash
git add apps/backend/services/turnstile_service.py apps/backend/test_api.py
git commit -m "feat(backend): add TurnstileService with 5 unit tests"
```

---

## Task 2: Ajouter `cf_turnstile_token` au modèle Pydantic

**Files:**
- Modify: `apps/backend/models.py` (lines 6-10)

- [ ] **Step 2.1** — Écrire le test en échec (append à `test_api.py`)

```python
def test_contact_form_data_accepts_turnstile_token():
    """ContactFormData accepte un champ cf_turnstile_token optionnel."""
    from models import ContactFormData
    data = ContactFormData(
        name="Test User",
        email="test@example.com",
        subject="Test subject de test",
        message="Ceci est un message de test suffisamment long.",
        cf_turnstile_token="0.abcdef-test-token",
    )
    assert data.cf_turnstile_token == "0.abcdef-test-token"


def test_contact_form_data_turnstile_token_optional():
    """Le champ cf_turnstile_token est optionnel (supporte le mode dégradé)."""
    from models import ContactFormData
    data = ContactFormData(
        name="Test User",
        email="test@example.com",
        subject="Test subject de test",
        message="Ceci est un message de test suffisamment long.",
    )
    assert data.cf_turnstile_token is None
```

- [ ] **Step 2.2** — Lancer pour vérifier l'échec

Run: `cd apps/backend && pytest test_api.py -v -k "turnstile_token"`
Expected: `FAILED` avec `ValidationError: extra field not permitted` ou `AttributeError`.

- [ ] **Step 2.3** — Modifier `apps/backend/models.py` — remplacer la classe `ContactFormData` :

```python
class ContactFormData(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)
    cf_turnstile_token: Optional[str] = Field(default=None, max_length=2048)
```

- [ ] **Step 2.4** — Relancer

Run: `cd apps/backend && pytest test_api.py -v -k "turnstile_token"`
Expected: `2 passed`

- [ ] **Step 2.5** — Commit

```bash
git add apps/backend/models.py apps/backend/test_api.py
git commit -m "feat(backend): add cf_turnstile_token field to ContactFormData"
```

---

## Task 3: Wire TurnstileService dans `/api/contact`

**Files:**
- Modify: `apps/backend/server.py` (lines 33-40 + 96-110)

- [ ] **Step 3.1** — Modifier `apps/backend/server.py` — **section import/services** (autour ligne 8-14) pour ajouter l'import :

Remplacer :
```python
from services.resend_service import ResendService
```
par :
```python
from services.resend_service import ResendService
from services.turnstile_service import TurnstileService
```

- [ ] **Step 3.2** — Dans la même section services (autour ligne 34-39), ajouter l'instanciation :

Remplacer :
```python
# Services
email_service = EmailService()
spam_protection = SpamProtection()
notification_service = NotificationService()
storage_service = StorageService()
resend_service = ResendService()
sequence_service = SequenceService(resend_service)
```
par :
```python
# Services
email_service = EmailService()
spam_protection = SpamProtection()
notification_service = NotificationService()
storage_service = StorageService()
resend_service = ResendService()
sequence_service = SequenceService(resend_service)
turnstile_service = TurnstileService()
```

- [ ] **Step 3.3** — Modifier `submit_contact_form()` — insérer la vérif Turnstile **juste après** `user_agent = get_user_agent(request)` et **avant** le rate limit (autour ligne 100) :

Remplacer :
```python
        logger.info(f"Contact form submission from {ip_address}: {form_data.name} <{form_data.email}>")
        
        # Rate limiting check
        if not spam_protection.check_rate_limit(ip_address):
```
par :
```python
        logger.info(f"Contact form submission from {ip_address}: {form_data.name} <{form_data.email}>")

        # Turnstile verification (bot filter upstream of custom spam check)
        ts_success, ts_error = turnstile_service.verify(form_data.cf_turnstile_token, ip_address)
        if not ts_success:
            logger.warning(f"Turnstile rejected submission from {ip_address}: {ts_error}")
            raise HTTPException(
                status_code=403,
                detail="Vérification anti-robot échouée. Veuillez réessayer.",
            )

        # Rate limiting check
        if not spam_protection.check_rate_limit(ip_address):
```

- [ ] **Step 3.4** — Test d'intégration rapide : démarrer le backend local et envoyer un POST sans token

Run :
```bash
cd apps/backend && python start.py &
sleep 3
curl -sS -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.fr","subject":"Sujet test","message":"Message de test assez long pour passer la validation Pydantic."}'
kill %1 2>/dev/null
```

Expected (si `TURNSTILE_SECRET_KEY` absent dans .env.local) : 200 ou 429, formulaire passé (bypass mode).
Expected (si `TURNSTILE_SECRET_KEY` présent) : 403 `{"detail":"Vérification anti-robot échouée. Veuillez réessayer."}`

- [ ] **Step 3.5** — Commit

```bash
git add apps/backend/server.py
git commit -m "feat(backend): wire TurnstileService into /api/contact endpoint"
```

---

## Task 4: Extraire `_render_auto_reply_html()` dans `EmailService`

**Files:**
- Modify: `apps/backend/services/email_service.py` (méthode `send_auto_reply`)

- [ ] **Step 4.1** — Écrire le test de non-régression (append à `test_api.py`)

```python
def test_email_service_render_auto_reply_html_exists():
    """La méthode privée _render_auto_reply_html existe et retourne un string non vide."""
    from services.email_service import EmailService
    svc = EmailService()
    html = svc._render_auto_reply_html({
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test subject",
        "message": "Test message",
        "id": "test-id",
        "ip_address": "1.2.3.4",
    })
    assert isinstance(html, str)
    assert "Test User" in html
    assert "Test subject" in html
    assert "<!DOCTYPE html>" in html or "<html" in html
```

- [ ] **Step 4.2** — Lancer pour vérifier l'échec

Run: `cd apps/backend && pytest test_api.py -v -k "render_auto_reply"`
Expected: `AttributeError: 'EmailService' object has no attribute '_render_auto_reply_html'`

- [ ] **Step 4.3** — Modifier `apps/backend/services/email_service.py` — ajouter la méthode `_render_auto_reply_html()` et refactoriser `send_auto_reply()` pour l'appeler.

Ajouter cette méthode **avant** `send_contact_notification()` dans la classe `EmailService` :

```python
    def _render_auto_reply_html(self, submission_data: dict) -> str:
        """Rendu du corps HTML de l'auto-reply (extrait de send_auto_reply pour réutilisation)."""
        safe_name = html_escape(str(submission_data['name']))
        safe_subject = html_escape(str(submission_data['subject']))
        whatsapp_number = os.getenv("ADMIN_WHATSAPP_NUMBER", "")
        inner_body = f"""
<h2 style="color:#fff;font-size:20px;margin:0 0 24px;">Merci pour votre message, {safe_name} !</h2>

<p>Bonjour <strong style="color:#fff;">{safe_name}</strong>,</p>
<p>Merci d'avoir pris le temps de me contacter via mon portfolio. J'ai bien re&ccedil;u votre message concernant &laquo;&nbsp;<em style="color:#8b5cf6;">{safe_subject}</em>&nbsp;&raquo;.</p>

<div style="background:#161616;padding:20px;border-radius:8px;margin:24px 0;border:1px solid #222;">
  <p style="color:#fff;font-size:16px;margin:0 0 12px;font-weight:600;">Prochaines &eacute;tapes</p>
  <p style="margin:0 0 12px;">Je reviendrai vers vous dans les <strong style="color:#fff;">24-48h</strong> pour &eacute;tudier votre demande en d&eacute;tail.</p>
  <p style="margin:0 0 16px;">Pour une r&eacute;ponse plus rapide, n'h&eacute;sitez pas &agrave; me contacter directement sur WhatsApp :</p>
  <p style="text-align:center;margin:0;">
    <a href="https://wa.me/{whatsapp_number}" style="background:#25d366;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:600;">Discuter sur WhatsApp</a>
  </p>
</div>

<div style="background:#161616;padding:20px;border-radius:8px;margin:24px 0;border-left:3px solid #8b5cf6;">
  <p style="color:#fff;font-size:16px;margin:0 0 12px;font-weight:600;">En attendant</p>
  <p style="margin:0;">N'h&eacute;sitez pas &agrave; :</p>
  <ul style="padding-left:20px;margin:8px 0 0;">
    <li style="margin:4px 0;"><a href="https://github.com/aissablk1" style="color:#8b5cf6;text-decoration:none;">Consulter mes r&eacute;alisations sur GitHub</a></li>
    <li style="margin:4px 0;"><a href="https://t.me/investwithaissa" style="color:#8b5cf6;text-decoration:none;">Suivre mon actualit&eacute; sur Telegram</a></li>
    <li style="margin:4px 0;"><a href="https://linkedin.com/in/aissabelkoussa" style="color:#8b5cf6;text-decoration:none;">Me retrouver sur LinkedIn</a></li>
  </ul>
</div>

<p style="text-align:center;color:#999;margin-top:24px;">&Agrave; tr&egrave;s bient&ocirc;t,<br><strong style="color:#fff;">A&Iuml;SSA BELKOUSSA</strong><br><span style="font-style:italic;font-size:13px;">Entrepreneur &bull; D&eacute;veloppeur &bull; Cr&eacute;ateur</span></p>"""
        return _branded_email(f"Message recu - {submission_data['subject']}", inner_body)
```

Puis **dans `send_auto_reply()`**, remplacer le bloc qui construit `inner_body` et appelle `_branded_email()` par un appel à la nouvelle méthode. Le nouveau corps de `send_auto_reply()` devient :

```python
    def send_auto_reply(self, submission_data: dict) -> bool:
        """Send automatic reply to the person who submitted the form"""
        try:
            if not all([self.email_user, self.email_password]):
                logger.warning("Email configuration missing. Cannot send auto-reply.")
                return False

            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = submission_data['email']
            msg['Subject'] = f"✅ Message reçu - {submission_data['subject']}"

            body = self._render_auto_reply_html(submission_data)
            msg.attach(MIMEText(body, 'html'))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_user, self.email_password)
                server.send_message(msg)

            logger.info(f"Auto-reply sent successfully to {submission_data['email']}")
            return True

        except Exception as e:
            logger.error(f"Failed to send auto-reply: {str(e)}")
            return False
```

- [ ] **Step 4.4** — Relancer les tests

Run: `cd apps/backend && pytest test_api.py -v -k "render_auto_reply"`
Expected: `1 passed`

Run aussi la suite complète pour vérifier qu'aucun test existant n'est cassé :
`cd apps/backend && pytest test_api.py -v`
Expected: tous les tests au vert.

- [ ] **Step 4.5** — Commit

```bash
git add apps/backend/services/email_service.py apps/backend/test_api.py
git commit -m "refactor(email): extract _render_auto_reply_html for reuse across channels"
```

---

## Task 5: `send_contact_notification` tente Resend en premier

**Files:**
- Modify: `apps/backend/services/email_service.py` (méthodes `__init__` + `send_contact_notification`)

- [ ] **Step 5.1** — Écrire les tests (append à `test_api.py`)

```python
def test_email_chain_resend_primary_for_notification(monkeypatch):
    """Si Resend est available et send_email retourne un dict, SMTP ne doit pas être appelé."""
    from services.email_service import EmailService
    from services.resend_service import ResendService

    svc = EmailService()
    svc.recipient_email = "dest@example.com"
    svc.email_user = "user@gmail.com"
    svc.email_password = "pwd"

    fake_resend = ResendService()
    fake_resend.api_key = "test-key"
    fake_resend.send_email = MagicMock(return_value={"id": "re_abc123"})
    svc._resend = fake_resend

    with patch.object(svc, "_send_via_smtp", return_value=True) as mock_smtp:
        result = svc.send_contact_notification({
            "id": "x", "name": "N", "email": "e@e.fr",
            "subject": "S", "message": "M", "ip_address": "1.1.1.1",
        })

    assert result is True
    fake_resend.send_email.assert_called_once()
    mock_smtp.assert_not_called()


def test_email_chain_falls_back_to_smtp_when_resend_fails(monkeypatch):
    """Si Resend retourne None, SMTP doit être appelé."""
    from services.email_service import EmailService
    from services.resend_service import ResendService

    svc = EmailService()
    svc.recipient_email = "dest@example.com"
    svc.email_user = "user@gmail.com"
    svc.email_password = "pwd"

    fake_resend = ResendService()
    fake_resend.api_key = "test-key"
    fake_resend.send_email = MagicMock(return_value=None)
    svc._resend = fake_resend

    with patch.object(svc, "_send_via_smtp", return_value=True) as mock_smtp:
        result = svc.send_contact_notification({
            "id": "x", "name": "N", "email": "e@e.fr",
            "subject": "S", "message": "M", "ip_address": "1.1.1.1",
        })

    assert result is True
    fake_resend.send_email.assert_called_once()
    mock_smtp.assert_called_once()
```

- [ ] **Step 5.2** — Lancer pour vérifier l'échec

Run: `cd apps/backend && pytest test_api.py -v -k "email_chain"`
Expected: `AttributeError` sur `svc._resend` ou tests failed — l'attribut n'existe pas encore.

- [ ] **Step 5.3** — Modifier `apps/backend/services/email_service.py`

**A)** Dans `__init__`, ajouter l'attribut lazy :

```python
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.email_user = os.getenv('EMAIL_USER')
        self.email_password = os.getenv('EMAIL_PASSWORD')
        self.recipient_email = os.getenv('RECIPIENT_EMAIL')
        self.fallback_provider = os.getenv('EMAIL_FALLBACK_PROVIDER', 'formsubmit').lower()
        self._resend = None  # lazy ResendService, initialisé à la première utilisation
```

**B)** Ajouter une méthode helper juste sous `__init__` :

```python
    def _get_resend(self):
        """Lazy init du ResendService pour éviter une dépendance cyclique à l'import."""
        if self._resend is None:
            from services.resend_service import ResendService
            self._resend = ResendService()
        return self._resend
```

**C)** Remplacer entièrement la méthode `send_contact_notification()` par :

```python
    def send_contact_notification(self, submission_data: dict) -> bool:
        """Send email notification for new contact form submission.

        Chaîne : Resend → SMTP Gmail → formsubmit.co → mailthis.to.
        """
        # 1. Tentative Resend (nouveau canal principal)
        resend = self._get_resend()
        if resend.available and self.recipient_email:
            result = resend.send_email(
                to=self.recipient_email,
                subject=f"🔔 Nouveau contact portfolio - {submission_data['subject']}",
                html=self._render_html_body(submission_data),
                reply_to=submission_data.get('email'),
                tags=[{"name": "type", "value": "contact-notification"}],
            )
            if result is not None:
                return True
            logger.warning("Resend a échoué pour la notif contact, fallback SMTP")

        # 2. Chaîne existante (SMTP → formsubmit → mailthis) — INCHANGÉE
        if self.email_user and self.email_password and self.recipient_email:
            return self._send_via_smtp(submission_data)

        if self.recipient_email:
            if self.fallback_provider == 'mailthis':
                return self._send_via_mailthis(submission_data)
            return self._send_via_formsubmit(submission_data)

        logger.warning("No recipient configured; skipping email notification")
        return False
```

- [ ] **Step 5.4** — Relancer

Run: `cd apps/backend && pytest test_api.py -v -k "email_chain"`
Expected: `2 passed`

Run full suite pour non-régression : `cd apps/backend && pytest test_api.py -v`
Expected: tout vert.

- [ ] **Step 5.5** — Commit

```bash
git add apps/backend/services/email_service.py apps/backend/test_api.py
git commit -m "feat(email): promote Resend to primary channel for contact notification"
```

---

## Task 6: `send_auto_reply` tente Resend en premier

**Files:**
- Modify: `apps/backend/services/email_service.py` (méthode `send_auto_reply`)

- [ ] **Step 6.1** — Écrire le test (append à `test_api.py`)

```python
def test_auto_reply_uses_resend_primary(monkeypatch):
    """Si Resend est available et send_email retourne un dict, SMTP ne doit pas être utilisé pour l'auto-reply."""
    from services.email_service import EmailService
    from services.resend_service import ResendService

    svc = EmailService()
    svc.email_user = "user@gmail.com"
    svc.email_password = "pwd"

    fake_resend = ResendService()
    fake_resend.api_key = "test-key"
    fake_resend.send_email = MagicMock(return_value={"id": "re_xyz"})
    svc._resend = fake_resend

    with patch("services.email_service.smtplib.SMTP") as mock_smtp:
        result = svc.send_auto_reply({
            "id": "x", "name": "Jane", "email": "jane@example.com",
            "subject": "Test", "message": "Msg",
        })

    assert result is True
    fake_resend.send_email.assert_called_once()
    mock_smtp.assert_not_called()


def test_auto_reply_falls_back_to_smtp_when_resend_fails():
    """Si Resend échoue, le code SMTP historique est exécuté."""
    from services.email_service import EmailService
    from services.resend_service import ResendService

    svc = EmailService()
    svc.email_user = "user@gmail.com"
    svc.email_password = "pwd"

    fake_resend = ResendService()
    fake_resend.api_key = "test-key"
    fake_resend.send_email = MagicMock(return_value=None)
    svc._resend = fake_resend

    with patch("services.email_service.smtplib.SMTP") as mock_smtp_cls:
        mock_server = MagicMock()
        mock_smtp_cls.return_value.__enter__.return_value = mock_server
        result = svc.send_auto_reply({
            "id": "x", "name": "Jane", "email": "jane@example.com",
            "subject": "Test", "message": "Msg",
        })

    assert result is True
    fake_resend.send_email.assert_called_once()
    mock_server.send_message.assert_called_once()
```

- [ ] **Step 6.2** — Lancer pour vérifier l'échec

Run: `cd apps/backend && pytest test_api.py -v -k "auto_reply_uses_resend or auto_reply_falls_back"`
Expected: `FAILED` — Resend n'est pas encore appelé dans `send_auto_reply`.

- [ ] **Step 6.3** — Modifier `send_auto_reply()` — remplacer le début de la méthode par une tentative Resend avant la branche SMTP existante. Le nouveau corps complet :

```python
    def send_auto_reply(self, submission_data: dict) -> bool:
        """Send automatic reply to the person who submitted the form.

        Chaîne : Resend → SMTP Gmail. Aucun fallback HTTP car formsubmit/mailthis
        ne sont pas conçus pour envoyer vers une adresse arbitraire.
        """
        # 1. Tentative Resend
        resend = self._get_resend()
        if resend.available:
            result = resend.send_email(
                to=submission_data['email'],
                subject=f"✅ Message reçu - {submission_data['subject']}",
                html=self._render_auto_reply_html(submission_data),
                tags=[{"name": "type", "value": "auto-reply"}],
            )
            if result is not None:
                logger.info(f"Auto-reply sent via Resend to {submission_data['email']}")
                return True
            logger.warning("Resend a échoué pour l'auto-reply, fallback SMTP")

        # 2. Branche SMTP existante
        try:
            if not all([self.email_user, self.email_password]):
                logger.warning("Email configuration missing. Cannot send auto-reply.")
                return False

            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = submission_data['email']
            msg['Subject'] = f"✅ Message reçu - {submission_data['subject']}"

            body = self._render_auto_reply_html(submission_data)
            msg.attach(MIMEText(body, 'html'))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_user, self.email_password)
                server.send_message(msg)

            logger.info(f"Auto-reply sent via SMTP to {submission_data['email']}")
            return True

        except Exception as e:
            logger.error(f"Failed to send auto-reply: {str(e)}")
            return False
```

- [ ] **Step 6.4** — Relancer

Run: `cd apps/backend && pytest test_api.py -v -k "auto_reply"`
Expected: `2 passed` (ou plus si d'autres tests existants matchent).

Full suite : `cd apps/backend && pytest test_api.py -v`
Expected: tout vert.

- [ ] **Step 6.5** — Commit

```bash
git add apps/backend/services/email_service.py apps/backend/test_api.py
git commit -m "feat(email): promote Resend to primary channel for auto-reply"
```

---

## Task 7: Frontend — ajouter `@marsidev/react-turnstile` et intégrer le widget

**Files:**
- Modify: `apps/frontend/package.json`
- Modify: `apps/frontend/src/components/ContactForm.tsx`

- [ ] **Step 7.1** — Installer la dépendance

Run:
```bash
cd apps/frontend && pnpm add @marsidev/react-turnstile
```

Expected: `package.json` mis à jour, `pnpm-lock.yaml` mis à jour, `node_modules/@marsidev/react-turnstile` présent.

- [ ] **Step 7.2** — Lire le fichier actuel pour identifier le lieu d'insertion

Run: `grep -n "onSubmit\|handleSubmit\|setState\|useState" apps/frontend/src/components/ContactForm.tsx | head -20`
Puis lire les 80 premières lignes pour repérer l'état du form et la zone du bouton submit.

- [ ] **Step 7.3** — Modifier `apps/frontend/src/components/ContactForm.tsx` — ajouter l'import en tête de fichier (aux côtés des autres imports React) :

```tsx
import { Turnstile } from '@marsidev/react-turnstile';
```

- [ ] **Step 7.4** — Ajouter l'état du token dans le composant (à côté des autres `useState`) :

```tsx
const [cfToken, setCfToken] = useState<string | null>(null);
```

- [ ] **Step 7.5** — Dans le JSX du formulaire, **juste avant** le bouton submit, insérer le widget conditionnel :

```tsx
{process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
  <div className="my-4">
    <Turnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      onSuccess={(token) => setCfToken(token)}
      onError={() => setCfToken(null)}
      onExpire={() => setCfToken(null)}
      options={{ theme: 'dark', size: 'flexible' }}
    />
  </div>
)}
```

- [ ] **Step 7.6** — Modifier le handler de submit pour inclure le token dans le payload envoyé au backend. Dans le corps de la fonction qui fait `fetch('/api/contact', ...)` (ou l'équivalent appel axios), ajouter `cf_turnstile_token: cfToken` au body JSON :

Chercher la ligne qui construit le body :
```tsx
body: JSON.stringify({
  name: formData.name,
  email: formData.email,
  subject: formData.subject,
  message: formData.message,
})
```
Et la remplacer par :
```tsx
body: JSON.stringify({
  name: formData.name,
  email: formData.email,
  subject: formData.subject,
  message: formData.message,
  cf_turnstile_token: cfToken,
})
```

- [ ] **Step 7.7** — Vérifier que le build Next.js passe

Run:
```bash
cd apps/frontend && pnpm build 2>&1 | tail -30
```
Expected: build réussi, aucune erreur TypeScript.

- [ ] **Step 7.8** — Commit

```bash
git add apps/frontend/package.json apps/frontend/pnpm-lock.yaml apps/frontend/src/components/ContactForm.tsx
git commit -m "feat(frontend): add Cloudflare Turnstile widget to ContactForm"
```

---

## Task 8: Mettre à jour `.env.example`

**Files:**
- Modify: `.env.example` (racine projet)

- [ ] **Step 8.1** — Vérifier si `.env.example` existe

Run: `ls -la .env.example 2>&1 || echo "NOT FOUND"`

Si absent, le créer en prenant `.env.local` comme référence (mais en mettant des placeholders à la place des secrets).

- [ ] **Step 8.2** — Ajouter les 3 nouvelles variables à `.env.example` (ajout en fin de fichier si existant, ou création complète) :

```bash
# ============================================================
# Cloudflare Turnstile (anti-bot)
# Dashboard: https://dash.cloudflare.com/?to=/:account/turnstile
# Obtenir les clés en créant un site Turnstile pour aissabelkoussa.fr
# ============================================================
TURNSTILE_SITE_KEY=your-site-key-here
TURNSTILE_SECRET_KEY=your-secret-key-here
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key-here
```

⚠️ Note : `TURNSTILE_SITE_KEY` et `NEXT_PUBLIC_TURNSTILE_SITE_KEY` portent la même valeur (la site key publique), mais sont exposées dans deux environnements différents (backend vs frontend).

- [ ] **Step 8.3** — Commit

```bash
git add .env.example
git commit -m "docs(env): add Turnstile variables to .env.example"
```

---

## Task 9: Test d'intégration local (manuel, vraies données)

**Files:** Aucun. Checklist manuelle.

**Prérequis :** `.env.local` de l'utilisateur doit contenir :
- `RESEND_API_KEY=<clé réelle>`
- `TURNSTILE_SITE_KEY=1x00000000000000000000AA` (test key "always passes" Cloudflare)
- `TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA` (test secret "always passes")
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA`

### Scénario A — Mode dégradé (sans env Turnstile)

- [ ] **Step 9.A.1** — Temporairement commenter `TURNSTILE_SECRET_KEY` dans `.env.local`
- [ ] **Step 9.A.2** — Démarrer backend : `cd apps/backend && python start.py`
- [ ] **Step 9.A.3** — Démarrer frontend : `cd apps/frontend && pnpm dev` (autre terminal)
- [ ] **Step 9.A.4** — Ouvrir `http://localhost:3000/contact` dans le navigateur
- [ ] **Step 9.A.5** — Vérifier que **le widget Turnstile ne s'affiche pas** (car `NEXT_PUBLIC_TURNSTILE_SITE_KEY` absent)
- [ ] **Step 9.A.6** — Soumettre un vrai message avec ton email perso
- [ ] **Step 9.A.7** — Vérifier : notif reçue sur ton email + auto-reply reçu sur l'email perso
- [ ] **Step 9.A.8** — Vérifier dans le dashboard Resend (https://resend.com/emails) que 2 emails ont été envoyés avec les tags `contact-notification` et `auto-reply`
- [ ] **Step 9.A.9** — Vérifier dans les logs backend la ligne `TURNSTILE_SECRET_KEY non défini — Turnstile est en mode bypass`

### Scénario B — Mode complet (test keys Cloudflare)

- [ ] **Step 9.B.1** — Rétablir les 3 variables Turnstile dans `.env.local` avec les clés de test "always passes"
- [ ] **Step 9.B.2** — Redémarrer backend et frontend
- [ ] **Step 9.B.3** — Recharger `http://localhost:3000/contact`
- [ ] **Step 9.B.4** — Vérifier que **le widget Turnstile s'affiche** (skin dark, taille flexible) et se valide automatiquement (test key always-pass)
- [ ] **Step 9.B.5** — Soumettre un message réel
- [ ] **Step 9.B.6** — Vérifier succès + emails reçus + dashboard Resend

### Scénario C — Test du blocage (clé always-blocks)

- [ ] **Step 9.C.1** — Temporairement remplacer `TURNSTILE_SECRET_KEY` par `2x0000000000000000000000000000000AA` (clé secret always-blocks)
- [ ] **Step 9.C.2** — Redémarrer backend uniquement
- [ ] **Step 9.C.3** — Soumettre un message
- [ ] **Step 9.C.4** — Vérifier : 403 `Vérification anti-robot échouée. Veuillez réessayer.`, aucun email, logs backend contenant `Turnstile rejected submission`
- [ ] **Step 9.C.5** — Remettre la clé always-passes

---

## Task 10: Déploiement des variables d'environnement (prod)

**Files:** Aucun. Actions dashboards.

### Cloudflare — Créer le site Turnstile (si pas déjà fait)

- [ ] **Step 10.1** — Se connecter à https://dash.cloudflare.com → Turnstile → Add site
- [ ] **Step 10.2** — Nom : `aissabelkoussa.fr portfolio` · Hostname : `aissabelkoussa.fr` + `www.aissabelkoussa.fr` · Mode : **Managed**
- [ ] **Step 10.3** — Copier la **Site key** et la **Secret key**

### Render — Backend

- [ ] **Step 10.4** — Dashboard Render → portfolio-backend → Environment → Add Environment Variable
- [ ] **Step 10.5** — Ajouter `TURNSTILE_SECRET_KEY` = valeur Cloudflare secret key
- [ ] **Step 10.6** — Save Changes → le service redéploie automatiquement

### Vercel — Frontend

- [ ] **Step 10.7** — Dashboard Vercel → portfolio → Settings → Environment Variables
- [ ] **Step 10.8** — Ajouter `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = valeur Cloudflare site key, scope : Production + Preview + Development
- [ ] **Step 10.9** — Save → redéployer : `git commit --allow-empty -m "chore: trigger redeploy for Turnstile env" && git push`

---

## Task 11: Smoke test production

**Files:** Aucun. Validation post-déploiement.

- [ ] **Step 11.1** — Attendre ~3 min la fin des déploiements Render + Vercel
- [ ] **Step 11.2** — Ouvrir `https://aissabelkoussa.fr/contact` en navigation privée
- [ ] **Step 11.3** — Vérifier que le widget Turnstile s'affiche et se valide silencieusement (mode Managed, visiteur légitime)
- [ ] **Step 11.4** — Soumettre un message de test depuis ton adresse perso (sujet : `Test Resend + Turnstile prod 2026-04-11`)
- [ ] **Step 11.5** — Vérifier :
  - ✅ Notif reçue sur ton email principal, tag `contact-notification` visible dans dashboard Resend
  - ✅ Auto-reply reçu sur l'adresse expéditrice, tag `auto-reply` visible
  - ✅ Les 2 emails arrivent en **Boîte de réception**, pas en spam (tester avec une adresse Gmail externe si possible)
  - ✅ Logs Render contiennent `Auto-reply sent via Resend` et pas de `fallback SMTP`
- [ ] **Step 11.6** — Vérifier le dashboard Cloudflare Turnstile (Analytics) : 1 challenge solved, 0 blocked
- [ ] **Step 11.7** — Si tout OK, commit final :

```bash
git commit --allow-empty -m "chore(deploy): Resend + Turnstile live in production 2026-04-11"
git push
```

---

## Critères d'acceptation (du spec)

À cocher à la fin :

- [ ] `TurnstileService` créé, testé unitairement, 5 tests au vert
- [ ] `EmailService.send_contact_notification` tente Resend en premier, 2 tests au vert
- [ ] `EmailService.send_auto_reply` tente Resend en premier, 2 tests au vert
- [ ] Frontend `ContactForm` affiche le widget Turnstile (theme dark, size flexible)
- [ ] Endpoint `/api/contact` rejette un token invalide avec 403
- [ ] Endpoint `/api/contact` bypass Turnstile si `TURNSTILE_SECRET_KEY` absent (mode dev vérifié)
- [ ] En prod, 1 soumission réelle génère 1 notif + 1 auto-reply, toutes deux visibles dans le dashboard Resend avec les bons tags
- [ ] Le code `formsubmit.co` / `mailthis.to` / `spam_protection.py` est non modifié (vérifier `git log --oneline` → pas de commit touchant ces fichiers)
- [ ] `.env.example` mis à jour avec les 3 nouvelles variables
- [ ] Tous les commits pushés sur `main`

---

## Résumé des commits attendus

1. `feat(backend): add TurnstileService with 5 unit tests`
2. `feat(backend): add cf_turnstile_token field to ContactFormData`
3. `feat(backend): wire TurnstileService into /api/contact endpoint`
4. `refactor(email): extract _render_auto_reply_html for reuse across channels`
5. `feat(email): promote Resend to primary channel for contact notification`
6. `feat(email): promote Resend to primary channel for auto-reply`
7. `feat(frontend): add Cloudflare Turnstile widget to ContactForm`
8. `docs(env): add Turnstile variables to .env.example`
9. `chore(deploy): Resend + Turnstile live in production 2026-04-11`

**Total : 9 commits, aucune suppression de code.**
