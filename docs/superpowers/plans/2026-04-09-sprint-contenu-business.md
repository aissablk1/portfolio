# Sprint Contenu + Business — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce 8 blog articles (FR+EN), 8 LinkedIn posts, and a 30-prospect BTP list to fuel the content marketing flywheel.

**Architecture:** Each article = 2 MDX files (FR+EN) in `apps/frontend/src/content/blog/`. Each LinkedIn post = entry in POSTS array in `scripts/linkedin/post.py`. Prospects = standalone HTML doc in `docs/prospection/`.

**Tech Stack:** MDX (gray-matter frontmatter), Python (LinkedIn API), HTML (prospect doc)

---

### Task 1: Article 8 — Artisan BTP fiche Google Maps

**Files:**
- Create: `apps/frontend/src/content/blog/artisan-btp-fiche-google-maps-2026.fr.mdx`
- Create: `apps/frontend/src/content/blog/artisan-btp-fiche-google-maps-2026.en.mdx`

- [ ] **Step 1: Write FR article**

Frontmatter:
```yaml
---
title: "Artisan BTP : comment apparaitre en premier sur Google Maps en 2026"
description: "Votre fiche Google Business ne vous rapporte aucun appel ? Voici les 7 etapes concretes pour dominer Google Maps dans votre zone — avec les vrais chiffres d'un artisan du Tarn."
date: "2026-04-10"
publishAt: "2026-04-10T08:00:00+02:00"
updatedAt: "2026-04-10"
author: "Aissa BELKOUSSA"
tags: ["BTP", "Google Maps", "artisan", "referencement local", "SEO"]
category: "SEO"
image: "/assets/blog/artisan-btp-google-maps/cover.jpg"
imageAlt: "Fiche Google Business d'un artisan BTP sur mobile avec avis clients"
published: true
featured: false
---
```

Content: 800-1200 mots. Sections: pourquoi Google Maps est crucial pour artisans BTP, les 7 etapes (creer/optimiser fiche, photos chantiers, avis clients, categories precises, posts reguliers, NAP coherent, lien site), tableaux de prix (gratuit a 200 EUR/mois si delegue), FAQ 4 questions, CTA vers /diagnostic et /services.

- [ ] **Step 2: Write EN article**

Same structure, English translation. Frontmatter: same dates, English title/description/tags/category.

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/content/blog/artisan-btp-fiche-google-maps-2026.fr.mdx apps/frontend/src/content/blog/artisan-btp-fiche-google-maps-2026.en.mdx
git commit -m "feat: article 8 — artisan BTP Google Maps (FR+EN)"
```

---

### Task 2: Article 9 — Agent immobilier chatbot visite IA

**Files:**
- Create: `apps/frontend/src/content/blog/agent-immobilier-chatbot-visite-ia.fr.mdx`
- Create: `apps/frontend/src/content/blog/agent-immobilier-chatbot-visite-ia.en.mdx`

- [ ] **Step 1: Write FR article**

Frontmatter:
```yaml
---
title: "Agent immobilier : comment un chatbot IA qualifie vos visites a votre place"
description: "Un agent immobilier perd 40% de son temps avec des visiteurs non qualifies. Un chatbot IA filtre, qualifie et planifie les visites — 24h/24. Voici comment ca marche et combien ca coute."
date: "2026-04-10"
publishAt: "2026-04-10T14:00:00+02:00"
updatedAt: "2026-04-10"
author: "Aissa BELKOUSSA"
tags: ["immobilier", "chatbot", "IA", "qualification", "automatisation"]
category: "Immobilier"
image: "/assets/blog/agent-immobilier-chatbot-visite/cover.jpg"
imageAlt: "Chatbot IA qualifiant un prospect immobilier sur mobile"
published: true
featured: false
---
```

Content: 800-1200 mots. Sections: le probleme (visites non qualifiees), comment le chatbot qualifie (budget, type bien, delai, financement), integration calendrier/CRM, tableau prix (SaaS vs sur-mesure), FAQ, CTA /audit.

- [ ] **Step 2: Write EN article**

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/content/blog/agent-immobilier-chatbot-visite-ia.fr.mdx apps/frontend/src/content/blog/agent-immobilier-chatbot-visite-ia.en.mdx
git commit -m "feat: article 9 — agent immobilier chatbot visite IA (FR+EN)"
```

---

### Task 3: Article 10 — Restaurant reservations automatiques IA

**Files:**
- Create: `apps/frontend/src/content/blog/restaurant-reservations-automatiques-ia.fr.mdx`
- Create: `apps/frontend/src/content/blog/restaurant-reservations-automatiques-ia.en.mdx`

- [ ] **Step 1: Write FR article**

Frontmatter:
```yaml
---
title: "Restaurateur : automatisez vos reservations avec l'IA (et arretez de decrocher le telephone)"
description: "Un restaurant de 40 couverts perd 2h/jour au telephone pour les reservations. Voici comment automatiser avec l'IA — comparatif des solutions, prix et ROI reel."
date: "2026-04-11"
publishAt: "2026-04-11T08:00:00+02:00"
updatedAt: "2026-04-11"
author: "Aissa BELKOUSSA"
tags: ["restaurant", "reservation", "IA", "automatisation", "hotellerie"]
category: "Automatisation"
image: "/assets/blog/restaurant-reservations-ia/cover.jpg"
imageAlt: "Systeme de reservation automatique pour restaurant sur tablette"
published: true
featured: false
---
```

Content: 800-1200 mots. Sections: cout du telephone (2h x 25 EUR/h = 50 EUR/jour), solutions (TheFork, chatbot site, WhatsApp auto), tableau comparatif prix, integration Google Resa, FAQ, CTA.

- [ ] **Step 2: Write EN article**

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/content/blog/restaurant-reservations-automatiques-ia.fr.mdx apps/frontend/src/content/blog/restaurant-reservations-automatiques-ia.en.mdx
git commit -m "feat: article 10 — restaurant reservations IA (FR+EN)"
```

---

### Task 4: Article 11 — Comptable automatiser relances impayes

**Files:**
- Create: `apps/frontend/src/content/blog/comptable-automatiser-relances-impayees.fr.mdx`
- Create: `apps/frontend/src/content/blog/comptable-automatiser-relances-impayees.en.mdx`

- [ ] **Step 1: Write FR article**

Frontmatter:
```yaml
---
title: "Comptable : comment automatiser vos relances d'impayes sans perdre la relation client"
description: "Un cabinet comptable relance manuellement ses impayes — 4h/semaine perdues. Voici comment automatiser les 3 niveaux de relance avec n8n, Make ou Pennylane, sans deshumaniser."
date: "2026-04-11"
publishAt: "2026-04-11T14:00:00+02:00"
updatedAt: "2026-04-11"
author: "Aissa BELKOUSSA"
tags: ["comptable", "relances", "automatisation", "impayes", "n8n"]
category: "Automatisation"
image: "/assets/blog/comptable-relances-impayees/cover.jpg"
imageAlt: "Dashboard de suivi des relances automatisees pour cabinet comptable"
published: true
featured: false
---
```

Content: 800-1200 mots. Sections: cout des relances manuelles, les 3 niveaux (J+3 rappel doux, J+15 relance formelle, J+30 mise en demeure), outils (n8n, Make, Pennylane, QuickBooks), tableau prix, FAQ, CTA.

- [ ] **Step 2: Write EN article**

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/content/blog/comptable-automatiser-relances-impayees.fr.mdx apps/frontend/src/content/blog/comptable-automatiser-relances-impayees.en.mdx
git commit -m "feat: article 11 — comptable relances impayes (FR+EN)"
```

---

### Task 5: Article 12 — Commerce proximite site e-commerce local

**Files:**
- Create: `apps/frontend/src/content/blog/commerce-proximite-site-ecommerce-local.fr.mdx`
- Create: `apps/frontend/src/content/blog/commerce-proximite-site-ecommerce-local.en.mdx`

- [ ] **Step 1: Write FR article**

Frontmatter:
```yaml
---
title: "Commerce de proximite : faut-il un site e-commerce local en 2026 ?"
description: "Click & collect, livraison locale, catalogue en ligne — un commerce de proximite a-t-il interet a vendre en ligne ? Analyse honnete avec les vrais couts et le ROI attendu."
date: "2026-04-12"
publishAt: "2026-04-12T08:00:00+02:00"
updatedAt: "2026-04-12"
author: "Aissa BELKOUSSA"
tags: ["commerce", "e-commerce", "local", "click-and-collect", "TPE"]
category: "E-commerce"
image: "/assets/blog/commerce-ecommerce-local/cover.jpg"
imageAlt: "Commerce de proximite avec systeme click and collect sur tablette"
published: true
featured: false
---
```

Content: 800-1200 mots. Sections: pour qui ca vaut le coup (pas tout le monde), les 3 modeles (vitrine, click & collect, livraison locale), plateformes (Shopify, WooCommerce, sur-mesure), tableau prix, quand NE PAS faire de e-commerce, FAQ, CTA.

- [ ] **Step 2: Write EN article**

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/content/blog/commerce-proximite-site-ecommerce-local.fr.mdx apps/frontend/src/content/blog/commerce-proximite-site-ecommerce-local.en.mdx
git commit -m "feat: article 12 — commerce proximite e-commerce local (FR+EN)"
```

---

### Task 6: Article 13 — ROI intelligence artificielle TPE 2026

**Files:**
- Create: `apps/frontend/src/content/blog/roi-intelligence-artificielle-tpe-2026.fr.mdx`
- Create: `apps/frontend/src/content/blog/roi-intelligence-artificielle-tpe-2026.en.mdx`

- [ ] **Step 1: Write FR article**

Frontmatter:
```yaml
---
title: "Quel ROI attendre de l'IA quand on est TPE en 2026 — chiffres reels"
description: "L'IA promet des gains de productivite de 40%. Mais pour une TPE de 3 personnes, combien ca rapporte concretement ? Analyse par poste de depense avec les vrais chiffres."
date: "2026-04-13"
publishAt: "2026-04-13T08:00:00+02:00"
updatedAt: "2026-04-13"
author: "Aissa BELKOUSSA"
tags: ["IA", "ROI", "TPE", "productivite", "automatisation"]
category: "IA"
image: "/assets/blog/roi-ia-tpe/cover.jpg"
imageAlt: "Graphique ROI de l'IA pour une TPE avec gains par poste"
published: true
featured: false
---
```

Content: 800-1200 mots. Sections: les promesses vs la realite, ROI par poste (admin 8h/sem gagnees, commercial 5 leads/sem, SAV 60% tickets auto), tableau investissement vs retour a 6/12 mois, les pieges (IA sans process = zero ROI), FAQ, CTA.

- [ ] **Step 2: Write EN article**

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/content/blog/roi-intelligence-artificielle-tpe-2026.fr.mdx apps/frontend/src/content/blog/roi-intelligence-artificielle-tpe-2026.en.mdx
git commit -m "feat: article 13 — ROI IA pour TPE 2026 (FR+EN)"
```

---

### Task 7: Article 14 — Artisan BTP planning chantier automatise

**Files:**
- Create: `apps/frontend/src/content/blog/artisan-btp-planning-chantier-automatise.fr.mdx`
- Create: `apps/frontend/src/content/blog/artisan-btp-planning-chantier-automatise.en.mdx`

- [ ] **Step 1: Write FR article**

Frontmatter:
```yaml
---
title: "Artisan BTP : automatisez votre planning de chantier (et arretez les post-it)"
description: "Un artisan BTP perd 3h/semaine a gerer son planning sur papier ou Excel. Voici les outils et methodes pour automatiser la planification de chantier — du gratuit au sur-mesure."
date: "2026-04-14"
publishAt: "2026-04-14T08:00:00+02:00"
updatedAt: "2026-04-14"
author: "Aissa BELKOUSSA"
tags: ["BTP", "planning", "chantier", "automatisation", "artisan"]
category: "Automatisation"
image: "/assets/blog/artisan-planning-chantier/cover.jpg"
imageAlt: "Application de planning de chantier BTP sur tablette avec vue Gantt"
published: true
featured: false
---
```

Content: 800-1200 mots. Sections: les couts du planning manuel (retards, oublis, double booking), les 3 niveaux (Google Calendar gratuit, Buildrz/Obat 30-80 EUR/mois, sur-mesure), tableau comparatif, integration avec devis et facturation, FAQ, CTA.

- [ ] **Step 2: Write EN article**

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/content/blog/artisan-btp-planning-chantier-automatise.fr.mdx apps/frontend/src/content/blog/artisan-btp-planning-chantier-automatise.en.mdx
git commit -m "feat: article 14 — artisan BTP planning chantier (FR+EN)"
```

---

### Task 8: Article 15 — Coach tunnel de vente formation en ligne

**Files:**
- Create: `apps/frontend/src/content/blog/coach-tunnel-vente-formation-en-ligne.fr.mdx`
- Create: `apps/frontend/src/content/blog/coach-tunnel-vente-formation-en-ligne.en.mdx`

- [ ] **Step 1: Write FR article**

Frontmatter:
```yaml
---
title: "Coach : comment construire un tunnel de vente pour votre formation en ligne"
description: "Un coach formateur qui vend sa formation sans tunnel de vente laisse 70% des prospects partir. Voici l'architecture complete — pages, emails, automatisations — avec les couts reels."
date: "2026-04-14"
publishAt: "2026-04-14T14:00:00+02:00"
updatedAt: "2026-04-14"
author: "Aissa BELKOUSSA"
tags: ["coaching", "formation", "tunnel de vente", "automatisation", "marketing"]
category: "Marketing"
image: "/assets/blog/coach-tunnel-vente/cover.jpg"
imageAlt: "Schema d'un tunnel de vente pour formation en ligne avec etapes et taux de conversion"
published: true
featured: false
---
```

Content: 800-1200 mots. Sections: pourquoi un tunnel (vs page de vente seule), les 5 etapes (lead magnet, page capture, sequence email, page de vente, upsell), outils (Systeme.io, Podia, sur-mesure), tableau prix, FAQ, CTA.

- [ ] **Step 2: Write EN article**

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/content/blog/coach-tunnel-vente-formation-en-ligne.fr.mdx apps/frontend/src/content/blog/coach-tunnel-vente-formation-en-ligne.en.mdx
git commit -m "feat: article 15 — coach tunnel vente formation (FR+EN)"
```

---

### Task 9: LinkedIn posts 6-13

**Files:**
- Modify: `scripts/linkedin/post.py` — append 8 entries to POSTS array (ids 6-13)

- [ ] **Step 1: Write 8 LinkedIn posts**

Append to the POSTS array after the existing post id=4. Each post follows the existing structure: `id`, `title`, `date_prevue`, `hashtags`, `content`, `comment_link`.

Posts to write:
- **#6** (10 avril) — Artisan BTP Google Maps. Hook: "Votre fiche Google existe. Mais personne ne vous trouve." CTA: article 8
- **#7** (11 avril) — Chatbot immobilier. Hook: "Un agent immobilier fait 12 visites pour signer 1 mandat." CTA: article 9
- **#8** (12 avril) — Restaurant reservations. Hook: "Votre serveur decroche le telephone 47 fois par service." CTA: article 10
- **#9** (14 avril) — Comptable relances. Hook: "Vos relances d'impayes partent a J+45. Vos confreres les envoient a J+3. Automatiquement." CTA: article 11
- **#10** (15 avril) — Commerce local. Hook: "Un commerce de proximite a-t-il interet a vendre en ligne ?" CTA: article 12
- **#11** (16 avril) — ROI IA TPE. Hook: "L'IA promet 40% de gains. Pour une TPE de 3 personnes, ca donne combien en euros ?" CTA: article 13
- **#12** (17 avril) — Planning chantier BTP. Hook: "Le planning de chantier sur post-it coute plus cher que l'outil qui le remplace." CTA: article 14
- **#13** (18 avril) — Coach tunnel vente. Hook: "Votre formation se vend a 497 EUR. Votre page de vente convertit a 1,2%. Le probleme n'est pas le prix." CTA: article 15

Each comment_link points to the corresponding blog article URL + diagnostic link.

- [ ] **Step 2: Commit**

```bash
git add scripts/linkedin/post.py
git commit -m "feat: LinkedIn posts 6-13 for articles 8-15"
```

---

### Task 10: Update LinkedIn scheduler dates

**Files:**
- Modify: `scripts/linkedin/scheduler.py` — add schedule entries for posts 6-13

- [ ] **Step 1: Add schedule entries**

Add entries mapping post IDs 6-13 to their dates and times (10h00 CET, 12h00 for Saturday).

- [ ] **Step 2: Commit**

```bash
git add scripts/linkedin/scheduler.py
git commit -m "feat: scheduler dates for LinkedIn posts 6-13"
```

---

### Task 11: 30 prospects BTP Tarn

**Files:**
- Create: `docs/prospection/prospects-btp-tarn.html`

- [ ] **Step 1: Research and write prospect list**

Use web search to find 30 artisans BTP in the Tarn (81) department. Structure:
- Table with columns: Entreprise, Activite, Ville, Site web, LinkedIn, Priorite
- Priorite Haute = pas de site web, Moyenne = site obsolete, Basse = site correct
- Cover: Albi, Castres, Gaillac, Carmaux, Mazamet, Lavaur, Rabastens
- Activites: maconnerie, electricite, plomberie, charpente, couverture, peinture, carrelage, menuiserie

Include meta tags for docs/index.html integration:
```html
<meta name="doc-category" content="Prospection">
<meta name="doc-title" content="30 prospects BTP Tarn">
<meta name="doc-color" content="#2563eb">
```

- [ ] **Step 2: Update docs/index.html CATEGORIES**

Add entry in Prospection category:
```js
{ name: "30 prospects BTP Tarn", path: "prospection/prospects-btp-tarn.html" }
```

- [ ] **Step 3: Update docs/manifest.json**

Add `"prospection/prospects-btp-tarn.html"` to the array.

- [ ] **Step 4: Commit**

```bash
git add docs/prospection/prospects-btp-tarn.html docs/index.html docs/manifest.json
git commit -m "feat: 30 prospects BTP Tarn with priority scoring"
```

---

### Task 12: Final push

- [ ] **Step 1: Push all commits**

```bash
git push
```

- [ ] **Step 2: Verify deployment**

Check Vercel deployment is READY. Verify articles appear at:
- https://www.aissabelkoussa.fr/blog/artisan-btp-fiche-google-maps-2026
- https://www.aissabelkoussa.fr/blog/agent-immobilier-chatbot-visite-ia

(Articles with future publishAt dates will appear after their scheduled time via ISR revalidation.)
