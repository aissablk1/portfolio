# Email System Solidification — Implementation Plan

> **For agentic workers:** Execute task by task via superpowers:executing-plans. Each task is self-contained and can be dispatched to a fresh subagent. Verify between tasks with `tsc --noEmit` and `next build` (not unit tests — this project has no test framework yet).

**Goal:** Centraliser, sécuriser et rendre observables tous les envois d'email du site (newsletter, contact, lead capture, backend) en un seul système cohérent.

**Architecture:** Un module `lib/email.ts` unique qui encapsule Resend. Templates purs dans `lib/email-templates/`. Routes API deviennent minces (validation + appel helper). Webhook Resend pour bounces/complaints. Preview route dev-only pour QA visuelle.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, Resend API, `html-to-text` (nouveau), `disposable-email-domains` (nouveau).

**Out of scope (blocked on external accounts):** Upstash Redis (rate limit distribué), Sentry (observabilité), intégration admin dashboard des métriques email. Documentés en task 10 pour plus tard.

---

## File Structure

```
apps/frontend/src/lib/
├── email.ts                         # NEW — sendEmail core (Resend wrapper, retry, headers)
├── email-headers.ts                 # NEW — builder List-Unsubscribe + defaults
├── email-validator.ts               # NEW — disposable domain check + regex strict
├── honeypot.ts                      # NEW — helper isBot(payload)
├── newsletter-token.ts              # EXISTS — already builds signed unsubscribe URL
├── lead-emails.ts                   # EXISTS (177 lines) — welcomeEmail/sectorEmail/hotOutreachEmail
│                                    # DO NOT TOUCH. Templates already extracted + tracked PDF links.
└── email-templates/
    ├── index.ts                     # NEW — barrel export + TemplateResult type
    ├── newsletter-admin.ts          # NEW — extract from newsletter/route.ts
    ├── newsletter-welcome.ts        # NEW — extract from newsletter/route.ts
    ├── contact-admin.ts             # NEW — extract from contact/route.ts
    └── contact-confirm.ts           # NEW — extract from contact/route.ts

apps/frontend/src/app/api/
├── newsletter/route.ts              # REFACTOR — use lib/email + templates, add honeypot
├── contact/route.ts                 # REFACTOR — use lib/email + templates
├── leads/capture/route.ts           # REFACTOR — use lib/email + templates, add honeypot + reply_to
├── webhooks/resend/route.ts         # NEW — handles bounce/complaint/delivered
└── dev/email-preview/route.ts       # NEW — GET ?template=X&lang=fr, dev-only

apps/frontend/src/components/
└── Footer.tsx                       # MODIFY — add honeypot field to newsletter form

apps/backend/services/
└── resend_service.py                # REFACTOR — add text, List-Unsubscribe, reply_to support

docs/
├── email-system.md                  # NEW — architecture + how to add a template
└── secret-rotation.md               # NEW — rotation process for NEWSLETTER_UNSUBSCRIBE_SECRET + RESEND_API_KEY
```

**Dependency to install:** `html-to-text` (~20kb, MIT, 8M weekly dl), `disposable-email-domains` (~90kb list, MIT).

---

## Task 1 — Install deps + create `lib/email-headers.ts` + `lib/email-validator.ts` + `lib/honeypot.ts`

**Files:**
- Modify: `apps/frontend/package.json`
- Create: `apps/frontend/src/lib/email-headers.ts`
- Create: `apps/frontend/src/lib/email-validator.ts`
- Create: `apps/frontend/src/lib/honeypot.ts`

**Steps:**

- [ ] Install: `cd apps/frontend && pnpm add html-to-text disposable-email-domains` (and `-D @types/html-to-text`).

- [ ] Create `lib/email-headers.ts` — exports `buildDefaultHeaders(opts: { unsubscribeUrl?: string; contactEmail: string; entityRefId?: string })`:
  - If `unsubscribeUrl` present, set `List-Unsubscribe: <url>, <mailto:${contactEmail}?subject=Unsubscribe>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` (RFC 8058).
  - Always set `X-Entity-Ref-ID` to `entityRefId ?? crypto.randomUUID()` (traceability).
  - Return `Record<string, string>`.

- [ ] Create `lib/email-validator.ts`:
  - Import `disposable-email-domains` (default export is `string[]`).
  - Export `EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`.
  - Export `validateEmail(email: string): { valid: boolean; reason?: 'format' | 'disposable' | 'typo' }`.
  - Check regex, then check `domain in disposableSet` (build a `Set<string>` at module load).
  - Do NOT do MX lookup (would need async + dns module, out of scope).

- [ ] Create `lib/honeypot.ts`:
  - Export `HONEYPOT_FIELDS = ['_honey', 'website_url'] as const`.
  - Export `isBot(payload: Record<string, unknown>): boolean` — returns true if any honeypot field is non-empty string.

- [ ] Verify: `cd apps/frontend && pnpm exec tsc --noEmit`. Must pass with 0 errors.

- [ ] Commit: `git add -A && git commit -m "feat(email): add headers/validator/honeypot helpers + deps"`

---

## Task 2 — Create `lib/email.ts` core sendEmail helper

**Files:**
- Create: `apps/frontend/src/lib/email.ts`

**Steps:**

- [ ] Create `lib/email.ts` with:
  - Export type `EmailPayload = { to: string | string[]; subject: string; html: string; text?: string; replyTo?: string; headers?: Record<string, string>; unsubscribeUrl?: string; tag?: string }`.
  - Export type `SendResult = { ok: true; id: string } | { ok: false; error: string; status: number }`.
  - Export const `FROM_EMAIL = process.env.EMAIL_FROM ?? "Aïssa BELKOUSSA <contact@aissabelkoussa.fr>"`.
  - Export const `CONTACT_EMAIL = "contact@aissabelkoussa.fr"`.
  - Export async `sendEmail(payload: EmailPayload): Promise<SendResult>`:
    1. Read `RESEND_API_KEY` from env. If missing, return `{ok:false, error:'no_api_key', status:500}`.
    2. If `payload.text` not provided, auto-generate from HTML via `htmlToText(payload.html, { wordwrap: 80, selectors: [{ selector: 'a', options: { baseUrl: 'https://www.aissabelkoussa.fr' } }] })`.
    3. Merge headers: `buildDefaultHeaders({ unsubscribeUrl: payload.unsubscribeUrl, contactEmail: CONTACT_EMAIL })` + `payload.headers`.
    4. POST to `https://api.resend.com/emails` with body `{ from: FROM_EMAIL, to, subject, html, text, reply_to, headers, tags: payload.tag ? [{name:'category',value:payload.tag}] : undefined }`.
    5. On 5xx: retry once after 500ms.
    6. On non-ok after retry: `console.error('[email] send failed', { status, body: await res.text(), tag })`, return `{ok:false, ...}`.
    7. On ok: parse `{ id }` from response, return `{ok:true, id}`.
  - Export `sendEmailOrThrow(payload): Promise<string>` — wraps sendEmail, throws on failure, returns id.

- [ ] Verify: `pnpm exec tsc --noEmit`.

- [ ] Commit: `feat(email): add lib/email.ts core sender with retry + auto text fallback`

---

## Task 3 — Extract templates to `lib/email-templates/`

**Files:**
- Create: `apps/frontend/src/lib/email-templates/index.ts`
- Create: `apps/frontend/src/lib/email-templates/newsletter-admin.ts`
- Create: `apps/frontend/src/lib/email-templates/newsletter-welcome.ts`
- Create: `apps/frontend/src/lib/email-templates/contact-admin.ts`
- Create: `apps/frontend/src/lib/email-templates/contact-confirm.ts`
- Create: `apps/frontend/src/lib/email-templates/lead-magnet.ts`

**Steps:**

- [ ] Create `index.ts`:
  - Export `type TemplateResult = { subject: string; html: string; text?: string }`.
  - Export `esc(str: string): string` (HTML escape, same as existing in `contact/route.ts`).
  - Barrel re-export all 5 templates.

- [ ] For each template file, export a pure function `(data) => TemplateResult`:
  - `newsletterAdminTemplate({ email, source, nowFr })` — verbatim HTML from current `apps/frontend/src/app/api/newsletter/route.ts` lines 43-110 (the `buildAdminEmail` function already there). Move it, don't rewrite.
  - `newsletterWelcomeTemplate({ email, unsubscribeUrl })` — verbatim HTML from current `newsletter/route.ts` (`buildWelcomeEmail`).
  - `contactAdminTemplate(data)` — verbatim HTML from `contact/route.ts` `buildAdminEmail`.
  - `contactConfirmTemplate(data)` — verbatim HTML from `contact/route.ts` `buildConfirmationEmail`.
  - **NO `lead-magnet.ts` extraction** — `lib/lead-emails.ts` already exists with `welcomeEmail`, `sectorEmail`, `hotOutreachEmail`, including tracked PDF redirect URLs. It stays as-is. Only task 6 will adapt the leads/capture route to call `sendEmail()` around the existing `welcomeEmail()` return value.

- [ ] Each template's `text` field: leave `undefined` — it will be auto-generated by `sendEmail`. Exception: if a template has legal notice text that must appear verbatim in plain, set it manually.

- [ ] Each template returns `{ subject, html }` — the `subject` lives WITH the template, not in the route. This guarantees bilingual subjects stay with their content.

- [ ] Verify: `pnpm exec tsc --noEmit`.

- [ ] Commit: `refactor(email): extract templates to lib/email-templates`

---

## Task 4 — Refactor `api/newsletter/route.ts` + add honeypot

**Files:**
- Modify: `apps/frontend/src/app/api/newsletter/route.ts`

**Steps:**

- [ ] Replace the current route with a slim version:
  1. Parse body, check rate limit (KEEP the in-memory Map for now — Upstash is out of scope).
  2. Call `isBot(body)` → silently return `{success:true}` if true.
  3. Call `validateEmail(email)` → return 400 if invalid, with specific `reason`.
  4. Send admin email via `sendEmail({ to: CONTACT_EMAIL, ...newsletterAdminTemplate(...), replyTo: email, tag: 'newsletter-admin' })`.
  5. Build unsubscribe URL via `safeUnsubscribeUrl(email)` (keep existing helper, or inline).
  6. Send welcome email via `sendEmail({ to: email, ...newsletterWelcomeTemplate({email, unsubscribeUrl: unsubUrl}), unsubscribeUrl: unsubUrl ?? undefined, tag: 'newsletter-welcome' })`.
  7. Return `{success: true}`. On admin send failure return 500. Welcome failure is logged but non-blocking.

- [ ] File target size: <80 lines.

- [ ] Verify: `pnpm exec tsc --noEmit`.

- [ ] Manual check: `curl -X POST http://localhost:3000/api/newsletter -H 'Content-Type: application/json' -d '{"email":"test@test.test","source":"plan-test","_honey":""}'` → expect 400 (disposable).

- [ ] Commit: `refactor(newsletter): use lib/email + honeypot + strict validation`

---

## Task 5 — Refactor `api/contact/route.ts`

**Files:**
- Modify: `apps/frontend/src/app/api/contact/route.ts`

**Steps:**

- [ ] Keep: lead scoring (`scorelead`), bilingual `labels`, payload validation, origin check, rate limit, dual-send to backend.

- [ ] Replace: `buildAdminEmail`, `buildConfirmationEmail`, local `sendEmail` helper → use `contactAdminTemplate`, `contactConfirmTemplate`, and `sendEmail` from `lib/email`.

- [ ] Lead score is passed INTO the template as part of `data` (templates stay pure — they receive everything they need).

- [ ] Replace the local honeypot check with `isBot(body)` from `lib/honeypot`.

- [ ] Subject lines: move bilingual subjects from `labels` into the template return value (`contactAdminTemplate` returns `{subject: '...', html: '...'}`). The route stops choosing subjects.

- [ ] File target size: <150 lines (from 477).

- [ ] Verify: `pnpm exec tsc --noEmit`.

- [ ] Commit: `refactor(contact): use lib/email + centralized templates`

---

## Task 6 — Refactor `api/leads/capture/route.ts`

**Files:**
- Modify: `apps/frontend/src/app/api/leads/capture/route.ts`

**Preserve (critical — DO NOT break):**
- Imports from `@/lib/lead-scoring` (`computeInitialScore`, `getSegment`, `getRecommendedPlan`, types `Sector`, `CompanySize`).
- Import `welcomeEmail` from `@/lib/lead-emails` — still called as-is.
- **Telegram notification** when score ≥ 30 (with 🔥/📥 emoji by threshold). This is a separate side channel, not an email, leave it intact.
- Dual-send fire-and-forget to `${BACKEND_URL}/api/leads`.
- Admin email subject format: `Lead ${segment} — ${name} (${sector}) — Score ${score}/100`.
- Payload shape: `email`, `name`, `sector`, `companySize`, `source`.

**Steps:**

- [ ] Replace raw `fetch('https://api.resend.com/emails', ...)` calls with `sendEmail()` from `lib/email`. The `welcomeEmail()` existing function returns the content shape — wrap it: if `welcomeEmail()` returns `{ subject, html }`, pass through directly; if it returns only `html` (string), look at the function in `lib/lead-emails.ts` to see actual return type and adapt.

- [ ] **Add `replyTo`** on both emails: admin email replyTo = lead's email; user welcome email replyTo = `CONTACT_EMAIL`.

- [ ] **Add honeypot check** via `isBot(body)` — silent return `{success: true}` if bot.

- [ ] **Add strict validation** via `validateEmail(email)` → return 400 with `reason` if disposable/format.

- [ ] Add `unsubscribeUrl` to the welcome email call (lead is being added to a marketing funnel) — generate via `safeUnsubscribeUrl(email)` pattern (copy the helper from the refactored `newsletter/route.ts`).

- [ ] `text` fallback → automatic via `lib/email` (auto from html).

- [ ] File target size: <140 lines (from 189). Telegram notification block preserved verbatim.

- [ ] Verify: `pnpm exec tsc --noEmit` + `pnpm exec next build`.

- [ ] Commit: `refactor(leads): use lib/email + honeypot + reply_to + strict validation`

---

## Task 7 — Add honeypot to Footer newsletter form

**Files:**
- Modify: `apps/frontend/src/components/Footer.tsx`

**Steps:**

- [ ] Locate the newsletter form (recon says lines 99-116).

- [ ] Add a hidden input field:
  ```tsx
  <input
    type="text"
    name="_honey"
    tabIndex={-1}
    autoComplete="off"
    aria-hidden="true"
    style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
    onChange={(e) => setHoney(e.target.value)}
    value={honey}
  />
  ```
  With a state `const [honey, setHoney] = useState('')`.

- [ ] Include `_honey: honey` in the POST body to `/api/newsletter`.

- [ ] Verify: dev server starts without warning, DOM inspection shows the field off-screen, a real user never sees it.

- [ ] Commit: `feat(footer): add honeypot to newsletter form`

---

## Task 8 — Webhook Resend `/api/webhooks/resend/route.ts`

**Files:**
- Create: `apps/frontend/src/app/api/webhooks/resend/route.ts`

**Steps:**

- [ ] Create route handler `POST(request: Request)`:
  1. Verify signature: Resend sends `Svix-Id`, `Svix-Timestamp`, `Svix-Signature` headers. Use `svix` package (install: `pnpm add svix`) OR manual HMAC check with `RESEND_WEBHOOK_SECRET` env var.
  2. If secret not set, log warning and **reject** (fail-closed — webhooks without signature = attack vector).
  3. Parse event. Resend event types: `email.sent`, `email.delivered`, `email.bounced`, `email.complained`, `email.opened`, `email.clicked`.
  4. For `email.bounced` (hard bounce) and `email.complained`: log structured `console.log('[resend-webhook] suppress', { email, type, timestamp })`. Future: write to a `suppression_list` table. For now, logging is enough — we can grep logs on Vercel.
  5. Return 200 always (ack the webhook).

- [ ] Add env var documentation in `.env.example`: `RESEND_WEBHOOK_SECRET=<generate with openssl rand -hex 32, paste in Resend dashboard webhook config>`.

- [ ] Verify: `pnpm exec tsc --noEmit`.

- [ ] Commit: `feat(email): add Resend webhook handler for bounces/complaints`

---

## Task 9 — Email preview route `/api/dev/email-preview` + backend Python refactor

**Files:**
- Create: `apps/frontend/src/app/api/dev/email-preview/route.ts`
- Modify: `apps/backend/services/resend_service.py`

**Steps (frontend preview):**

- [ ] Create route `GET(request: Request)`:
  1. `if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_EMAIL_PREVIEW) return new Response('Not found', { status: 404 })`.
  2. Read `template` and `lang` from query params.
  3. Switch on template name, call the corresponding template function with **fake but realistic data** (not mock data in production — this is a dev tool, fake data is the product).
  4. Return `new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })`.
  5. If `template` missing or unknown: return an HTML index listing all available templates with links.

- [ ] Verify: `curl http://localhost:3000/api/dev/email-preview?template=newsletter-welcome` renders HTML.

**Steps (backend Python):**

- [ ] Read `apps/backend/services/resend_service.py` (65 lines).
- [ ] Add params to the send function: `text: Optional[str] = None`, `reply_to: Optional[str] = None`, `headers: Optional[Dict[str, str]] = None`, `tag: Optional[str] = None`.
- [ ] If `text is None`, auto-generate via `html2text` (Python stdlib alternative: `html2text` package — add to `apps/backend/requirements.txt`).
- [ ] Add default `List-Unsubscribe` header builder (mirror of frontend `lib/email-headers.ts`).
- [ ] Send payload includes `text`, `reply_to`, `headers`, `tags`.

- [ ] Commit: `feat(email): dev preview route + backend Resend service parity`

---

## Task 10 — Documentation + deferred items registry

**Files:**
- Create: `docs/email-system.md`
- Create: `docs/secret-rotation.md`
- Create: `docs/email-system-deferred.md`

**Steps:**

- [ ] `docs/email-system.md`:
  - Architecture diagram (text-based): Route → validator → honeypot → template → lib/email → Resend → webhook.
  - "How to add a new email template" 5-step recipe.
  - List of all templates with their trigger and recipient.
  - Env vars table.
  - Links to preview route.

- [ ] `docs/secret-rotation.md`:
  - Why: compromise containment, periodic hygiene.
  - When: every 12 months, or immediately on suspected leak.
  - `NEWSLETTER_UNSUBSCRIBE_SECRET` rotation: (1) generate new via `openssl rand -hex 32`, (2) deploy with BOTH old and new via `NEWSLETTER_UNSUBSCRIBE_SECRET_NEXT`, (3) verifier accepts either, (4) wait 72h (max unsubscribe link age in sent emails), (5) remove old. **Note:** this requires a code change — document as a future refactor of `newsletter-token.ts` to support dual-key. Flag as TODO.
  - `RESEND_API_KEY` rotation: create new in Resend dashboard, update Vercel env, redeploy, delete old in Resend dashboard.

- [ ] `docs/email-system-deferred.md`:
  - **Upstash Redis rate limiting** — replace in-memory Map. Requires: Upstash account (free tier), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Implementation: use `@upstash/ratelimit` package. Est. 45min.
  - **Sentry observability** — wrap `sendEmail` errors + webhook failures in `Sentry.captureException`. Requires: Sentry account, `SENTRY_DSN`. Est. 30min.
  - **Admin dashboard metrics** — `apps/admin/src/app/dashboard/emails/page.tsx` exists; add bounce/complaint counters from webhook log or DB table. Requires: suppression table in DB. Est. 2h.
  - **Disposable domain sync** — the `disposable-email-domains` list is static; set up a monthly cron to update dependency.
  - **Backend rate limiting** — the Python backend routes `/api/contact` and `/api/leads` have zero rate limit. Add slowapi. Est. 20min.
  - **Dual-send architecture cleanup** — frontend routes do fire-and-forget to backend, creating dual source of truth (Resend + Mongo). Decide: single source (backend only, frontend becomes proxy) or keep dual with idempotency keys. Est. 3h design + implementation.

- [ ] Commit: `docs(email): architecture + rotation + deferred items`

---

## Final Verification (after all tasks)

- [ ] `cd apps/frontend && pnpm exec tsc --noEmit` → 0 errors.
- [ ] `cd apps/frontend && pnpm exec next build` → successful build, no warnings about the routes.
- [ ] Start dev server, hit preview route: `http://localhost:3000/api/dev/email-preview` → lists all 5 templates. Click each → renders.
- [ ] Curl test each POST route with valid payload → 200. With disposable email → 400. With honeypot filled → 200 but no email sent (check Resend dashboard).
- [ ] `git log --oneline -15` → one commit per task, messages clean.
- [ ] Push: `git push origin main`.

## Out-of-scope reminder

This plan does NOT install a test framework. A follow-up plan should add Vitest + cover `lib/email.ts`, `lib/email-validator.ts`, and template snapshot tests. Don't ship to production critical business logic without tests long-term.
