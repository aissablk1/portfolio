# Email System Architecture

> Dernière mise à jour : 2026-04-11 (post-solidification).

## Vue d'ensemble

Tous les envois d'email du site passent par un système centralisé autour de `lib/email.ts` (Next.js) et `services/resend_service.py` (FastAPI backend). Resend est le SMTP provider unique. Les templates sont des fonctions pures `(data) => { subject, html }`.

## Flow typique

```
Request → Route handler → isBot() → validateEmail() → Template() → sendEmail() → Resend API
                                                                                    ↓
                                                                          Webhook → /api/webhooks/resend
```

## Fichiers

| Fichier | Rôle |
|---|---|
| `lib/email.ts` | Wrapper Resend, retry, headers, text auto |
| `lib/email-headers.ts` | Builder RFC 8058 List-Unsubscribe |
| `lib/email-validator.ts` | Regex + disposable domains |
| `lib/honeypot.ts` | `isBot()` anti-bot |
| `lib/newsletter-token.ts` | URL désinscription HMAC |
| `lib/lead-emails.ts` | Templates lead magnet (guide PDF) |
| `lib/email-templates/*` | Templates newsletter + contact |

## Routes

| Route | Méthode | But | Rate limit | Honeypot |
|---|---|---|---|---|
| `/api/newsletter` | POST | Inscription newsletter | 5/15min | Oui |
| `/api/contact` | POST | Demande projet | 3/15min | Oui |
| `/api/leads/capture` | POST | Lead magnet guide IA | 5/15min | Oui |
| `/api/webhooks/resend` | POST | Bounces/complaints | — | Svix signature |
| `/api/dev/email-preview` | GET | Preview dev-only | — | — |

## Comment ajouter un nouveau template

1. Créer `lib/email-templates/mon-template.ts` :
   ```typescript
   import type { TemplateResult } from "./shared";
   import { esc } from "./shared";

   export function monTemplate(data: { name: string }): TemplateResult {
     return {
       subject: `Bonjour ${data.name}`,
       html: `<!DOCTYPE html>...`,
     };
   }
   ```
2. Ajouter l'export dans `lib/email-templates/index.ts`
3. L'appeler depuis une route avec `sendEmail()`
4. L'ajouter au tableau `previews` dans `api/dev/email-preview/route.ts` pour le QA visuel

## Délivrabilité

Le système publie :
- **SPF** : `v=spf1 a mx ptr include:icloud.com include:amazonses.com ~all`
- **DKIM Resend** : `resend._domainkey.aissabelkoussa.fr` (CNAME Resend)
- **DKIM iCloud** : `sig1._domainkey.aissabelkoussa.fr`
- **DMARC** : `v=DMARC1; p=none;` (monitoring, passera à `p=quarantine` après 48h d'observation)
- **List-Unsubscribe + One-Click** : RFC 8058 sur tous les emails avec `unsubscribeUrl`

## Env vars

| Var | Requis | But |
|---|---|---|
| `RESEND_API_KEY` | Oui | API Resend |
| `EMAIL_FROM` | Non | From header (défaut hardcoded) |
| `NEWSLETTER_UNSUBSCRIBE_SECRET` | Oui (one-click) | HMAC unsub URL |
| `RESEND_WEBHOOK_SECRET` | Oui (webhook) | Svix signature |
| `BACKEND_URL` / `BACKEND_API_URL` | Non | Dual-send backend |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Non | Notif lead chaud |
| `ALLOW_EMAIL_PREVIEW` | Non | Active preview en prod |

## Previews

En local : `pnpm dev` puis visiter `http://localhost:3000/api/dev/email-preview`.
