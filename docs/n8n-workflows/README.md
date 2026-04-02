# Workflows n8n — Automatisation business

## Vue d'ensemble

```
LEAD ARRIVE (formulaire / diagnostic / WhatsApp)
        │
        ▼
  ┌─────────────┐
  │  WEBHOOK     │ ← Resend webhook ou API contact
  │  n8n         │
  └──────┬──────┘
         │
    ┌────┴────┐
    ▼         ▼
  CHAUD     TIEDE/FROID
    │         │
    ▼         ▼
  Notif     Email auto
  WhatsApp  séquence
  immédiate nurturing
    │
    ▼
  Notion/Airtable
  Pipeline CRM
```

## Workflows à créer

### 1. `lead-intake.json` — Réception et scoring
- **Trigger** : Webhook (POST depuis l'API contact Next.js)
- **Actions** :
  1. Parser le payload (name, email, need, plan, score)
  2. Créer une entrée dans Notion/Airtable (pipeline)
  3. Si score CHAUD → notification WhatsApp immédiate sur ton téléphone
  4. Si score TIEDE → email de nurturing J+1
  5. Si score FROID → email de nurturing J+3

### 2. `sequence-nurturing.json` — Séquence email automatique
- **Trigger** : Cron (vérifie chaque jour les leads en attente)
- **Actions** :
  - J+1 : Email "Votre diagnostic" (si venu du /diagnostic)
  - J+3 : Email "3 questions pour cadrer votre projet"
  - J+7 : Email "Étude de cas : comment un plombier a gagné 10h/semaine"
  - J+14 : Email "Dernière chance — créneau disponible ce mois"

### 3. `maintenance-transition.json` — Transition mois 3
- **Trigger** : Cron (vérifie les clients dont la période de lancement se termine dans 15 jours)
- **Actions** :
  1. Envoyer le template `03-transition-mois-3.html` avec les vraies métriques
  2. Planifier un appel de 15 min (notification interne)
  3. Si pas de réponse en 7 jours → relance WhatsApp

### 4. `monthly-report.json` — Rapport mensuel automatique
- **Trigger** : Cron (1er de chaque mois)
- **Actions** :
  1. Fetcher les métriques (uptime, vitesse, bugs) depuis Vercel/UptimeRobot
  2. Générer le template `02-rapport-mois-1.html` avec les vraies données
  3. Envoyer à chaque client actif

### 5. `whatsapp-notif.json` — Notification lead chaud
- **Trigger** : Appelé par `lead-intake` quand score >= 55
- **Actions** :
  1. Envoyer un message WhatsApp à ton numéro : "🔥 LEAD CHAUD — {name} ({plan}) — {need}. Rappeler dans 2h."
  2. Créer un rappel dans ton calendrier

## Stack technique recommandée
- **n8n** : self-hosted ou cloud (n8n.io)
- **Resend** : emails transactionnels (déjà configuré)
- **Notion/Airtable** : CRM pipeline
- **UptimeRobot** : monitoring uptime (gratuit)
- **WhatsApp Business API** : ou Twilio pour les notifs auto

## Variables d'environnement n8n
```
RESEND_API_KEY=re_xxx
NOTION_API_KEY=ntn_xxx
WHATSAPP_PHONE=33782721406
SITE_URL=https://www.aissabelkoussa.fr
BACKEND_URL=https://portfolio-api-72tq.onrender.com
```
