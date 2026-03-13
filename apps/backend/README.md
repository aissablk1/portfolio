# Backend Portfolio - AÏSSA BELKOUSSA

Backend FastAPI pour le portfolio avec système de formulaire de contact avancé, notifications en temps réel et sauvegarde des leads.

## 🚀 Fonctionnalités

- **📬 Formulaire de contact sécurisé** avec validation et protection anti-spam
- **📧 Notifications email** automatiques (notification + auto-réponse)
- **🔔 Notifications temps réel** via Telegram Bot et WhatsApp
- **📁 Sauvegarde des leads** dans Notion et Google Sheets
- **🛡️ Protection anti-spam** avec rate limiting et détection intelligente
- **📊 Statistiques** des soumissions de contact

## 📋 Prérequis

- Python 3.8+
- MongoDB (local ou cloud)
- Compte Gmail (pour les emails)
- Bot Telegram (optionnel)
- Compte Notion (optionnel)
- Google Sheets (optionnel)

## 🛠️ Installation

1. **Cloner le projet**
```bash
cd backend
```

2. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

3. **Configurer l'environnement**
```bash
cp env.example .env
# Éditer .env avec vos configurations
```

4. **Démarrer MongoDB**
```bash
# Local
mongod

# Ou utiliser MongoDB Atlas (cloud)
```

5. **Lancer le serveur**
```bash
python start.py
# ou
python server.py
```

## ⚙️ Configuration

### Variables d'environnement (.env)

#### 🔐 Base de données
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db
```

#### 📧 Email (Gmail SMTP)
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RECIPIENT_EMAIL=your-email@gmail.com
```

> **Note :** Pour Gmail, utilisez un "mot de passe d'application" et non votre mot de passe principal.

#### 🔔 Telegram Bot (notifications)
```env
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

**Créer un bot Telegram :**
1. Parler à @BotFather sur Telegram
2. `/newbot` → choisir nom et username
3. Copier le token
4. Ajouter le bot à votre chat et récupérer le chat_id

#### 💬 WhatsApp (optionnel)
```env
WHATSAPP_API_TOKEN=your-api-token
WHATSAPP_PHONE_ID=your-phone-id
WHATSAPP_WEBHOOK_URL=your-webhook-url
```

#### 📁 Notion (sauvegarde des leads)
```env
NOTION_TOKEN=your-integration-token
NOTION_DATABASE_ID=your-database-id
```

**Configurer Notion :**
1. Créer une intégration sur https://www.notion.so/my-integrations
2. Créer une base de données avec les colonnes : Nom, Email, Sujet, Message, Date, Statut, IP
3. Partager la base avec votre intégration

#### 📊 Google Sheets (sauvegarde des leads)
```env
GOOGLE_SHEETS_WEBHOOK_URL=your-webhook-url
```

## 🚀 API Endpoints

### POST `/api/contact`
Soumission du formulaire de contact

**Body :**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Projet web",
  "message": "Bonjour, j'aimerais discuter d'un projet..."
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Votre message a été envoyé avec succès !",
  "submission_id": "uuid"
}
```

### GET `/api/health`
Vérification de l'état du service

### GET `/api/contact/stats`
Statistiques des soumissions (admin)

## 🔧 Services

### EmailService
- Envoi de notifications pour nouveaux contacts
- Auto-réponse personnalisée aux visiteurs
- Templates HTML professionnels

### NotificationService
- Notifications Telegram en temps réel
- Notifications WhatsApp (Business API ou webhook)
- Messages formatés avec actions rapides

### StorageService
- Sauvegarde automatique dans Notion
- Export vers Google Sheets
- Gestion des erreurs et retry

### SpamProtection
- Rate limiting par IP (3 soumissions/heure)
- Détection de mots-clés spam
- Analyse de patterns suspects
- Validation des emails temporaires

## 🛡️ Sécurité

- **Rate limiting** : 3 soumissions par heure par IP
- **Validation des données** : Pydantic avec règles strictes
- **Protection anti-spam** : Score de spam intelligent
- **CORS configuré** : Origines autorisées
- **Logging sécurisé** : Pas de données sensibles dans les logs

## 📊 Monitoring

### Logs
Les logs sont automatiquement générés pour :
- Soumissions de formulaire
- Erreurs de traitement
- Tentatives de spam
- État des services

### Métriques
- Nombre total de soumissions
- Taux de succès
- Soumissions en attente
- Soumissions marquées comme spam

## 🚨 Dépannage

### Erreur MongoDB
```bash
# Vérifier que MongoDB est démarré
mongod --version
# Redémarrer MongoDB
sudo systemctl restart mongod
```

### Erreur Email
```bash
# Vérifier les credentials Gmail
# Utiliser un mot de passe d'application
# Activer l'authentification à 2 facteurs
```

### Erreur Telegram
```bash
# Vérifier le token du bot
# S'assurer que le bot est ajouté au chat
# Récupérer le bon chat_id
```

## 🔄 Déploiement

### Local
```bash
python start.py
```

### Production (avec Gunicorn)
```bash
pip install gunicorn
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "start.py"]
```

## 📝 Notes

- Le système fonctionne même sans toutes les configurations (graceful degradation)
- Les notifications WhatsApp nécessitent une configuration Business API ou webhook
- Notion et Google Sheets sont optionnels pour la sauvegarde
- Le rate limiting protège contre les abus
- Tous les services sont asynchrones pour de meilleures performances

## 🤝 Support

Pour toute question ou problème :
- 📧 Email : via le formulaire de contact
- 💬 WhatsApp : +33 7 82 72 14 06
- 📱 Telegram : @investwithaissa 