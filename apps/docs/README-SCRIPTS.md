# 🚀 Scripts de lancement - Portfolio AÏSSA BELKOUSSA

Ce dossier contient des scripts pour faciliter le lancement et la gestion de votre portfolio.

## 📁 Fichiers disponibles

### `run.sh` - Script principal de lancement
Lance automatiquement le frontend React et le backend FastAPI avec toutes les vérifications nécessaires.

### `mongodb.sh` - Gestionnaire MongoDB
Script dédié à la gestion de MongoDB (installation, démarrage, arrêt, statut).

## 🎯 Utilisation rapide

### 1. Premier lancement
```bash
./run.sh
```

Le script va :
- ✅ Vérifier les prérequis (Python, Node.js, Yarn)
- 📦 Installer les dépendances si nécessaire
- 🔧 Créer un fichier `.env` d'exemple
- 🗄️ Tenter de démarrer MongoDB automatiquement
- 🚀 Lancer le backend et le frontend

### 2. Gestion de MongoDB

#### Vérifier le statut
```bash
./mongodb.sh status
```

#### Installer MongoDB (macOS avec Homebrew)
```bash
./mongodb.sh install
```

#### Démarrer MongoDB
```bash
./mongodb.sh start
```

#### Arrêter MongoDB
```bash
./mongodb.sh stop
```

#### Redémarrer MongoDB
```bash
./mongodb.sh restart
```

## 🔧 Configuration requise

### Prérequis système
- **Python 3.8+** : Pour le backend FastAPI
- **Node.js 16+** : Pour le frontend React
- **pnpm** : Gestionnaire de paquets (installé automatiquement si nécessaire)

### Base de données
- **MongoDB** : Base de données principale
  - Installation : `./mongodb.sh install`
  - Démarrage : `./mongodb.sh start`

### Variables d'environnement
Le fichier `backend/.env` doit contenir :

```env
# Configuration du serveur
HOST=0.0.0.0
PORT=8001
DEBUG=true

# Configuration MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio

# Configuration Email (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SMTP_SERVER=smtp.gmail.com
EMAIL_SMTP_PORT=587

# Services optionnels
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-chat-id
NOTION_TOKEN=your-notion-token
NOTION_DATABASE_ID=your-database-id
GOOGLE_SHEETS_WEBHOOK_URL=your-webhook-url
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket-name
```

## 🌐 URLs d'accès

Une fois lancé, votre application sera accessible sur :

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8001
- **Documentation API** : http://localhost:8001/docs
- **Health Check** : http://localhost:8001/api/health

## 🛠️ Dépannage

### Problème de MongoDB
```bash
# Vérifier le statut
./mongodb.sh status

# Démarrer MongoDB
./mongodb.sh start

# Ou installer si nécessaire
./mongodb.sh install
```

### Problème de dépendances
```bash
# Réinstaller les dépendances Python
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Réinstaller les dépendances Node.js
cd frontend
pnpm install
```

### Problème de ports
Si les ports 3000 ou 8001 sont occupés :
1. Modifiez le fichier `backend/.env`
2. Changez `PORT=8001` vers un autre port
3. Relancez avec `./run.sh`

## 📝 Commandes utiles

### Arrêter l'application
```bash
# Dans le terminal où run.sh est lancé
Ctrl+C
```

### Voir les logs du backend
```bash
cd backend
source .venv/bin/activate
python3 start.py
```

### Voir les logs du frontend
```bash
cd frontend
pnpm start
```

## 🔒 Sécurité

- ⚠️ Ne commitez jamais le fichier `.env` dans Git
- 🔑 Utilisez des mots de passe d'application pour Gmail
- 🌐 Configurez correctement les variables d'environnement avant la production

## 📞 Support

En cas de problème :
1. Vérifiez les logs dans le terminal
2. Consultez la documentation API : http://localhost:8001/docs
3. Vérifiez le statut MongoDB : `./mongodb.sh status`
4. Relancez l'application : `./run.sh` 