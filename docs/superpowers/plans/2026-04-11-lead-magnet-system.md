# Système d'acquisition intelligent — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Système complet de capture, scoring et nurturing de leads via un guide PDF gratuit, avec data layer Supabase, emails Resend et notifications Telegram.

**Architecture:** Landing /guide-ia → formulaire 4 champs → insert Supabase + score initial → email bienvenue Resend → tracking comportemental → cron nurture J+3 sectoriel → notifications Telegram leads chauds → dashboard métriques.

**Tech Stack:** Next.js 16 (Route Handlers), Supabase (PostgreSQL), Resend (emails), Telegram Bot API, GA4 events.

**Spec:** `docs/superpowers/specs/2026-04-11-lead-magnet-system-design.md`

---

## File Structure

### New files
- `apps/frontend/src/lib/supabase.ts` — Supabase client singleton
- `apps/frontend/src/lib/lead-scoring.ts` — Algorithme de scoring (initial + comportemental)
- `apps/frontend/src/lib/lead-emails.ts` — Templates email (bienvenue, J+3 sectoriel, hot outreach)
- `apps/frontend/src/app/guide-ia/layout.tsx` — Metadata + schemas
- `apps/frontend/src/app/guide-ia/page.tsx` — Landing page + formulaire
- `apps/frontend/src/app/guide-ia/merci/page.tsx` — Page confirmation
- `apps/frontend/src/app/api/leads/capture/route.ts` — Capture lead + score + email
- `apps/frontend/src/app/api/leads/track/route.ts` — Event tracking comportemental
- `apps/frontend/src/app/api/leads/redirect/route.ts` — Redirect tracker pour emails
- `apps/frontend/src/app/api/leads/webhook/resend/route.ts` — Webhook Resend
- `apps/frontend/src/app/api/leads/cron/nurture/route.ts` — Cron email J+3
- `apps/frontend/src/app/api/leads/cron/hot-notify/route.ts` — Cron notification Telegram
- `apps/frontend/src/app/api/leads/dashboard/route.ts` — Métriques agrégées
- `public/assets/guides/guide-ia-dirigeants-2026.pdf` — Guide PDF statique

### Modified files
- `apps/frontend/src/components/LeadMagnetGate.tsx` — Améliorer pour utiliser /api/leads/capture
- `apps/frontend/src/components/TrackingBeacon.tsx` — Enrichir avec lead tracking
- `apps/frontend/src/app/sitemap.ts` — Ajouter /guide-ia
- `apps/frontend/.env.local` — Ajouter SUPABASE_URL, SUPABASE_SERVICE_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
- `apps/frontend/src/components/LanguageContext.tsx` — Ajouter clés guide-ia FR/EN

---

## Phase 1 : Foundation (capture + email + Supabase)

### Task 1: Supabase — installer client + créer tables

**Files:**
- Create: `apps/frontend/src/lib/supabase.ts`
- Modify: `apps/frontend/.env.local`

- [ ] **Step 1: Installer @supabase/supabase-js**

```bash
cd apps/frontend && pnpm add @supabase/supabase-js
```

- [ ] **Step 2: Créer le client Supabase**

Créer `apps/frontend/src/lib/supabase.ts` :

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
```

- [ ] **Step 3: Créer les tables via Supabase MCP**

Utiliser `mcp__plugin_supabase_supabase__apply_migration` avec le SQL :

```sql
-- Table leads
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  sector text NOT NULL,
  company_size text NOT NULL,
  score integer DEFAULT 0,
  segment text DEFAULT 'FROID',
  source text DEFAULT 'guide-ia',
  status text DEFAULT 'new',
  recommended_plan text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table lead_events
CREATE TABLE IF NOT EXISTS lead_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Table email_sends
CREATE TABLE IF NOT EXISTS email_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  template text NOT NULL,
  resend_id text,
  status text DEFAULT 'sent',
  sent_at timestamptz DEFAULT now(),
  opened_at timestamptz,
  clicked_at timestamptz
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_leads_segment ON leads(segment);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at);
CREATE INDEX idx_lead_events_lead ON lead_events(lead_id);
CREATE INDEX idx_lead_events_type ON lead_events(event_type);
CREATE INDEX idx_email_sends_lead ON email_sends(lead_id);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;

-- Politique service_role uniquement (pas d'accès public)
CREATE POLICY "Service role full access" ON leads FOR ALL USING (true);
CREATE POLICY "Service role full access" ON lead_events FOR ALL USING (true);
CREATE POLICY "Service role full access" ON email_sends FOR ALL USING (true);
```

- [ ] **Step 4: Ajouter les env vars dans .env.local**

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx
```

- [ ] **Step 5: Commit**

```bash
git add apps/frontend/src/lib/supabase.ts apps/frontend/package.json apps/frontend/pnpm-lock.yaml
git commit -m "feat: supabase client + tables leads/events/emails"
```

---

### Task 2: Algorithme de scoring

**Files:**
- Create: `apps/frontend/src/lib/lead-scoring.ts`

- [ ] **Step 1: Créer le module de scoring**

Créer `apps/frontend/src/lib/lead-scoring.ts` :

```typescript
export type Sector = "btp" | "comptabilite" | "immobilier" | "courtage" | "commerce" | "autre";
export type CompanySize = "solo" | "2-10" | "11-50" | "50+";
export type Segment = "FROID" | "TIÈDE" | "CHAUD" | "BRÛLANT";

const SECTOR_SCORES: Record<Sector, number> = {
  btp: 10,
  comptabilite: 10,
  immobilier: 8,
  courtage: 8,
  commerce: 5,
  autre: 3,
};

const SIZE_SCORES: Record<CompanySize, number> = {
  "solo": 5,
  "2-10": 10,
  "11-50": 20,
  "50+": 30,
};

export const EVENT_SCORES: Record<string, number> = {
  email_opened: 5,
  email_clicked: 10,
  page_services: 15,
  page_calculateur: 10,
  page_diagnostic: 10,
  diagnostic_completed: 20,
  page_contact: 25,
  return_visit: 10,
  j3_opened: 5,
  j3_clicked: 15,
};

export function computeInitialScore(sector: Sector, size: CompanySize): number {
  return (SECTOR_SCORES[sector] || 3) + (SIZE_SCORES[size] || 5);
}

export function getSegment(score: number): Segment {
  if (score >= 76) return "BRÛLANT";
  if (score >= 51) return "CHAUD";
  if (score >= 26) return "TIÈDE";
  return "FROID";
}

export function getRecommendedPlan(size: CompanySize): string {
  if (size === "50+" || size === "11-50") return "partenaire";
  if (size === "2-10") return "accelerateur";
  return "starter";
}

const SECTOR_ARTICLES: Record<Sector, { slug: string; cta: string }> = {
  btp: { slug: "automatiser-devis-artisan-btp", cta: "/diagnostic" },
  comptabilite: { slug: "expert-comptable-ia-automatisation-cabinet", cta: "/calculateur-roi" },
  immobilier: { slug: "agence-immobiliere-site-web-generation-mandats", cta: "/diagnostic" },
  courtage: { slug: "courtier-assurance-automatiser-qualification-leads", cta: "/calculateur-roi" },
  commerce: { slug: "commerce-or-bijouterie-site-web-confiance-seo", cta: "/diagnostic" },
  autre: { slug: "roi-intelligence-artificielle-tpe-2026", cta: "/diagnostic" },
};

export function getSectorArticle(sector: Sector) {
  return SECTOR_ARTICLES[sector] || SECTOR_ARTICLES.autre;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/lib/lead-scoring.ts
git commit -m "feat: algorithme de scoring leads multi-facteurs"
```

---

### Task 3: Templates email

**Files:**
- Create: `apps/frontend/src/lib/lead-emails.ts`

- [ ] **Step 1: Créer le module de templates email**

Créer `apps/frontend/src/lib/lead-emails.ts` :

```typescript
const SITE_URL = "https://www.aissabelkoussa.fr";
const FROM_EMAIL = "Aïssa BELKOUSSA <contact@aissabelkoussa.fr>";

function redirectUrl(to: string, leadId: string, emailId: string): string {
  const params = new URLSearchParams({ to, lid: leadId, eid: emailId });
  return `${SITE_URL}/api/leads/redirect?${params.toString()}`;
}

export function welcomeEmail(name: string, leadId: string, emailId: string) {
  const pdfLink = redirectUrl(`${SITE_URL}/assets/guides/guide-ia-dirigeants-2026.pdf`, leadId, emailId);

  return {
    from: FROM_EMAIL,
    subject: `Votre guide IA est prêt, ${name}`,
    html: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px 24px;background:#fafafa;font-family:system-ui,sans-serif;">
  <div style="max-width:500px;margin:0 auto;">
    <h1 style="color:#1a1a1a;font-size:20px;margin:0 0 16px;">Bonjour ${name},</h1>
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Merci d'avoir téléchargé le guide. Voici votre lien :
    </p>
    <a href="${pdfLink}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Télécharger le guide →
    </a>
    <p style="color:#999;font-size:13px;line-height:1.7;margin:24px 0 0;">
      15 pages, 5 cas d'usage par secteur, les vrais prix.
    </p>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e5e5;">
      <p style="color:#999;font-size:12px;margin:0;">Aïssa BELKOUSSA — Consultant IA, Albi</p>
    </div>
  </div>
</body></html>`,
  };
}

export function sectorEmail(
  name: string,
  sector: string,
  articleSlug: string,
  ctaPath: string,
  leadId: string,
  emailId: string,
) {
  const sectorLabels: Record<string, { subject: string; intro: string }> = {
    btp: {
      subject: "Comment les artisans BTP automatisent leurs devis avec l'IA",
      intro: "Un artisan passe en moyenne 3h par devis. L'IA réduit ça à 15 minutes.",
    },
    comptabilite: {
      subject: "5 tâches qu'un cabinet comptable peut automatiser dès aujourd'hui",
      intro: "40% du temps d'un collaborateur comptable est consacré à des tâches automatisables.",
    },
    immobilier: {
      subject: "Votre site d'agence devrait générer des mandats, pas juste afficher des annonces",
      intro: "90% des vendeurs commencent par une estimation en ligne. Si vous n'en proposez pas, ils vont ailleurs.",
    },
    courtage: {
      subject: "Courtier : automatisez la qualification et doublez vos RDV",
      intro: "Sur 5 RDV, 1 seul mène à un contrat. Un chatbot filtre les 4 autres automatiquement.",
    },
    commerce: {
      subject: "Commerce : un site web qui inspire confiance et attire les clients",
      intro: "80% des clients font des recherches en ligne avant de se déplacer.",
    },
    autre: {
      subject: "Le ROI concret de l'IA pour une TPE en 2026",
      intro: "L'IA promet des gains de 40%. Pour une TPE, voici ce que ça donne en euros.",
    },
  };

  const s = sectorLabels[sector] || sectorLabels.autre;
  const articleLink = redirectUrl(`${SITE_URL}/blog/${articleSlug}`, leadId, emailId);
  const ctaLink = redirectUrl(`${SITE_URL}${ctaPath}`, leadId, emailId);

  return {
    from: FROM_EMAIL,
    subject: `${name}, ${s.subject.toLowerCase()}`,
    html: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px 24px;background:#fafafa;font-family:system-ui,sans-serif;">
  <div style="max-width:500px;margin:0 auto;">
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px;">Bonjour ${name},</p>
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px;">${s.intro}</p>
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 24px;">
      J'ai écrit un article complet sur le sujet — avec les vrais chiffres et les outils concrets.
    </p>
    <a href="${articleLink}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Lire l'article →
    </a>
    <p style="color:#999;font-size:13px;line-height:1.7;margin:24px 0 0;">
      Vous voulez savoir où votre entreprise en est ?
      <a href="${ctaLink}" style="color:#1a1a1a;font-weight:600;">Faites le diagnostic gratuit (2 min)</a>
    </p>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e5e5;">
      <p style="color:#999;font-size:12px;margin:0;">Aïssa BELKOUSSA — Consultant IA, Albi</p>
    </div>
  </div>
</body></html>`,
  };
}

export function hotOutreachEmail(name: string, leadId: string, emailId: string) {
  const calendlyLink = redirectUrl("https://calendly.com/aissabelkoussa/30min", leadId, emailId);

  return {
    from: FROM_EMAIL,
    subject: `${name}, un échange de 15 minutes ?`,
    html: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px 24px;background:#fafafa;font-family:system-ui,sans-serif;">
  <div style="max-width:500px;margin:0 auto;">
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px;">Bonjour ${name},</p>
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px;">
      J'ai vu que le sujet de l'IA pour votre activité vous intéresse. Si vous voulez en discuter concrètement — pas de vente, juste un échange pour voir si je peux vous aider — je suis disponible.
    </p>
    <a href="${calendlyLink}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Réserver 15 minutes →
    </a>
    <p style="color:#999;font-size:13px;line-height:1.7;margin:24px 0 0;">
      Zéro engagement, zéro spam. Juste une conversation.
    </p>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e5e5;">
      <p style="color:#999;font-size:12px;margin:0;">Aïssa BELKOUSSA — Consultant IA, Albi</p>
    </div>
  </div>
</body></html>`,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/lib/lead-emails.ts
git commit -m "feat: templates email leads (bienvenue, sectoriel, hot outreach)"
```

---

### Task 4: API /api/leads/capture

**Files:**
- Create: `apps/frontend/src/app/api/leads/capture/route.ts`

- [ ] **Step 1: Créer la route de capture**

Créer `apps/frontend/src/app/api/leads/capture/route.ts` :

```typescript
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { computeInitialScore, getSegment, getRecommendedPlan } from "@/lib/lead-scoring";
import { welcomeEmail } from "@/lib/lead-emails";
import type { Sector, CompanySize } from "@/lib/lead-scoring";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const rateMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  entry.count++;
  return entry.count > 5;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { email?: string; name?: string; sector?: string; companySize?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, name, sector, companySize, source } = body;

  if (!email || !name || !sector || !companySize) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const score = computeInitialScore(sector as Sector, companySize as CompanySize);
  const segment = getSegment(score);
  const recommendedPlan = getRecommendedPlan(companySize as CompanySize);

  // Upsert lead (si déjà existant, met à jour)
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .upsert(
      {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        sector,
        company_size: companySize,
        score,
        segment,
        source: source || "guide-ia",
        recommended_plan: recommendedPlan,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    )
    .select("id")
    .single();

  if (leadError || !lead) {
    console.error("Supabase lead error:", leadError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // Enregistrer l'event
  await supabase.from("lead_events").insert({
    lead_id: lead.id,
    event_type: "captured",
    event_data: { sector, company_size: companySize, initial_score: score, source: source || "guide-ia" },
  });

  // Envoyer email bienvenue via Resend
  if (RESEND_API_KEY) {
    const emailRecord = await supabase
      .from("email_sends")
      .insert({ lead_id: lead.id, template: "welcome" })
      .select("id")
      .single();

    const emailId = emailRecord.data?.id || "unknown";
    const emailPayload = welcomeEmail(name.trim(), lead.id, emailId);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...emailPayload, to: email.trim().toLowerCase() }),
    });

    if (resendRes.ok) {
      const resendData = await resendRes.json();
      await supabase
        .from("email_sends")
        .update({ resend_id: resendData.id })
        .eq("id", emailId);
    }
  }

  // Notification Telegram si score élevé
  if (score >= 40) {
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChat = process.env.TELEGRAM_CHAT_ID;
    if (telegramToken && telegramChat) {
      const msg = `📥 Nouveau lead ${segment} — ${name} (${sector}, ${companySize}) — Score: ${score}/100 — ${email}`;
      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: telegramChat, text: msg }),
      }).catch(() => {});
    }
  }

  return NextResponse.json({
    success: true,
    leadId: lead.id,
    score,
    segment,
    recommendedPlan,
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/app/api/leads/capture/route.ts
git commit -m "feat: API /api/leads/capture — scoring + Supabase + Resend + Telegram"
```

---

### Task 5: Landing page /guide-ia

**Files:**
- Create: `apps/frontend/src/app/guide-ia/layout.tsx`
- Create: `apps/frontend/src/app/guide-ia/page.tsx`
- Create: `apps/frontend/src/app/guide-ia/merci/page.tsx`
- Modify: `apps/frontend/src/app/sitemap.ts`
- Modify: `apps/frontend/src/components/LanguageContext.tsx`

- [ ] **Step 1: Ajouter les clés dictionnaire FR + EN dans LanguageContext.tsx**

Ajouter au type Dictionary et aux dictionnaires FR/EN les clés pour guide-ia (titre, description, formulaire, bouton, confirmation).

- [ ] **Step 2: Créer le layout avec metadata + schemas**

Créer `apps/frontend/src/app/guide-ia/layout.tsx` avec :
- Metadata SEO (title, description, canonical, OpenGraph)
- Schema WebPage + breadcrumb
- Composant Breadcrumbs

- [ ] **Step 3: Créer la page landing**

Créer `apps/frontend/src/app/guide-ia/page.tsx` — page client avec :
- Hero : titre + sous-titre
- Sommaire du guide (6 chapitres)
- Formulaire 4 champs (prénom, email, secteur select, taille select)
- Preuve sociale (93 projets, 4+ ans)
- Soumission vers /api/leads/capture
- Après succès : redirect vers /guide-ia/merci
- Set cookie `lead_id` pour le tracking comportemental

- [ ] **Step 4: Créer la page de confirmation**

Créer `apps/frontend/src/app/guide-ia/merci/page.tsx` :
- Message "Votre guide est en route"
- Lien direct vers le PDF
- CTA vers /diagnostic
- Animation confetti ou checkmark

- [ ] **Step 5: Ajouter /guide-ia au sitemap**

Ajouter à `sitemap.ts` : priorité 0.9, changeFrequency monthly.

- [ ] **Step 6: Commit**

```bash
git add apps/frontend/src/app/guide-ia/ apps/frontend/src/app/sitemap.ts apps/frontend/src/components/LanguageContext.tsx
git commit -m "feat: landing page /guide-ia + formulaire capture + page merci"
```

---

### Task 6: Améliorer LeadMagnetGate

**Files:**
- Modify: `apps/frontend/src/components/LeadMagnetGate.tsx`

- [ ] **Step 1: Mettre à jour pour utiliser /api/leads/capture**

Modifier `LeadMagnetGate.tsx` :
- Ajouter les champs secteur et taille (select)
- Changer l'endpoint de `/api/lead-magnet/capture` vers `/api/leads/capture`
- Stocker le `lead_id` retourné dans le cookie
- Corriger les accents (Télécharger, prête, prénom)
- Utiliser les clés LanguageContext au lieu de ternaires

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/components/LeadMagnetGate.tsx
git commit -m "feat: LeadMagnetGate utilise /api/leads/capture + champs secteur/taille"
```

---

## Phase 2 : Nurturing + Tracking

### Task 7: API /api/leads/track + redirect

**Files:**
- Create: `apps/frontend/src/app/api/leads/track/route.ts`
- Create: `apps/frontend/src/app/api/leads/redirect/route.ts`

- [ ] **Step 1: Créer la route de tracking**

Créer `apps/frontend/src/app/api/leads/track/route.ts` :
- POST avec `{ leadId, eventType, eventData }`
- Insert dans `lead_events`
- Recalcule le score avec `EVENT_SCORES[eventType]`
- Met à jour `leads.score` et `leads.segment`
- Si le segment passe à BRÛLANT → notification Telegram

- [ ] **Step 2: Créer le redirect tracker**

Créer `apps/frontend/src/app/api/leads/redirect/route.ts` :
- GET avec query params `?to=URL&lid=LEAD_ID&eid=EMAIL_ID`
- Insert event `email_clicked` dans `lead_events`
- Met à jour `email_sends.clicked_at`
- Recalcule le score
- Redirect 302 vers `to`

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/app/api/leads/track/ apps/frontend/src/app/api/leads/redirect/
git commit -m "feat: API tracking comportemental + redirect tracker emails"
```

---

### Task 8: Webhook Resend (opened/clicked)

**Files:**
- Create: `apps/frontend/src/app/api/leads/webhook/resend/route.ts`

- [ ] **Step 1: Créer le webhook handler**

Créer la route :
- POST recevant les webhooks Resend (type: email.opened, email.clicked, email.bounced)
- Cherche l'email_send par `resend_id`
- Met à jour `opened_at` ou `clicked_at`
- Insert un event dans `lead_events`
- Recalcule le score du lead

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/app/api/leads/webhook/
git commit -m "feat: webhook Resend — mise à jour score sur email opened/clicked"
```

---

### Task 9: Cron nurture J+3

**Files:**
- Create: `apps/frontend/src/app/api/leads/cron/nurture/route.ts`

- [ ] **Step 1: Créer le cron handler**

Créer la route :
- GET protégé par header `Authorization: Bearer CRON_SECRET`
- Requête Supabase : leads avec `segment IN ('TIÈDE', 'CHAUD', 'BRÛLANT')` et `created_at` entre 3 et 4 jours
- Vérifie qu'aucun email `j3_sector` n'a été envoyé (table `email_sends`)
- Pour chaque lead éligible : génère l'email sectoriel avec `sectorEmail()`, envoie via Resend, insert dans `email_sends`

- [ ] **Step 2: Configurer le cron Vercel**

Ajouter dans `vercel.json` :
```json
{
  "crons": [
    { "path": "/api/leads/cron/nurture", "schedule": "0 9 * * *" }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/app/api/leads/cron/ vercel.json
git commit -m "feat: cron nurture J+3 — email sectoriel automatique"
```

---

### Task 10: Cron hot-notify + Telegram

**Files:**
- Create: `apps/frontend/src/app/api/leads/cron/hot-notify/route.ts`

- [ ] **Step 1: Créer le cron handler**

Créer la route :
- GET protégé par `CRON_SECRET`
- Requête : leads avec segment BRÛLANT et pas encore de `hot_outreach` envoyé
- Envoie notification Telegram
- Envoie email hot outreach avec `hotOutreachEmail()`
- Insert dans `email_sends`

- [ ] **Step 2: Ajouter au cron Vercel**

```json
{ "path": "/api/leads/cron/hot-notify", "schedule": "0 * * * *" }
```

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/app/api/leads/cron/hot-notify/
git commit -m "feat: cron hot-notify — Telegram + email pour leads brûlants"
```

---

### Task 11: Enrichir TrackingBeacon

**Files:**
- Modify: `apps/frontend/src/components/TrackingBeacon.tsx`

- [ ] **Step 1: Ajouter le lead tracking**

Modifier `TrackingBeacon.tsx` :
- Lire le cookie `lead_id` (set par /guide-ia après capture)
- Si présent, envoyer un POST à `/api/leads/track` en plus du `/api/ping` existant
- Mapper les pages prioritaires : `/services` → `page_services`, `/calculateur-roi` → `page_calculateur`, `/diagnostic` → `page_diagnostic`, `/contact` → `page_contact`
- Détecter les return visits (cookie `last_visit` avec date, si > 2 jours → event `return_visit`)

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/components/TrackingBeacon.tsx
git commit -m "feat: TrackingBeacon enrichi — tracking leads comportemental"
```

---

## Phase 3 : Dashboard + finitions

### Task 12: API dashboard métriques

**Files:**
- Create: `apps/frontend/src/app/api/leads/dashboard/route.ts`

- [ ] **Step 1: Créer la route dashboard**

Créer la route :
- GET protégé par `Authorization: Bearer ADMIN_SECRET`
- Requêtes Supabase agrégées :
  - Total leads, par segment, par secteur, par taille
  - Leads cette semaine, ce mois
  - Taux d'ouverture emails (email_sends where opened_at IS NOT NULL / total)
  - Taux de clic (clicked_at IS NOT NULL / total)
  - Score moyen par segment
  - Derniers 20 leads avec historique events
- Retourne un JSON structuré

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/app/api/leads/dashboard/
git commit -m "feat: API dashboard métriques leads"
```

---

### Task 13: Guide PDF statique

**Files:**
- Create: `apps/frontend/public/assets/guides/guide-ia-dirigeants-2026.pdf`

- [ ] **Step 1: Créer le guide PDF**

Générer un PDF HTML de 15-20 pages avec le contenu défini dans la spec :
1. Introduction : l'IA en 2026
2. Ce que l'IA fait concrètement pour une PME
3. 5 cas d'usage par secteur
4. Les vrais prix
5. Comment démarrer
6. Checklist 30 points
7. CTA diagnostic

Utiliser un agent pour générer le HTML puis convertir en PDF, ou créer directement avec un outil en ligne.

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/public/assets/guides/
git commit -m "feat: guide PDF 'L'IA pour les dirigeants' (15 pages)"
```

---

## Récap des commits

| Task | Commit |
|---|---|
| 1 | Supabase client + tables |
| 2 | Algorithme scoring |
| 3 | Templates email |
| 4 | API capture |
| 5 | Landing /guide-ia |
| 6 | LeadMagnetGate amélioré |
| 7 | API track + redirect |
| 8 | Webhook Resend |
| 9 | Cron nurture J+3 |
| 10 | Cron hot-notify |
| 11 | TrackingBeacon enrichi |
| 12 | API dashboard |
| 13 | Guide PDF |
