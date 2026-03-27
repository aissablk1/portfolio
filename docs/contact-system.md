# Systeme de contact

## Vue d'ensemble

Formulaire multi-etapes connecte a Resend pour l'envoi d'emails transactionnels bilingues (FR/EN). Envoie deux emails en parallele : notification admin + confirmation prospect.

---

## Composants

### ContactForm.tsx
`src/components/ContactForm.tsx`

Formulaire en 3 etapes avec animations Framer Motion.

**Etape 0 — Identite**
- Nom complet (requis, min 3 caracteres)
- Email (requis, validation regex)
- Entreprise / Projet (optionnel)
- Champ honeypot invisible (anti-spam)

**Etape 1 — Besoin**
- 6 options selectionnables en grid : Design, Apps, Chatbots IA, IA Telephonique, Workflows, Systeme Complet
- Selection unique avec animation layoutId

**Etape 2 — Details**
- Toggle template pre-rempli / message personnalise
- Textarea message (requis, min 5 caracteres)
- Selection budget : < 10k, 10k-30k, 30k-100k, 100k+

**Etats**
- `isSubmitting` : desactive le bouton, affiche "Envoi..." / "Sending..."
- `isSubmitted` : affiche ecran de confirmation avec checkmark
- `submitError` : message d'erreur bilingue avec fallback LinkedIn

**Payload envoye**
```json
{
  "name": "string",
  "email": "string",
  "context": "string",
  "need": "string",
  "message": "string",
  "budget": "string",
  "lang": "fr | en",
  "_honey": "string (vide si humain)"
}
```

---

### API Route — /api/contact
`src/app/api/contact/route.ts`

**Methode :** POST uniquement

**Securite :**
1. Rate limiting in-memory : 3 requetes max par IP / 15 min → 429
2. Honeypot : si `_honey` non vide → renvoie `{ success: true }` sans envoyer (leurre bot)
3. Validation stricte : tous les champs verifies (types, longueurs, regex email, langue)
4. Escaping HTML (XSS) sur toutes les donnees avant injection dans le template

**Flux :**
1. Verifier cle API Resend
2. Extraire IP (x-forwarded-for ou x-real-ip)
3. Verifier rate limit
4. Parser JSON
5. Verifier honeypot
6. Valider payload
7. Envoyer 2 emails en parallele (Promise.all)
8. Retourner succes ou erreur

**Email 1 — Notification admin** (theme dark #0a0a0a)
- Destinataire : contact@aissabelkoussa.fr
- Reply-to : email du prospect
- Contenu : tableau 2 colonnes (nom, email cliquable, entreprise, langue badge, besoin badge, budget, message)
- Bouton "Repondre maintenant" (mailto pre-rempli avec sujet)
- Timestamp formate (Europe/Paris)

**Email 2 — Confirmation prospect** (theme light #fafafa)
- Destinataire : email du prospect
- Contenu : salutation personnalisee (prenom), texte de confirmation, recap demande (besoin, budget, entreprise), promesse 48h, signature avec liens

**Labels bilingues :**
Objet `labels` avec toutes les traductions FR/EN pour les deux templates.

---

## Configuration

### Variables d'environnement
```
RESEND_API_KEY=re_XXXXXXXXX  (.env.local, gitignore)
```

### DNS requis (OVHcloud)
- TXT `resend._domainkey` → cle DKIM Resend
- SPF : `v=spf1 include:icloud.com include:amazonses.com ~all`

### Resend
- Domaine : aissabelkoussa.fr (verifie)
- From : `Aissa Belkoussa <contact@aissabelkoussa.fr>`
- Free tier : 100 emails/jour, 3000/mois
