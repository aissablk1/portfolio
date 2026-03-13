#!/usr/bin/env python3
"""
Script de démarrage pour le backend du portfolio
Gère la vérification des dépendances et le démarrage du serveur
"""

import os
import sys
import subprocess
import logging
from pathlib import Path
from dotenv import load_dotenv

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_dependencies():
    """Vérifie que toutes les dépendances sont installées"""
    try:
        import fastapi
        import uvicorn
        import motor
        import pydantic
        import requests
        logger.info("✅ Toutes les dépendances Python sont installées")
        return True
    except ImportError as e:
        logger.error(f"❌ Dépendance manquante: {e}")
        logger.info("Installez les dépendances avec: pip install -r requirements.txt")
        return False

def check_env_file():
    """Vérifie la présence du fichier .env à la racine ou en local"""
    backend_dir = Path(__file__).parent
    project_root = backend_dir.parent
    root_env = project_root / '.env'
    local_env = backend_dir / '.env'
    if root_env.exists() or local_env.exists():
        return True
    logger.warning("⚠️  Fichier .env non trouvé (ni à la racine ni dans backend)")
    logger.info("Créez Portfolio/.env avec vos variables d'environnement")
    return False

def check_mongodb():
    """Vérifie la connexion MongoDB"""
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        from dotenv import load_dotenv
        
        # Charger d'abord le .env racine puis fallback local
        backend_dir = Path(__file__).parent
        project_root = backend_dir.parent
        load_dotenv(project_root / '.env')
        load_dotenv(backend_dir / '.env')
        mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
        
        # Test de connexion simple
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        logger.info("✅ Connexion MongoDB réussie")
        client.close()
        return True
    except Exception as e:
        logger.error(f"❌ Erreur de connexion MongoDB: {e}")
        logger.info("Assurez-vous que MongoDB est démarré et accessible")
        return False

def start_server():
    """Démarre le serveur FastAPI"""
    try:
        import uvicorn
        from server import app
        
        host = os.getenv('HOST', '0.0.0.0')
        port = int(os.getenv('PORT', '8001'))
        debug = os.getenv('DEBUG', 'False').lower() == 'true'
        
        logger.info(f"🚀 Démarrage du serveur sur {host}:{port}")
        logger.info(f"📊 Mode debug: {debug}")
        
        uvicorn.run(
            "server:app",
            host=host,
            port=port,
            reload=debug,
            log_level="info"
        )
        
    except Exception as e:
        logger.error(f"❌ Erreur lors du démarrage du serveur: {e}")
        return False

def main():
    """Fonction principale"""
    logger.info("🔧 Vérification du backend du portfolio...")
    
    # Vérifications préalables
    if not check_dependencies():
        sys.exit(1)
    
    if not check_env_file():
        logger.warning("Continuing without .env file...")
    
    if not check_mongodb():
        logger.warning("Continuing without MongoDB connection...")
    
    # Démarrage du serveur
    logger.info("🎯 Démarrage du serveur...")
    start_server()

if __name__ == "__main__":
    main() 