#!/bin/bash

# Script pour démarrer le backend et le frontend du portfolio
# Utilise pnpm pour le frontend et Python pour le backend

echo "🚀 Démarrage du portfolio..."

# Charger les variables depuis le .env à la racine si présent
if [ -f .env ]; then
  echo "📦 Chargement de l'environnement depuis ./.env"
  # Exporter uniquement les lignes de type KEY=VALUE (ignorer commentaires)
  set -a
  source <(grep -E '^[A-Za-z_][A-Za-z0-9_]*=' .env | sed 's/\r$//')
  set +a
fi

# Fonction pour nettoyer les processus en cas d'arrêt
cleanup() {
    echo "🛑 Arrêt des services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturer le signal d'interruption (Ctrl+C)
trap cleanup SIGINT SIGTERM

# Vérifier si pnpm est installé
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm n'est pas installé. Veuillez l'installer avec: npm install -g pnpm"
    exit 1
fi

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 n'est pas installé."
    exit 1
fi

# Définir les ports par défaut ou utiliser ceux des variables d'environnement
BACKEND_PORT=${BACKEND_PORT:-5000}
FRONTEND_PORT=${FRONTEND_PORT:-3000}

# Démarrer le backend
echo "🔧 Démarrage du backend sur le port $BACKEND_PORT..."
cd backend
python3 server.py &
BACKEND_PID=$!
cd ..

# Attendre un peu pour que le backend démarre
sleep 2

# Démarrer le frontend
MODE_DEV=true
if [ "$1" == "prod" ]; then
    MODE_DEV=false
fi

if $MODE_DEV; then
    echo "🎨 Démarrage du frontend en mode développement sur le port $FRONTEND_PORT..."
    cd frontend
    # Injecter REACT_APP_* de l'environnement actuel pour CRA
    pnpm start &
    FRONTEND_PID=$!
    cd ..
else
    echo "🏗️  Construction du frontend..."
    cd frontend
    pnpm run build
    npm install -g serve
    serve -s build -l $FRONTEND_PORT &
    FRONTEND_PID=$!
    cd ..
fi

echo "✅ Services démarrés!"
echo "📱 Frontend: http://localhost:$FRONTEND_PORT"
echo "🔧 Backend: http://localhost:$BACKEND_PORT"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter tous les services"

# Attendre que les processus se terminent
wait 