# Session 25 mars 2026 — Refonte complete du portfolio

## Contexte

Le portfolio (aissabelkoussa.fr) etait en etat "preliminaire" : faux projets, liens morts, formulaire non fonctionnel, zero SEO/GEO, pas de meta OG. Cette session a tout corrige et pousse le site en etat production-ready.

---

## 1. Projets — Remplacement du contenu fictif

**Fichier :** `src/components/LanguageContext.tsx`

Les deux faux projets (NEXUS CORE, QUANTUM FLOW) ont ete remplaces par des projets reels. DK BUILDING avait une description erronee ("Real Estate Ecosystem" au lieu de construction metallique).

### Projets integres (FR + EN)

| Projet | Tagline | Stack |
|---|---|---|
| **DK BUILDING** | Site corporate & CMS sur-mesure — BTP, Albi | React 19, Node.js, Vercel, Turso DB, Cloudinary, GSAP |
| **JOLANANAS** | Storefront e-commerce premium — Mode artisanale francaise | Next.js, TypeScript, Shopify GraphQL, Prisma, PostgreSQL, Framer Motion |
| **ALBI RP** | Ecosysteme jeu + bot + site — Roblox RP francophone | Lua/Luau, TypeScript, Discord.js, Vercel, Tailwind, Zod |

### Donnees des projets (recherchees depuis les repos)

- **DK BUILDING** : `/Volumes/Professionnel/CREATIVE AISSA/Entreprises/DK BUILDING/Site Web/`
  - Monorepo React 19 + Node.js/Express, 50 composants, 7 routes API, JWT sha512, Turso DB, Cloudinary, Resend
  - Deploye sur dkbuilding.fr

- **JOLANANAS** : `/Volumes/Professionnel/CREATIVE AISSA/Entreprises/Jolananas/`
  - Next.js 16 + Shopify Storefront API GraphQL, 380+ fichiers TS, 80+ composants, 26+ pages
  - Deploye sur jolananas.vercel.app

- **ALBI RP** : `/Volumes/Professionnel/Projets/Developpement/Concepts/ALBI RP/`
  - Jeu Roblox (222 fichiers Lua) + Bot Discord (11 packages TS) + Site landing + API
  - 401 MB code + assets, 10+ langues

**Fichier :** `src/components/sections/Systems.tsx`
- Ajout de l'affichage des stack tags en pills sous chaque card projet
- Ajout du champ `stack: string[]` au type Dictionary

---

## 2. Footer — Nettoyage

**Fichier :** `src/components/Footer.tsx`

- "Version preliminaire" retiree (bloc supprime)
- Liens sociaux mis a jour avec les vraies URLs :
  - LinkedIn : linkedin.com/in/aissabelkoussa
  - GitHub : github.com/aissablk1
  - Telegram : t.me/investwithaissa
- `target="_blank" rel="noopener noreferrer"` ajoute sur tous les liens externes

---

## 3. SEO — Metadata & Open Graph

**Fichier :** `src/app/layout.tsx`

- Metadata complete : title template, description, keywords longue traine, authors, creator, publisher
- Open Graph : type, locale, siteName, images
- Twitter Card : summary_large_image
- Viewport : responsive + themeColor adaptatif dark/light
- robots : googleBot avec max-image-preview large, max-snippet -1
- 3 schemas JSON-LD injectes (Person, Organization, WebSite) depuis la librairie

**Note :** L'image OG actuelle (AISSABELKOUSSA.png) est en portrait 1242x2208. Une image 1200x630 paysage est recommandee pour LinkedIn.

---

## 4. Schema.org — Librairie complete

**Fichier cree :** `src/lib/schemas.ts`

Schemas disponibles :
- `personSchema` — identite complete avec @id, sameAs, knowsAbout, adresse Albi
- `organizationSchema` — ProfessionalService + LocalBusiness, taxID, OfferCatalog avec 3 services
- `websiteSchema` — lie au Person via @id
- `createProjectSchema()` — generateur pour les pages projets (CreativeWork)
- `createBreadcrumbSchema()` — generateur de fil d'Ariane
- `faqSchema` — 5 questions/reponses pre-redigees pour la future page FAQ

---

## 5. SEO Technique — Fichiers crees

### `next.config.ts` (nouveau)
- Security headers : X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- Image optimization : AVIF + WebP, deviceSizes, cache 1 an
- `optimizeCss: true`, `optimizePackageImports` pour framer-motion et lucide
- `poweredByHeader: false`

### `src/app/robots.ts` (nouveau)
- Autorise tous les crawlers + specifiquement GPTBot, Claude-Web, PerplexityBot, GoogleOther
- Pointe vers le sitemap

### `src/app/sitemap.ts` (nouveau)
- 5 URLs : home (1.0), contact (0.8), 3 projets (0.9)
- `lastModified: new Date()` pour fraicheur

---

## 6. GEO — Generative Engine Optimization

### `public/llms.txt` (nouveau)
Fiche d'identite pour les LLMs (ChatGPT, Perplexity, Claude) :
- Identite professionnelle
- Competences techniques verifiees (par categorie)
- 3 projets avec contexte, probleme, solution, stack, metriques
- Services proposes
- Liens et contact
- Informations legales (SIREN, SIRET, NAF, TVA)

---

## 7. Formulaire de contact — Systeme complet

### Avant
- `handleSubmit` faisait juste `setIsSubmitted(true)` — aucun email envoye
- Pas de champ email — impossible de repondre au prospect
- Template hardcode en francais

### Apres

**Fichier :** `src/components/ContactForm.tsx`
- Champ email ajoute (type email, validation regex)
- Honeypot anti-spam (champ invisible, bots le remplissent → rejet silencieux)
- Envoi reel via POST `/api/contact`
- Loading state bilingue ("Envoi..." / "Sending...")
- Message d'erreur bilingue avec fallback LinkedIn
- Langue envoyee dans le payload

**Fichier cree :** `src/app/api/contact/route.ts`
- Validation complete du payload (nom, email regex, message, budget, langue)
- Honeypot check — si rempli, renvoie `{ success: true }` sans envoyer (ne pas alerter le bot)
- Rate limiting in-memory : 3 requetes max par IP par 15 minutes → 429
- **Double email en parallele (Promise.all) :**
  1. **Email admin** (theme dark) — nom, email cliquable, entreprise, besoin en badge, budget, message, timestamp, badge langue, bouton "Repondre maintenant" (mailto pre-rempli)
  2. **Email confirmation prospect** (theme light) — salutation personnalisee (prenom), recap de la demande, promesse 48h, signature avec liens site/LinkedIn/GitHub
- Labels entierement bilingues (FR/EN) via objet `labels`
- `reply_to` pointe vers l'email du prospect
- Utilise `fetch()` direct vers l'API Resend (pas de SDK, zero dependance supplementaire)

### Configuration Resend
- **Domaine verifie** : aissabelkoussa.fr (DKIM via resend._domainkey TXT)
- **From** : `Aïssa Belkoussa <contact@aissabelkoussa.fr>`
- **Cle API** dans `.env.local` (gitignore)

### DNS (OVHcloud) — Etat actuel
```
A       aissabelkoussa.fr       → 216.198.79.1 (Vercel)
MX      aissabelkoussa.fr       → mx01/mx02.mail.icloud.com (iCloud Mail)
TXT     aissabelkoussa.fr       → apple-domain=VUJnQBRyJarxRmJD
SPF     aissabelkoussa.fr       → v=spf1 include:icloud.com ~all
TXT     resend._domainkey       → [DKIM Resend]
CNAME   sig1._domainkey         → sig1.dkim.aissabelkoussa.fr.at.icloudmailadmin.com
CNAME   www                     → f1f0ec239b0fc4a4.vercel-dns-017.com
```

**A FAIRE :** Modifier le SPF pour inclure Resend :
`v=spf1 include:icloud.com include:amazonses.com ~all`

---

## 8. Packages installes

- `resend` — SDK Resend (non utilise directement, fetch() prefere)
- `@react-email/components` — disponible pour futurs templates React Email

---

## 9. Espace disque

Le volume `/Volumes/Professionnel/` etait a 100% (32 Mo restants sur 122 Go). Actions prises :
- Suppression `.next/` (453 Mo liberes)
- `pnpm store prune` (3.2 Go liberes — 175 000 fichiers, 3 882 packages)
- Suppression node_modules de 4 projets inactifs (remparq 1 Go, ParleCitoyen 2.9 Go, _backup 28 Mo, liquidgl-react 44 Mo)
- Execution de `clean.sh` sur `/Volumes/Professionnel/Projets/Developpement/Concepts/` (7.8 Go liberes)

---

## 10. Fichiers modifies / crees — Recapitulatif

### Modifies
| Fichier | Changement |
|---|---|
| `src/components/LanguageContext.tsx` | 3 vrais projets + stack + champ email dans Dictionary |
| `src/components/sections/Systems.tsx` | Stack tags en pills |
| `src/components/Footer.tsx` | Liens sociaux reels, "Version preliminaire" retiree |
| `src/components/ContactForm.tsx` | Champ email, honeypot, POST reel, bilingue, loading/error |
| `src/app/layout.tsx` | Metadata complete, viewport, OG, Twitter, JSON-LD schemas |

### Crees
| Fichier | Role |
|---|---|
| `next.config.ts` | Security headers, image optimization, compression |
| `src/lib/schemas.ts` | Person, Organization, WebSite, FAQ, Project, Breadcrumb schemas |
| `src/app/robots.ts` | Crawlers + bots IA autorises |
| `src/app/sitemap.ts` | 5 URLs avec priorites |
| `src/app/api/contact/route.ts` | API contact : validation, rate limit, honeypot, double email bilingue |
| `public/llms.txt` | Fiche GEO pour LLMs |
| `.env.local` | Cle API Resend (gitignore) |

---

## 11. A faire — Prochaines actions

### Immediat
- [ ] Modifier SPF dans OVHcloud : ajouter `include:amazonses.com`
- [ ] Ajouter `RESEND_API_KEY` dans les variables d'environnement Vercel
- [ ] Creer une image OG 1200x630 (fond dark + nom + tagline)
- [ ] Commit + push → deploiement Vercel automatique

### Semaine 1
- [ ] Brancher Google Search Console + soumettre sitemap
- [ ] Brancher GA4 avec evenements conversion (formulaire contact)
- [ ] Optimiser profil LinkedIn (bio, banniere, URL perso)
- [ ] 1er post LinkedIn sur DK Building

### Semaine 2-3
- [ ] Creer page `/faq` avec schema FAQPage (deja pret dans schemas.ts)
- [ ] Retirer domaines morts dans iCloud Mail (aissabelkoussa.com, creativeaissa.com)
- [ ] Finaliser iCloud Mail pour aissabelkoussa.fr
- [ ] Articles blog : cas DK Building, Shopify/Next.js

### Mois 2+
- [ ] Google Business Profile (Albi)
- [ ] Profils Malt, Dev.to, Hashnode
- [ ] Page `/services` avec schemas Service
