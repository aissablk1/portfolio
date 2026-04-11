# Email System — Items différés

> Liste des améliorations identifiées mais non implémentées dans le plan du 2026-04-11.
> Chaque item a un coût estimé et une raison de report.

## Bloqués par compte externe

### Upstash Redis — Rate limit distribué
**Problème actuel :** Rate limit in-memory (`Map<string, ...>`) se reset au redeploy, et ne marche pas avec >1 pod Vercel.
**Solution :** Créer compte Upstash (free tier 10k req/jour), installer `@upstash/ratelimit`, remplacer les `Map` dans les 3 routes API.
**Estimation :** 45 min.
**Blocker :** création compte Upstash + ajout env vars `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`.

### Sentry — Observabilité erreurs
**Problème actuel :** Échecs de `sendEmail()` et webhook logs sont dans `console.error`, sans alerting.
**Solution :** Créer compte Sentry, installer `@sentry/nextjs`, wrapper `sendEmail` + `/api/webhooks/resend`.
**Estimation :** 30 min.
**Blocker :** création compte Sentry + env var `SENTRY_DSN`.

## Scope trop large pour la session

### Framework de tests (Vitest)
**Problème actuel :** Aucun test automatisé. TDD impossible.
**Solution :** Installer Vitest, ajouter config, couvrir `lib/email.ts`, `lib/email-validator.ts`, `lib/honeypot.ts`, snapshot tests templates.
**Estimation :** 2h initial + ~1h par batch de tests.
**Raison report :** Bloquait l'exécution TDD du plan initial, scope > budget session.

### Admin dashboard email metrics
**Problème actuel :** La page `apps/admin/src/app/dashboard/emails/page.tsx` existe mais n'a pas de source de données réelle pour bounces/complaints.
**Solution :** Créer table `suppression_list` (email, type, reason, created_at) dans Mongo, webhook `/api/webhooks/resend` l'alimente, page admin lit depuis.
**Estimation :** 2h.

### Cleanup dual-send frontend → backend
**Problème actuel :** Les routes `/api/contact` et `/api/leads/capture` envoient à Resend ET fire-and-forget au backend FastAPI. Deux sources de vérité (Resend logs + MongoDB backend).
**Solution à trancher :**
- **Option A :** Frontend devient un proxy stateless, tout transite par le backend (source unique = Mongo).
- **Option B :** Garder dual avec idempotency keys pour déduplication.
**Estimation :** 3h design + implémentation.
**Décision pending.**

## Dette découverte pendant le plan

### `.env.example` absent
**Problème :** Aucun fichier `.env.example` versionné dans le repo. Les nouveaux contributeurs doivent deviner les vars.
**Solution :** Créer `apps/frontend/.env.example` et `apps/backend/.env.example` listant toutes les vars avec commentaires.
**Estimation :** 20 min.

### URL incohérente dans `contact-confirm.ts`
**Problème :** Lien vers `https://aissabelkoussa.fr/diagnostic` (sans `www.`), incohérent avec les autres URLs du repo.
**Solution :** Normaliser en `https://www.aissabelkoussa.fr/diagnostic`.
**Estimation :** 2 min.

### Duplication `scorelead` vs `lib/lead-scoring.ts`
**Problème :** `api/contact/route.ts` a une fonction `scorelead()` locale (80 lignes). `lib/lead-scoring.ts` existe et est utilisé par `/api/leads/capture`. Deux systèmes de scoring en parallèle.
**Solution :** Factoriser dans `lib/lead-scoring.ts` et faire converger les deux.
**Estimation :** 1h (implique de valider que les deux scoring produisent les mêmes résultats sur des cas connus).

### Rotation `NEWSLETTER_UNSUBSCRIBE_SECRET` sans downtime
**Problème :** `verifyUnsubscribeToken` n'accepte qu'une seule clé. Rotation = casse des liens en vol.
**Solution :** Refactor pour supporter dual-key (`_SECRET` + `_SECRET_NEXT`).
**Estimation :** 30 min. Documenté dans `secret-rotation.md`.

### Backend rate limiting absent
**Problème :** Routes Python `/api/contact` et `/api/leads` n'ont aucun rate limit. Contournable en bypassant le frontend.
**Solution :** Ajouter `slowapi` + décorer les routes.
**Estimation :** 20 min.

### Backend `send_email` backward-compat
**Problème :** La méthode `ResendService.send_email` a maintenant 9 params optionnels. `sequence_service.py` et `server.py` l'appellent avec l'ancienne signature. Pas cassé mais fragile.
**Solution :** Mettre à jour les callers pour utiliser les nouveaux params (`text`, `unsubscribe_url`, `tag`).
**Estimation :** 45 min.

### `lead-emails.ts` non couvert par preview
**Problème :** Les templates `welcomeEmail`, `sectorEmail`, `hotOutreachEmail` de `lib/lead-emails.ts` n'apparaissent pas dans `/api/dev/email-preview`.
**Solution :** Les ajouter au tableau `previews`.
**Estimation :** 15 min.

### Monthly sync `disposable-email-domains`
**Problème :** Le package est statique, mis à jour manuellement. La liste des domaines jetables évolue.
**Solution :** Dependabot ou cron mensuel `pnpm update disposable-email-domains`.
**Estimation :** 5 min (juste activer Dependabot).

## Priorisation suggérée

**P0 (ce mois) :**
1. `.env.example` — onboarding clean
2. URL `www.` inconsistency — fix 2 min
3. Backend rate limiting — sécurité basique
4. Upstash Redis — dès que compte créé

**P1 (trimestre) :**
5. Sentry — dès que compte créé
6. Vitest — enable future TDD
7. `lead-emails.ts` preview
8. Duplication scorelead

**P2 (backlog) :**
9. Dual-send cleanup
10. Admin dashboard metrics
11. Rotation dual-key
