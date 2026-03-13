# Portfolio - AÏSSA BELKOUSSA

Un portfolio moderne et responsive avec système de contact avancé, développé avec React, FastAPI et MongoDB.

## 🚀 Fonctionnalités

### Frontend (React + Tailwind CSS)
- **🎨 Design moderne** avec thème sombre/clair
- **📱 Responsive** sur tous les appareils
- **⚡ Performance optimisée** avec lazy loading
- **🔧 Composants réutilisables** avec shadcn/ui

### Backend (FastAPI + MongoDB)
- **📬 Formulaire de contact sécurisé** avec validation
- **📧 Notifications email** automatiques (notification + auto-réponse)
- **🔔 Notifications temps réel** via Telegram Bot et WhatsApp
- **📁 Sauvegarde des leads** dans Notion et Google Sheets
- **🛡️ Protection anti-spam** avec rate limiting et détection intelligente
- **📊 Statistiques** des soumissions de contact

## 🛠️ Technologies

### Frontend
- React 18
- Tailwind CSS
- shadcn/ui
- Lucide React (icônes)
- React Router

### Backend
- FastAPI
- MongoDB (Motor)
- Pydantic (validation)
- Python-dotenv
- Requests

### Services Intégrés
- Gmail SMTP
- Telegram Bot API
- WhatsApp Business API
- Notion API
- Google Sheets API

## 📋 Prérequis

- Node.js 16+
- Python 3.8+
- MongoDB (local ou cloud)
- Compte Gmail (pour les emails)
- Bot Telegram (optionnel)
- Compte Notion (optionnel)

## 🚀 Installation Rapide

1. **Cloner le projet**
```bash
git clone <repository-url>
cd portfolio
```

2. **Lancer l'application**
```bash
chmod +x run.sh
./run.sh
```

L'application sera disponible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:8001
- Documentation API : http://localhost:8001/docs

## ⚙️ Configuration Détaillée

### 1. Configuration Backend

```bash
cd backend
cp env.example .env
# Éditer .env avec vos configurations
```

**Variables obligatoires :**
```env
# MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RECIPIENT_EMAIL=your-email@gmail.com
```

**Variables optionnelles :**
```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# Notion
NOTION_TOKEN=your-integration-token
NOTION_DATABASE_ID=your-database-id

# Google Sheets
GOOGLE_SHEETS_WEBHOOK_URL=your-webhook-url
```

### 2. Configuration Frontend

```bash
cd frontend
cp env.example .env
```

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 🔧 Développement

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou .venv\Scripts\activate  # Windows
pip install -r requirements.txt
python start.py
```

### Frontend
```bash
cd frontend
yarn install
yarn start
```

### Tests
```bash
# Test API
cd backend
python test_api.py

# Test frontend
cd frontend
yarn test
```

## 📊 API Endpoints

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

### GET `/api/health`
Vérification de l'état du service

### GET `/api/contact/stats`
Statistiques des soumissions (admin)

## 🛡️ Sécurité

- **Rate limiting** : 3 soumissions par heure par IP
- **Validation des données** : Pydantic avec règles strictes
- **Protection anti-spam** : Score de spam intelligent
- **CORS configuré** : Origines autorisées
- **Logging sécurisé** : Pas de données sensibles dans les logs

## 📱 Contact

- **💬 WhatsApp** : +33 7 82 72 14 06
- **📱 Telegram** : @investwithaissa
- **📧 Email** : Via le formulaire de contact
- **🔗 LinkedIn** : linkedin.com/in/aissabelkoussa
- **🐙 GitHub** : github.com/aissablk1

## 📝 Notes

- Le système fonctionne même sans toutes les configurations (graceful degradation)
- Les notifications WhatsApp nécessitent une configuration Business API ou webhook
- Notion et Google Sheets sont optionnels pour la sauvegarde
- Le rate limiting protège contre les abus
- Tous les services sont asynchrones pour de meilleures performances

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
