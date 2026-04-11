# Spec — Resend en tête de chaîne + Cloudflare Turnstile en amont du spam check

**Date** : 2026-04-11
**Auteur** : Aïssa Belkoussa (via brainstorming Claude Code)
**Projet** : Portfolio `aissabelkoussa.fr`
**Périmètre** : `apps/backend/services/` + `apps/backend/server.py` + `apps/frontend/src/components/ContactForm.tsx`
**Type** : Amélioration additive (aucune suppression de code existant)

---

## 1. Contexte et motivation

Le formulaire de contact du portfolio repose actuellement sur deux briques qui fonctionnent mais présentent des fragilités :

1. **Email transactionnel** — `send_contact_notification()` utilise Gmail SMTP comme canal principal avec une chaîne de fallback HTTP (`formsubmit.co` → `mailthis.to`). `send_auto_reply()` utilise uniquement Gmail SMTP, sans fallback. Gmail SMTP a durci ses règles de délivrabilité en 2025 (DMARC obligatoire, limites de volume) et présente un risque non négligeable d'arriver en spam chez le visiteur recevant l'auto-reply.
2. **Anti-spam** — `spam_protection.py` filtre les soumissions via rate limiting in-memory + scoring sémantique (keywords, patterns regex, domaines jetables). Aucun filtrage bot en amont. Les bots automatisés consomment du quota Mongo + du temps CPU avant même que le scoring ne les écarte.

Le projet dispose déjà de `resend_service.py` (65 l.) créé pour les séquences email de prospection. Ce service est fonctionnel mais n'est pas câblé sur le flux du formulaire de contact.

L'objectif de cette spec est d'améliorer la résilience et la qualité de délivrance sans refactoriser l'existant et sans supprimer de code.

## 2. Décisions validées (brainstorming)

| Décision | Choix |
|---|---|
| Chaîne notif contact (vers Aïssa) | `Resend → SMTP Gmail → formsubmit.co → mailthis.to` |
| Chaîne auto-reply (vers visiteur) | `Resend → SMTP Gmail` |
| Domaine Resend | `aissabelkoussa.fr` déjà vérifié, `RESEND_API_KEY` opérationnel |
| Mode Cloudflare Turnstile | Managed (Cloudflare choisit auto entre invisible / non-interactif / interactif) |
| Dégradation gracieuse Turnstile | Si `TURNSTILE_SECRET_KEY` absent → bypass vers `spam_protection.py` existant |
| Anti-spam custom | Conservé intégralement, placé en aval de Turnstile |
| Approche d'implémentation | In-place minimal (aucun refactor, add-on pur) |

## 3. Architecture cible

### Flux d'une soumission de contact (après amélioration)

```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND Next.js — /contact                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ <ContactForm>                                           │ │
│ │   • champs nom/email/sujet/message (existant)           │ │
│ │   • <Turnstile siteKey={NEXT_PUBLIC_TURNSTILE_SITE_KEY}/>│ │  NOUVEAU
│ │   • au submit : token Turnstile injecté dans le payload │ │
│ └─────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ POST /api/contact
                           │ { name, email, subject, message, cf_turnstile_token }
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND FastAPI — server.py · POST /api/contact             │
│                                                             │
│  1. TurnstileService.verify(token, ip)  ◄── NOUVEAU         │
│     ├─ env absente → bypass (graceful degradation)          │
│     ├─ token invalide → 403 "Captcha verification failed"   │
│     ├─ API Cloudflare timeout → fail-open (log + continue)  │
│     └─ OK → continue                                        │
│                                                             │
│  2. SpamProtection.check_rate_limit(ip)  [inchangé]         │
│  3. SpamProtection.is_spam(submission)   [inchangé]         │
│  4. StorageService.save(submission)      [inchangé]         │
│                                                             │
│  5. EmailService.send_contact_notification()                │
│     └─ chaîne : Resend → SMTP → formsubmit → mailthis  ◄── MODIFIÉ
│                                                             │
│  6. EmailService.send_auto_reply()                          │
│     └─ chaîne : Resend → SMTP                          ◄── MODIFIÉ
│                                                             │
│  7. NotificationService (Telegram/WhatsApp) [inchangé]      │
│                                                             │
│  → 200 { success: true, id }                                │
└─────────────────────────────────────────────────────────────┘
```

### Principes architecturaux

- **Add-on, pas refactor** : les nouveautés s'insèrent par-dessus l'existant comme des couches. Aucun fichier renommé, aucun symbole supprimé.
- **Single Responsibility préservé** : `TurnstileService` ignore tout de l'email. `ResendService` ignore tout de SMTP. `SpamProtection` ignore tout de Turnstile.
- **Deux niveaux de dégradation gracieuse** :
  - Si `TURNSTILE_SECRET_KEY` absente (dev local) → `spam_protection.py` reprend seul le rôle de filtrage
  - Si Resend tombe (prod) → SMTP prend le relais, puis formsubmit, puis mailthis
- **Aucun lead perdu silencieusement** : même si tous les canaux email échouent, la submission est déjà persistée en Mongo avant la tentative d'envoi, donc récupérable via le back-office admin.

## 4. Composants — delta détaillé

### 4.1 `apps/backend/services/turnstile_service.py` (NOUVEAU)

Fichier à créer, ~60 lignes. Responsabilité unique : appeler l'endpoint Cloudflare `siteverify` et retourner un booléen exploitable par le router.

Interface publique :

```python
class TurnstileService:
    def __init__(self) -> None: ...
    @property
    def available(self) -> bool: ...        # True ssi TURNSTILE_SECRET_KEY présent
    def verify(self, token: str | None, remote_ip: str | None) -> tuple[bool, str | None]:
        """
        Retourne (success, error_code).
        - (True, None) si token valide OU si service non configuré (bypass mode)
        - (False, "missing-token") si token absent et service configuré
        - (False, "<code>") si Cloudflare rejette
        - (True, "fail-open") si API Cloudflare timeout (log + on laisse passer)
        """
```

Configuration lue depuis `os.getenv("TURNSTILE_SECRET_KEY", "")`. Appel POST vers `https://challenges.cloudflare.com/turnstile/v0/siteverify` avec `timeout=10`. Parse JSON, retourne `(data["success"], data.get("error-codes", [None])[0])`.

### 4.2 `apps/backend/services/resend_service.py` (ÉTENDU)

Le fichier existant expose déjà `send_email(to, subject, html, reply_to, tags)`. Il est suffisamment générique pour les nouveaux cas d'usage **sans modification** — les méthodes de `EmailService` peuvent l'appeler directement.

Extension optionnelle : si les méthodes existantes de `EmailService` doivent passer des tags différents pour la notif vs l'auto-reply (pour segmenter dans le dashboard Resend), aucune modification de `ResendService` n'est requise — les tags sont déjà un paramètre.

**Delta réel : 0 ligne.** Le service est prêt tel quel.

### 4.3 `apps/backend/services/email_service.py` (MODIFIÉ)

**`__init__`** — ajout d'une instance `ResendService` lazy :

```python
def __init__(self):
    # ... existant ...
    self._resend: ResendService | None = None

def _get_resend(self) -> ResendService:
    if self._resend is None:
        from services.resend_service import ResendService
        self._resend = ResendService()
    return self._resend
```

**`send_contact_notification()`** — ajout d'une tentative Resend **avant** la chaîne existante :

```python
def send_contact_notification(self, submission_data: dict) -> bool:
    # 1. Tentative Resend (nouveau canal principal)
    resend = self._get_resend()
    if resend.available:
        result = resend.send_email(
            to=self.recipient_email,
            subject=f"🔔 Nouveau contact portfolio - {submission_data['subject']}",
            html=self._render_html_body(submission_data),
            reply_to=submission_data['email'],
            tags=[{"name": "type", "value": "contact-notification"}],
        )
        if result is not None:
            return True
        logger.warning("Resend a échoué pour la notif contact, fallback SMTP")

    # 2. Chaîne existante INTACTE (SMTP → formsubmit → mailthis)
    if self.email_user and self.email_password and self.recipient_email:
        return self._send_via_smtp(submission_data)
    if self.recipient_email:
        if self.fallback_provider == 'mailthis':
            return self._send_via_mailthis(submission_data)
        return self._send_via_formsubmit(submission_data)
    logger.warning("No recipient configured; skipping email notification")
    return False
```

**`send_auto_reply()`** — ajout d'une tentative Resend **avant** la branche SMTP existante :

```python
def send_auto_reply(self, submission_data: dict) -> bool:
    # 1. Tentative Resend
    resend = self._get_resend()
    if resend.available:
        result = resend.send_email(
            to=submission_data['email'],
            subject=f"✅ Message reçu - {submission_data['subject']}",
            html=self._render_auto_reply_html(submission_data),  # extraction du HTML existant
            tags=[{"name": "type", "value": "auto-reply"}],
        )
        if result is not None:
            return True
        logger.warning("Resend a échoué pour l'auto-reply, fallback SMTP")

    # 2. Branche SMTP existante INTACTE
    # ... (le code actuel de send_auto_reply à partir du try:) ...
```

**Refactor interne minimal** : le bloc HTML de l'auto-reply actuellement inline dans `send_auto_reply()` est extrait en une méthode privée `_render_auto_reply_html(submission_data)` pour éviter la duplication. C'est le seul mouvement de code — aucune logique modifiée, aucune suppression.

### 4.4 `apps/backend/server.py` (MODIFIÉ)

Sur l'endpoint `POST /api/contact`, ajout d'une étape **avant** les appels à `SpamProtection` :

```python
# Étape 1 : Turnstile (nouveau) — placé avant le rate limit
turnstile = TurnstileService()
token = submission.cf_turnstile_token  # nouveau champ du modèle Pydantic
client_ip = request.client.host if request.client else None
success, error = turnstile.verify(token, client_ip)
if not success:
    logger.warning(f"Turnstile rejected submission: {error}")
    raise HTTPException(status_code=403, detail="Captcha verification failed")

# Étapes 2+ : inchangées (rate limit, spam score, storage, email, notification)
```

Ajout du champ `cf_turnstile_token: str | None = None` au modèle Pydantic `ContactSubmission` (dans `models.py`).

### 4.5 `apps/frontend/src/components/ContactForm.tsx` + `components/sections/Contact.tsx` (MODIFIÉS)

Les deux fichiers existent dans le repo. `ContactForm.tsx` est le composant de formulaire réutilisable, `Contact.tsx` est la section qui l'intègre (ou une variante dédiée à la homepage). Le widget Turnstile est ajouté dans le composant de formulaire (`ContactForm.tsx`) qui est la source de vérité du submit. La section `Contact.tsx` sera inspectée pendant l'implémentation pour vérifier qu'elle réutilise bien `ContactForm.tsx` — si elle dupliquait le formulaire, elle serait aussi modifiée en parallèle (diff identique).

Ajout de la lib `@marsidev/react-turnstile` (MIT, ~50k dl/semaine, maintenue, zéro dep tierce sauf React) :

```tsx
import { Turnstile } from '@marsidev/react-turnstile';

// dans le formulaire, juste avant le bouton submit :
<Turnstile
  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
  onSuccess={(token) => setCfToken(token)}
  onError={() => setCfToken(null)}
  onExpire={() => setCfToken(null)}
  options={{ theme: 'dark', size: 'flexible' }}
/>
```

Au submit, inclusion du token dans le payload POST. Si `NEXT_PUBLIC_TURNSTILE_SITE_KEY` est absent, le widget ne s'affiche pas et aucun token n'est envoyé (mode dégradé frontend, cohérent avec le bypass backend).

### 4.6 Variables d'environnement

| Variable | Environnement | Rôle |
|---|---|---|
| `RESEND_API_KEY` | Backend (Render + `.env.local`) | **Déjà présent**, pas d'action |
| `TURNSTILE_SECRET_KEY` | Backend (Render + `.env.local`) | NOUVELLE — clé serveur Turnstile |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Frontend (Vercel + `.env.local`) | NOUVELLE — clé publique (safe à exposer par design Turnstile) |

⚠️ **Respect strict de la règle de sécurité globale** : seule `NEXT_PUBLIC_TURNSTILE_SITE_KEY` est préfixée `NEXT_PUBLIC_` car elle est *conçue* pour être publique par Cloudflare (c'est l'équivalent d'un `client_id`). `TURNSTILE_SECRET_KEY` reste strictement backend.

### 4.7 Dépendances

- **Backend Python** : rien à ajouter, `requests` est déjà dans `requirements.txt`.
- **Frontend npm** : `@marsidev/react-turnstile@^1` à ajouter dans `apps/frontend/package.json`.

## 5. Data flow (contrat API)

### Request — `POST /api/contact`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Collaboration",
  "message": "Bonjour Aïssa...",
  "cf_turnstile_token": "0.xxxxx..."
}
```

`cf_turnstile_token` est optionnel côté modèle Pydantic pour supporter le mode dégradé (dev local sans env Turnstile). La validation de sa présence est faite par `TurnstileService.verify()` en fonction de la disponibilité du service.

### Response — succès inchangé

```json
{ "success": true, "id": "submission_xxx", "message": "..." }
```

### Response — échec captcha (nouveau code d'erreur)

```
HTTP 403
{ "detail": "Captcha verification failed" }
```

### Response — rate limit / spam / autres erreurs existantes : inchangées

## 6. Error handling

| Scénario | Comportement | Visible utilisateur ? |
|---|---|---|
| `TURNSTILE_SECRET_KEY` absente en env | Bypass Turnstile, `spam_protection.py` prend seul le rôle | Non (dev) |
| Token Turnstile absent, env présente | 403 "Captcha verification failed" | Oui — re-soumission possible |
| Token Turnstile invalide/expiré | 403 "Captcha verification failed" | Oui — re-soumission possible |
| API Cloudflare down (timeout 10 s) | **Fail-open** : log error, flux continue | Non |
| `RESEND_API_KEY` absente ou invalide | Log warning, fallback immédiat SMTP | Non |
| Resend API 4xx/5xx | Log error avec status, fallback SMTP | Non |
| Resend timeout > 15 s | Exception caught, fallback SMTP | Non |
| SMTP Gmail échec | Fallback formsubmit (notif) ou échec auto-reply (auto-reply) | Non |
| Tous les canaux email échouent | Submission déjà sauvée en Mongo → récupérable via back-office admin | Non |

**Principe directeur** : aucun lead perdu silencieusement. Soit l'email part, soit il est au minimum persisté en Mongo. Les seules erreurs 4xx retournées au client sont actionnables par le visiteur (captcha à refaire).

## 7. Testing strategy

### 7.1 Tests unitaires (pytest, `apps/backend/test_api.py` à étendre)

- `test_turnstile_verify_valid_token` — mock réponse Cloudflare 200 `success: true`
- `test_turnstile_verify_invalid_token` — mock réponse `success: false`
- `test_turnstile_bypass_when_secret_missing` — unset env, vérifier `(True, None)`
- `test_turnstile_fail_open_on_timeout` — mock `requests.Timeout`, vérifier fail-open
- `test_email_chain_resend_primary` — mock Resend success, vérifier SMTP non appelé
- `test_email_chain_resend_fail_falls_to_smtp` — mock Resend retour `None`, vérifier SMTP appelé
- `test_email_chain_all_fail_returns_false` — tous mocks fail, vérifier retour False

### 7.2 Tests d'intégration (manuel, conformes à la règle "vraies données uniquement")

Aucun mock sur les tests d'intégration. Les clés de test Cloudflare Turnstile documentées sont utilisées :

- `1x00000000000000000000AA` → always passes (site key)
- `1x0000000000000000000000000000000AA` → always passes (secret key)
- `2x00000000000000000000AB` → always blocks
- `3x00000000000000000000FF` → always forces interactive challenge

**Scénarios de validation** :

1. **Local, env Turnstile absente** : submit le form → vérifier bypass, email reçu via Resend réel (compte prod, tag "contact-notification" visible dans dashboard Resend), auto-reply reçu via Resend réel
2. **Local, env Turnstile en mode "always-pass"** : submit → widget affiché, token généré, validation OK, email reçu
3. **Local, env Turnstile en mode "always-block"** : submit → 403 `Captcha verification failed`, aucun email envoyé, aucune ligne Mongo
4. **Prod (après déploiement Render + Vercel)** : 1 soumission réelle avec l'adresse perso, monitoring logs Render pendant 30 min, vérification du tag Resend dans le dashboard

### 7.3 Monitoring post-déploiement

- **Resend dashboard** : vérifier que les 2 tags `contact-notification` et `auto-reply` apparaissent avec les premiers envois
- **Cloudflare Turnstile dashboard** : vérifier le taux de challenge (doit être <5% en Managed mode sur du trafic humain)
- **Render logs** : grep `Turnstile rejected` pour compter les bots bloqués vs les faux positifs (un faux positif = plainte visiteur)

## 8. Hors scope (explicitement)

Pour éviter le scope creep, les éléments suivants sont **hors de cette spec** et feront l'objet de specs ultérieures si nécessaire :

- Refactor de `EmailService` vers un `EmailDispatcher` avec Strategy pattern
- Extraction du workflow `/api/contact` en un `ContactPipeline`
- Suppression des fallbacks `formsubmit.co` / `mailthis.to` (ils restent, inactifs sauf en cas de panne cascade)
- Migration du rate limiting in-memory vers Redis (le in-memory suffit pour un single-instance Render)
- Ajout de Turnstile sur d'autres endpoints (admin login, etc.)
- Monitoring alerting (Sentry, Datadog, etc.)

## 9. Critères d'acceptation

Cette amélioration est considérée comme **shippée avec succès** quand **tous** les critères suivants sont vrais :

- [ ] `TurnstileService` créé, testé unitairement, 4 tests au vert
- [ ] `EmailService.send_contact_notification` tente Resend en premier, tests unitaires au vert
- [ ] `EmailService.send_auto_reply` tente Resend en premier, tests unitaires au vert
- [ ] Frontend `ContactForm` affiche le widget Turnstile (theme dark, size flexible)
- [ ] Endpoint `/api/contact` rejette un token invalide avec 403
- [ ] Endpoint `/api/contact` bypass Turnstile si `TURNSTILE_SECRET_KEY` absent (mode dev)
- [ ] En prod, une soumission réelle génère 1 notif + 1 auto-reply, **toutes deux** visibles dans le dashboard Resend avec les bons tags
- [ ] Le code existant de `formsubmit.co` / `mailthis.to` / `spam_protection.py` est **non modifié** (diff git = 0 ligne sur ces fichiers)
- [ ] Documentation `.env.example` mise à jour avec les 2 nouvelles variables
- [ ] Commit propre sur la branche principale, pushé sur GitHub

## 10. Dette technique assumée

- `EmailService` contient désormais deux branches par méthode (Resend + chaîne legacy). C'est plus long à lire mais explicitement assumé : l'instruction utilisateur est *« garde les anciens en fallback »*. Un refactor futur vers `EmailDispatcher` (Approche 2 du brainstorming) reste possible en tout temps.
- Le `TurnstileService` n'a pas de mécanisme de retry. En pratique, Cloudflare est extrêmement fiable et un fail-open sur timeout couvre le cas edge. Si des faux positifs apparaissent en volume, un retry avec backoff sera ajouté.
