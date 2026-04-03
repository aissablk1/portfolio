# Infrastructure & Deploiement

## Stack technique

| Couche | Technologie | Version |
|---|---|---|
| Framework | Next.js | 16.1.6 |
| Runtime | React | 19.2.4 |
| Langage | TypeScript | strict |
| CSS | Tailwind CSS | 4.2.1 |
| Animations | Framer Motion | 12.36.0 |
| 3D | Cobe (globe) | 0.6.5 |
| Icons | Lucide React | 0.577.0 |
| Email | Resend (via fetch) | API REST |

---

## Hebergement

### Vercel
- Deploiement automatique sur push vers `main`
- Domaine principal : `www.aissabelkoussa.fr`
- Redirect 308 : `aissabelkoussa.fr` → `www.aissabelkoussa.fr`
- Domaine secondaire : `aissabelkoussa.me` → redirect vers `.fr`
- Serverless functions pour l'API route `/api/contact`

### DNS (OVHcloud)
```
A       @               → 216.198.79.1 (Vercel)
MX      @               → mx01.mail.icloud.com (priorite 10)
MX      @               → mx02.mail.icloud.com (priorite 10)
TXT     @               → apple-domain=VUJnQBRyJarxRmJD
SPF     @               → v=spf1 include:icloud.com ~all
TXT     resend._domainkey → [DKIM Resend]
CNAME   sig1._domainkey  → sig1.dkim.aissabelkoussa.fr.at.icloudmailadmin.com
CNAME   www             → f1f0ec239b0fc4a4.vercel-dns-017.com
```

---

## Variables d'environnement

| Variable | Emplacement | Description |
|---|---|---|
| `RESEND_API_KEY` | `.env.local` + Vercel | Cle API Resend pour envoi emails |

`.env.local` est dans `.gitignore` — la cle n'est jamais commitee.

---

## Email

### Resend
- Domaine verifie : aissabelkoussa.fr
- From : `Aïssa Belkoussa <contact@aissabelkoussa.fr>`
- Free tier : 100 emails/jour, 3 000/mois
- Region : Ireland (eu-west-1)
- Pas de SDK installe — utilisation directe de l'API REST via fetch()

### iCloud Mail
- Emails entrants sur `@aissabelkoussa.fr` via iCloud Mail
- MX records configurees dans OVHcloud

---

## Securite

### Headers HTTP (next.config.ts)
- `X-Content-Type-Options: nosniff` — empeche le MIME sniffing
- `X-Frame-Options: DENY` — empeche l'embedding en iframe
- `Referrer-Policy: strict-origin-when-cross-origin` — limite les donnees referrer
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` — desactive les APIs sensibles

### API Contact
- Rate limiting : 3 req/IP/15 min
- Honeypot anti-spam
- Validation stricte + escaping HTML
- Cle API cote serveur uniquement (pas de NEXT_PUBLIC_)

---

## Scripts

```bash
npm run dev     # Serveur de developpement (Turbopack)
npm run build   # Build de production
npm run start   # Serveur de production
npm run lint    # ESLint
```

---

## Structure du projet

```
apps/frontend/
├── public/
│   ├── assets/images/       # Images statiques
│   ├── assets/videos/       # Videos (glitch-red)
│   └── llms.txt             # Fiche GEO pour LLMs
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout racine (metadata, schemas, fonts)
│   │   ├── page.tsx         # Page d'accueil
│   │   ├── robots.ts        # Generation robots.txt
│   │   ├── sitemap.ts       # Generation sitemap.xml
│   │   ├── contact/         # Page contact
│   │   └── api/contact/     # API route email
│   ├── components/
│   │   ├── LanguageContext.tsx  # i18n (dictionnaire FR/EN)
│   │   ├── ContactForm.tsx     # Formulaire multi-etapes
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SideNav.tsx
│   │   ├── ScrollIndicator.tsx
│   │   ├── sections/        # Sections de la page d'accueil
│   │   └── ui/              # Composants primitifs
│   ├── lib/
│   │   └── schemas.ts       # Schemas JSON-LD
│   └── utils/
│       └── cn.ts            # Utilitaire classes CSS
├── next.config.ts           # Config Next.js
├── tsconfig.json            # Config TypeScript (strict, alias @/*)
├── .env.local               # Variables d'environnement (gitignore)
└── package.json
```
