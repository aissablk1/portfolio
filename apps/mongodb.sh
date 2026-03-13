#!/bin/bash

# Script de gestion MongoDB pour le Portfolio d'AÏSSA BELKOUSSA

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}   Gestion MongoDB Portfolio    ${NC}"
    echo -e "${BLUE}================================${NC}"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

check_mongodb_status() {
    if curl -s mongodb://localhost:27017 > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

install_mongodb_homebrew() {
    print_message "Installation de MongoDB avec Homebrew..."
    brew tap mongodb/brew
    brew install mongodb-community
    print_message "MongoDB installé avec succès !"
}

start_mongodb_homebrew() {
    print_message "Démarrage de MongoDB avec Homebrew..."
    brew services start mongodb-community
    sleep 3
    if check_mongodb_status; then
        print_message "MongoDB démarré avec succès !"
        return 0
    else
        print_error "Échec du démarrage de MongoDB"
        return 1
    fi
}

start_mongodb_docker() {
    print_message "Démarrage de MongoDB avec Docker..."
    
    # Vérifier si le conteneur existe déjà
    if docker ps -a --format "table {{.Names}}" | grep -q "mongodb-portfolio"; then
        print_message "Conteneur MongoDB existant trouvé, redémarrage..."
        docker start mongodb-portfolio
    else
        print_message "Création d'un nouveau conteneur MongoDB..."
        docker run -d --name mongodb-portfolio -p 27017:27017 mongo:latest
    fi
    
    sleep 5
    if check_mongodb_status; then
        print_message "MongoDB démarré avec succès dans Docker !"
        return 0
    else
        print_error "Échec du démarrage de MongoDB dans Docker"
        return 1
    fi
}

stop_mongodb() {
    print_message "Arrêt de MongoDB..."
    
    # Essayer Homebrew
    if command_exists brew; then
        brew services stop mongodb-community 2>/dev/null || true
    fi
    
    # Essayer Docker
    if command_exists docker; then
        docker stop mongodb-portfolio 2>/dev/null || true
    fi
    
    print_message "MongoDB arrêté !"
}

show_status() {
    print_message "Statut de MongoDB :"
    
    if check_mongodb_status; then
        print_message "✅ MongoDB est démarré et accessible sur localhost:27017"
    else
        print_message "❌ MongoDB n'est pas accessible"
    fi
    
    # Vérifier les processus
    if pgrep -f mongod > /dev/null; then
        print_message "✅ Processus MongoDB détecté"
    fi
    
    # Vérifier Docker
    if command_exists docker; then
        if docker ps --format "table {{.Names}}" | grep -q "mongodb-portfolio"; then
            print_message "✅ Conteneur MongoDB Docker actif"
        fi
    fi
}

main() {
    print_header
    
    case "${1:-status}" in
        "install")
            if command_exists brew; then
                install_mongodb_homebrew
            else
                print_error "Homebrew n'est pas installé. Installez-le d'abord."
                exit 1
            fi
            ;;
        "start")
            if check_mongodb_status; then
                print_message "MongoDB est déjà démarré !"
                exit 0
            fi
            
            if command_exists brew; then
                start_mongodb_homebrew
            elif command_exists docker; then
                start_mongodb_docker
            else
                print_error "Aucune méthode de démarrage disponible. Installez Homebrew ou Docker."
                exit 1
            fi
            ;;
        "stop")
            stop_mongodb
            ;;
        "restart")
            stop_mongodb
            sleep 2
            if command_exists brew; then
                start_mongodb_homebrew
            elif command_exists docker; then
                start_mongodb_docker
            fi
            ;;
        "status")
            show_status
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [COMMANDE]"
            echo ""
            echo "Commandes disponibles :"
            echo "  install   - Installer MongoDB avec Homebrew"
            echo "  start     - Démarrer MongoDB"
            echo "  stop      - Arrêter MongoDB"
            echo "  restart   - Redémarrer MongoDB"
            echo "  status    - Afficher le statut de MongoDB (défaut)"
            echo "  help      - Afficher cette aide"
            echo ""
            echo "Méthodes de démarrage supportées :"
            echo "  - Homebrew (macOS)"
            echo "  - Docker"
            ;;
        *)
            print_error "Commande inconnue: $1"
            echo "Utilisez '$0 help' pour voir les commandes disponibles"
            exit 1
            ;;
    esac
}

main "$@" 