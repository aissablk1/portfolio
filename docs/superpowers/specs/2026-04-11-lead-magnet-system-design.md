# Système d'acquisition intelligent — Lead Magnet + Scoring + Nurturing

**Date :** 11 avril 2026
**Auteur :** Aïssa BELKOUSSA
**Statut :** Design validé — prêt pour implémentation

---

## 1. Objectif

Construire un système d'acquisition de leads automatisé qui :
- Capture des leads qualifiés via un guide PDF gratuit
- Score chaque lead en temps réel (comportement + profil)
- Route le contenu de nurturing par secteur
- Notifie quand un lead est chaud
- Fournit un dashboard avec métriques (CPA, conversion, engagement)

## 2. Architecture

```
ACQUISITION          QUALIFICATION          CONVERSION          DATA
─────────────        ─────────────          ──────────          ────
/guide-ia            Scoring                Email conditionnel  Dashboard
  ↓                    ↓                      ↓                   ↓
Formulaire ────→ Lead Supabase ────→ Algorithme ────→ Action ────→ Métriques
(4 champs)                            de routage       adaptée     temps réel
                                      maison
```

**Stack :**
- Frontend : Next.js (existant)
- API : Route handlers Next.js
- Email : Resend (existant, clé API en place)
- BDD : Supabase (existant dans la stack)
- Notifications : Telegram Bot API (existant, via scripts/)
- Tracking : Events GA4 custom + table `lead_events` Supabase

## 3. Capture — Page /guide-ia

### 3.1 Landing page

Page dédiée avec :
- Hero : "L'IA pour les dirigeants — ce qui marche vraiment en 2026"
- Sous-titre : "Guide gratuit — 15 pages, 5 cas d'usage par secteur, les vrais prix"
- Formulaire 4 champs
- Preuve sociale (93 projets, 4+ ans)
- Aperçu du contenu du guide (sommaire)

### 3.2 Formulaire

| Champ | Type | Obligatoire | Valeurs |
|---|---|---|---|
| Prénom | text | Oui | — |
| Email | email | Oui | Validation regex |
| Secteur | select | Oui | BTP/Artisanat, Comptabilité/Finance, Immobilier, Commerce/Retail, Courtage/Assurance, Autre |
| Taille | select | Oui | Solo, 2-10, 11-50, 50+ |

### 3.3 Après soumission

1. Insert dans Supabase `leads` avec score initial calculé
2. Email bienvenue + lien PDF via Resend
3. Event GA4 `lead_captured` avec secteur + taille
4. Redirect vers page de confirmation avec lien de téléchargement

## 4. Guide PDF

**Format :** PDF statique hébergé dans `/public/assets/guides/guide-ia-dirigeants-2026.pdf`

Phase 1 : PDF statique (même pour tous). Phase 2 future : génération dynamique par secteur.

**Contenu (15-20 pages) :**
1. Introduction : l'IA en 2026, au-delà du buzz
2. Ce que l'IA fait concrètement pour une PME (pas de jargon)
3. 5 cas d'usage par secteur (BTP, comptabilité, immobilier, commerce, courtage)
4. Les vrais prix : SaaS vs sur-mesure
5. Comment démarrer sans compétence technique
6. Checklist : "Mon entreprise est-elle prête pour l'IA ?" (30 points)
7. Prochaine étape : le diagnostic gratuit (CTA)

## 5. Moteur de décision — Algorithme de scoring

### 5.1 Score initial (à la capture)

| Signal | Points |
|---|---|
| Taille 50+ | +30 |
| Taille 11-50 | +20 |
| Taille 2-10 | +10 |
| Solo | +5 |
| Secteur BTP | +10 |
| Secteur Comptabilité | +10 |
| Secteur Immobilier | +8 |
| Secteur Courtage | +8 |
| Secteur Commerce | +5 |
| Secteur Autre | +3 |

### 5.2 Score comportemental (post-capture)

| Action | Points | Source |
|---|---|---|
| Ouvre email bienvenue | +5 | Webhook Resend |
| Clique lien dans email | +10 | Redirect tracker |
| Visite /services | +15 | API tracking |
| Visite /calculateur-roi | +10 | API tracking |
| Visite /diagnostic | +10 | API tracking |
| Complète le diagnostic | +20 | API existante |
| Visite /contact | +25 | API tracking |
| Revient sur le site (J+2+) | +10 | Cookie |
| Ouvre email J+3 | +5 | Webhook Resend |
| Clique email J+3 | +15 | Redirect tracker |

### 5.3 Segmentation

| Score | Segment | Action automatique |
|---|---|---|
| 0-25 | FROID | Rien |
| 26-50 | TIÈDE | Email J+3 sectoriel |
| 51-75 | CHAUD | Email J+3 + notification Telegram |
| 76+ | BRÛLANT | Notification Telegram immédiate + email "je suis disponible" |

### 5.4 Routage sectoriel (email J+3)

| Secteur | Article lié | CTA |
|---|---|---|
| BTP | /blog/automatiser-devis-artisan-btp | /diagnostic |
| Comptabilité | /blog/expert-comptable-ia-automatisation-cabinet | /calculateur-roi |
| Immobilier | /blog/agence-immobiliere-site-web-generation-mandats | /diagnostic |
| Courtage | /blog/courtier-assurance-automatiser-qualification-leads | /calculateur-roi |
| Commerce | /blog/commerce-or-bijouterie-site-web-confiance-seo | /diagnostic |
| Autre | /blog/roi-intelligence-artificielle-tpe-2026 | /diagnostic |

### 5.5 Email conditionnel (3ème email)

Déclenché uniquement si le prospect clique le lien de l'email J+3. Contenu : lien vers /diagnostic avec message personnalisé. Si pas de clic → pas d'email. Zéro spam.

## 6. Emails

### 6.1 Email bienvenue (J+0, immédiat)

- Sujet : "Votre guide IA est prêt, [Prénom]"
- Contenu court : merci, lien PDF, 1 phrase sur le contenu
- Pas de CTA commercial

### 6.2 Email sectoriel (J+3, conditionnel score ≥ 26)

- Sujet adapté au secteur : "Comment [secteur] automatise [tâche] avec l'IA"
- Contenu : intro 3 lignes + lien article blog + 1 CTA diagnostic/calculateur
- Court (< 150 mots)

### 6.3 Email hot outreach (conditionnel, si clic J+3)

- Sujet : "[Prénom], un échange de 15 minutes ?"
- Contenu : message personnel, pas de template, lien Calendly
- Envoyé uniquement si le prospect a cliqué dans l'email J+3

## 7. Data layer — Supabase

### 7.1 Table `leads`

| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | — |
| email | text UNIQUE | — |
| name | text | Prénom |
| sector | text | BTP, Comptabilité, etc. |
| company_size | text | solo, 2-10, 11-50, 50+ |
| score | int DEFAULT 0 | Score dynamique |
| segment | text DEFAULT 'FROID' | FROID/TIÈDE/CHAUD/BRÛLANT |
| source | text | guide-ia, newsletter, diagnostic |
| status | text DEFAULT 'new' | new, nurturing, qualified, converted, lost |
| recommended_plan | text | starter/accelerateur/partenaire |
| created_at | timestamptz | — |
| updated_at | timestamptz | — |

### 7.2 Table `lead_events`

| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | — |
| lead_id | uuid FK→leads | — |
| event_type | text | email_opened, email_clicked, page_visited, diagnostic_completed |
| event_data | jsonb | { page, email_id, score_delta, etc. } |
| created_at | timestamptz | — |

### 7.3 Table `email_sends`

| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | — |
| lead_id | uuid FK→leads | — |
| template | text | welcome, j3_sector, hot_outreach |
| resend_id | text | ID retourné par Resend |
| status | text | sent, opened, clicked, bounced |
| sent_at | timestamptz | — |
| opened_at | timestamptz | — |
| clicked_at | timestamptz | — |

## 8. API Routes

| Route | Méthode | Description |
|---|---|---|
| `/api/leads/capture` | POST | Capture lead, score, email bienvenue, insert Supabase |
| `/api/leads/track` | POST | Enregistre un event comportemental, recalcule le score |
| `/api/leads/webhook/resend` | POST | Webhook Resend (opened, clicked, bounced) |
| `/api/leads/cron/nurture` | GET | Cron quotidien : identifie les leads à nurturer (J+3), envoie les emails sectoriels |
| `/api/leads/cron/hot-notify` | GET | Cron horaire : détecte les leads BRÛLANT, envoie notification Telegram |
| `/api/leads/dashboard` | GET | Métriques agrégées pour le dashboard |

## 9. Tracking comportemental

### 9.1 Composant TrackingBeacon enrichi

Le composant `TrackingBeacon.tsx` existant est enrichi pour :
- Détecter si le visiteur est un lead connu (cookie `lead_id`)
- Si oui, envoyer un event `page_visited` à `/api/leads/track` sur chaque changement de route
- Pages trackées prioritaires : /services, /calculateur-roi, /diagnostic, /contact, /formation

### 9.2 Redirect tracker pour les emails

Les liens dans les emails passent par un redirect : `/api/leads/redirect?to=URL&lid=LEAD_ID&eid=EMAIL_ID`
- Enregistre l'event `email_clicked`
- Met à jour le score
- Redirige vers la destination

## 10. Dashboard métriques

### 10.1 Métriques d'acquisition

- Leads captés / jour, / semaine, / mois
- CPA : coût total (temps content + LinkedIn) / nombre de leads
- Taux de conversion landing page (visiteurs → leads)
- Répartition par secteur (pie chart)
- Répartition par taille (bar chart)

### 10.2 Métriques d'engagement

- Taux d'ouverture email bienvenue (%)
- Taux de clic email J+3 (%)
- Pages les plus visitées par les leads
- Score moyen par segment
- Évolution du score moyen dans le temps

### 10.3 Métriques de conversion

- Leads → Diagnostic complété (%)
- Leads → Contact initié (%)
- Leads → Client signé (%) — status manuel
- Revenu par lead
- Délai moyen lead → conversion (jours)

### 10.4 Implémentation

Page protégée dans le dashboard admin existant (admin.aissabelkoussa.fr) ou page `/admin/leads` avec authentification simple (env var `ADMIN_SECRET`).

## 11. Notifications Telegram

Bot Telegram existant (`scripts/`) réutilisé. Notifications envoyées quand :
- Un lead passe CHAUD (score > 50) : message avec nom, email, secteur, score
- Un lead passe BRÛLANT (score > 75) : message urgent avec lien pour répondre

Format : `🔥 Lead BRÛLANT — [Prénom] ([Secteur]) — Score: [X]/100 — [email]`

## 12. Phases de livraison

**Phase 1 (prioritaire) :**
- Page /guide-ia + formulaire
- API /api/leads/capture + insert Supabase
- Email bienvenue Resend avec lien PDF
- Guide PDF statique
- Score initial
- Composant LeadMagnetGate amélioré

**Phase 2 :**
- Cron nurture (email J+3 sectoriel)
- Webhook Resend (opened/clicked)
- Redirect tracker
- Score comportemental
- Notifications Telegram

**Phase 3 :**
- Dashboard métriques
- Tracking comportemental enrichi (TrackingBeacon)
- Email conditionnel (3ème email si clic)
- Export CSV des leads

## 13. Contraintes

- Pas de dépendance nouvelle (Supabase, Resend, Telegram déjà dans la stack)
- Accents français corrects partout
- Tous les textes via LanguageContext (FR + EN)
- Rate limiting sur tous les endpoints publics
- RGPD : lien de désinscription dans chaque email, suppression sur demande
- Pas de mock data — données réelles uniquement
