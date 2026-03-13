#!/usr/bin/env python3
"""
Script de test pour l'API du portfolio
"""

import requests
import json
import time

BASE_URL = "http://localhost:8001/api"

def test_health():
    """Test du endpoint health"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Services: {data.get('services', {})}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_contact_form():
    """Test du formulaire de contact"""
    test_data = {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test de l'API",
        "message": "Ceci est un test du formulaire de contact."
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/contact",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"✅ Contact form: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Message: {data.get('message', '')}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Contact form failed: {e}")
        return False

def test_stats():
    """Test des statistiques"""
    try:
        response = requests.get(f"{BASE_URL}/contact/stats")
        print(f"✅ Stats: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Total submissions: {data.get('total', 0)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Stats failed: {e}")
        return False

def main():
    """Tests principaux"""
    print("🧪 Test de l'API Portfolio")
    print("=" * 40)
    
    # Attendre que le serveur démarre
    print("⏳ Attente du démarrage du serveur...")
    time.sleep(2)
    
    # Tests
    health_ok = test_health()
    contact_ok = test_contact_form()
    stats_ok = test_stats()
    
    print("\n" + "=" * 40)
    if all([health_ok, contact_ok, stats_ok]):
        print("🎉 Tous les tests sont passés !")
    else:
        print("⚠️  Certains tests ont échoué")
    
    print("\n📝 Pour tester manuellement:")
    print(f"   Health: curl {BASE_URL}/health")
    print(f"   Contact: curl -X POST {BASE_URL}/contact -H 'Content-Type: application/json' -d '{{\"name\":\"Test\",\"email\":\"test@test.com\",\"subject\":\"Test\",\"message\":\"Test\"}}'")

if __name__ == "__main__":
    main() 