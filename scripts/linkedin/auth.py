"""
LinkedIn OAuth 2.0 — Authentification
Lance ce script une fois pour obtenir ton access token.
Le token est valide 60 jours.

Usage:
    python auth.py
"""

import os
import sys
import json
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

import requests
from dotenv import load_dotenv, set_key

load_dotenv()

CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:8888/callback")
SCOPES = "openid profile w_member_social"

ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")

if not CLIENT_ID or not CLIENT_SECRET:
    print("Erreur : LINKEDIN_CLIENT_ID et LINKEDIN_CLIENT_SECRET requis dans .env")
    print("1. Copie .env.example → .env")
    print("2. Remplis avec tes identifiants depuis https://www.linkedin.com/developers/apps")
    sys.exit(1)


class OAuthCallbackHandler(BaseHTTPRequestHandler):
    """Serveur local temporaire pour capturer le callback OAuth."""

    auth_code = None

    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)

        if "error" in query:
            self.send_response(400)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            error_msg = query.get("error_description", ["Erreur inconnue"])[0]
            self.wfile.write(f"<h1>Erreur LinkedIn</h1><p>{error_msg}</p>".encode())
            return

        if "code" in query:
            OAuthCallbackHandler.auth_code = query["code"][0]
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(
                "<h1>Connexion LinkedIn OK</h1>"
                "<p>Tu peux fermer cette page et retourner au terminal.</p>".encode()
            )

    def log_message(self, format, *args):
        pass  # Pas de logs HTTP dans le terminal


def get_authorization_url():
    return (
        "https://www.linkedin.com/oauth/v2/authorization"
        f"?response_type=code"
        f"&client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope={SCOPES.replace(' ', '%20')}"
        f"&state=linkedin_auth"
    )


def exchange_code_for_token(code):
    response = requests.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def get_profile(access_token):
    response = requests.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def main():
    print("=== LinkedIn OAuth 2.0 ===\n")

    # Ouvrir le navigateur pour l'autorisation
    auth_url = get_authorization_url()
    print("Ouverture du navigateur pour l'autorisation LinkedIn...")
    print(f"Si le navigateur ne s'ouvre pas, va ici :\n{auth_url}\n")
    webbrowser.open(auth_url)

    # Lancer le serveur local pour capturer le callback
    port = int(REDIRECT_URI.split(":")[-1].split("/")[0])
    server = HTTPServer(("localhost", port), OAuthCallbackHandler)
    print(f"En attente du callback sur localhost:{port}...")

    while OAuthCallbackHandler.auth_code is None:
        server.handle_request()

    server.server_close()
    code = OAuthCallbackHandler.auth_code
    print(f"\nCode d'autorisation recu.")

    # Echanger le code contre un token
    print("Echange du code contre un access token...")
    token_data = exchange_code_for_token(code)
    access_token = token_data["access_token"]
    expires_in = token_data.get("expires_in", 5184000)  # 60 jours par defaut

    # Recuperer le profil pour obtenir le person URN
    print("Recuperation du profil LinkedIn...")
    profile = get_profile(access_token)
    person_urn = f"urn:li:person:{profile['sub']}"
    name = profile.get("name", "Inconnu")

    # Sauvegarder dans .env
    set_key(ENV_PATH, "LINKEDIN_ACCESS_TOKEN", access_token)
    set_key(ENV_PATH, "LINKEDIN_PERSON_URN", person_urn)

    print(f"\nConnecte en tant que : {name}")
    print(f"Person URN : {person_urn}")
    print(f"Token expire dans : {expires_in // 86400} jours")
    print(f"\nToken sauvegarde dans {ENV_PATH}")
    print("Tu peux maintenant utiliser post.py pour publier.")


if __name__ == "__main__":
    main()
