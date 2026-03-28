# SEO & GEO — Configuration technique

## Vue d'ensemble

Le site est optimise pour le referencement classique (Google) et le referencement generatif (ChatGPT, Perplexity, Claude). Tout est gere par Next.js via les exports `metadata`, `robots()`, `sitemap()` et les fichiers statiques.

---

## Metadata globale

**Fichier :** `src/app/layout.tsx`

### Champs configures
- `title` : template `%s — Aïssa Belkoussa` pour les pages enfants
- `description` : pitch court orientation systemes/automation
- `keywords` : 10 mots-cles longue traine cibles
- `authors`, `creator`, `publisher` : Aïssa Belkoussa
- `alternates.canonical` : URL canonique
- `category` : technology

### Open Graph
- Type : website
- Locale : fr_FR
- Image : `/assets/images/AISSABELKOUSSA.png` (1242x2208 — a remplacer par 1200x630)

### Twitter Card
- Type : summary_large_image

### Viewport
- Responsive : width device-width, initialScale 1
- themeColor adaptatif : blanc en light, #0a0a0a en dark

### Robots
- Index + follow
- googleBot : max-image-preview large, max-snippet -1, max-video-preview -1

---

## Schema.org (JSON-LD)

**Fichier :** `src/lib/schemas.ts`

### Schemas actifs (injectes dans layout.tsx)

**personSchema**
- Type : Person
- @id : `https://www.aissabelkoussa.fr/#person`
- Identite complete : nom, prenom, jobTitle, description, image
- sameAs : LinkedIn, GitHub, Telegram
- knowsAbout : 8 competences
- Adresse : Albi, 81000, Occitanie, FR
- Lie a Organization via worksFor

**organizationSchema**
- Types : Organization + ProfessionalService + LocalBusiness
- @id : `https://www.aissabelkoussa.fr/#organization`
- taxID : 937 690 592
- OfferCatalog : 3 services (Architecture/Automation, Design/Ecosystemes, Workflow/Data)
- areaServed : France + Worldwide
- Lie a Person via founder @id

**websiteSchema**
- Type : WebSite
- Lie a Person via author @id

### Schemas disponibles (non encore injectes)

**createProjectSchema(project)**
- Type : CreativeWork
- Genere un schema pour chaque page projet
- Parametres : name, slug, description, stack, datePublished

**createBreadcrumbSchema(items)**
- Type : BreadcrumbList
- Genere un fil d'Ariane pour la navigation

**faqSchema**
- Type : FAQPage
- 5 questions/reponses pre-redigees
- A injecter dans la future page /faq

---

## robots.ts

**Fichier :** `src/app/robots.ts`

Genere dynamiquement `/robots.txt`.

Crawlers autorises :
- `*` (tous)
- `GPTBot` (ChatGPT)
- `Claude-Web` (Claude/Anthropic)
- `PerplexityBot` (Perplexity)
- `GoogleOther` (Google AI features)

Pointe vers : `https://www.aissabelkoussa.fr/sitemap.xml`

---

## sitemap.ts

**Fichier :** `src/app/sitemap.ts`

Genere dynamiquement `/sitemap.xml`.

| URL | Priorite | Frequence |
|---|---|---|
| `/` | 1.0 | monthly |
| `/contact` | 0.8 | monthly |
| `/projects/dk-building` | 0.9 | monthly |
| `/projects/jolananas` | 0.9 | monthly |
| `/projects/albi-rp` | 0.9 | monthly |

`lastModified` : date courante a chaque generation.

---

## llms.txt (GEO)

**Fichier :** `public/llms.txt`

Fiche d'identite pour les moteurs generatifs. Accessible sur `https://www.aissabelkoussa.fr/llms.txt`.

Contenu structure :
- Identite professionnelle (positionnement, distinction builder/consultant)
- Competences techniques par categorie (frontend, backend, DB, infra, jeu, qualite)
- 3 projets avec contexte complet, probleme, solution, stack, metriques
- Services proposes (3 piliers)
- Liens et contact
- Informations legales (SIREN, SIRET, NAF, TVA)

---

## next.config.ts

**Fichier :** `next.config.ts`

### Security headers (toutes les routes)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Performance
- `compress: true`
- `poweredByHeader: false`
- `optimizeCss: true` (inline CSS critique)
- `optimizePackageImports` : framer-motion, lucide-react (tree-shaking)

### Images
- Formats : AVIF + WebP
- Device sizes : 640, 750, 828, 1080, 1200, 1920
- Cache TTL : 1 an (31536000s)
