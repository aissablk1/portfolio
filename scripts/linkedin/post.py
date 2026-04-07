"""
LinkedIn Post Publisher
Publie les posts pre-rediges sur LinkedIn via l'API officielle.

Usage:
    python post.py                    # Menu interactif
    python post.py --post 1           # Publier le post #1 directement
    python post.py --list             # Voir tous les posts disponibles
    python post.py --preview 1        # Apercu du post #1 sans publier
"""

import os
import sys
import json
import argparse
from datetime import datetime

import requests
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN = os.getenv("LINKEDIN_ACCESS_TOKEN")
PERSON_URN = os.getenv("LINKEDIN_PERSON_URN")

# ============================================================
# POSTS PRE-REDIGES
# Source : docs/linkedin/linkedin-premier-post.md
# ============================================================

POSTS = [
    {
        "id": 1,
        "title": "DK Building — Cas réel BTP Albi (V4)",
        "date_prevue": "5 avril 2026",
        "hashtags": "#BTP #artisans #Tarn #Albi #TPE",
        "content": """Une PME de construction métallique à Albi n'avait pas de site.
Zéro présence en ligne. Les clients venaient uniquement par le bouche-à-oreille.

Le problème : quand le bouche-à-oreille ralentit, le carnet de commandes se vide.

En 10 jours, j'ai construit un site complet pour eux :
→ Un site pro qui montre leurs réalisations
→ Un panneau pour qu'ils gèrent tout seuls, sans me rappeler
→ Une visibilité sur Google pour que les prospects les trouvent

Résultat : le site est en ligne. Trois demandes de contact la première semaine.
Et leur site travaille pour eux — même le dimanche.

C'est mon 93ème projet livré en 4 ans.

Si vous êtes artisan — maçon, électricien, plombier, charpentier — et que votre site ne vous rapporte rien (ou que vous n'en avez pas) :

Livré en 10 jours. Prix fixe. Zéro surprise.

Tapez le nom de votre entreprise sur Google. Vous apparaissez ? Dites-moi en commentaire.

#BTP #artisans #Tarn #Albi #TPE""",
        "comment_link": "Le site en question : dkbuilding.fr — Envoyez-moi un message si vous voulez le même pour votre entreprise.",
    },
    {
        "id": 2,
        "title": "Post verite / transparence",
        "date_prevue": "10 avril 2026",
        "hashtags": "#entrepreneuriat #freelance #transparence #IA #automatisation",
        "content": """J'ai 96 projets dans mes dossiers.
Et zéro client payant au nouveau tarif.

Je pourrais vous raconter une belle histoire.
Mais je préfère vous dire la vérité.

Pendant des mois, j'ai construit :
→ Des systèmes d'automatisation complets
→ Des chatbots IA de qualification
→ Des dashboards décisionnels temps réel
→ Un portfolio technique à 10/10

Et j'ai oublié l'essentiel : vendre.

Le piège du builder, c'est de croire que si le produit est bon, les clients viendront.
Ils ne viennent pas. Il faut aller les chercher.

Alors cette semaine, j'ai changé d'approche :
→ 6 messages envoyés à des artisans du Tarn
→ Un diagnostic gratuit pour chaque prospect
→ Une offre à 1 500€, livrée en 5 jours

Pas de marketing compliqué. Juste des conversations.

Si vous êtes freelance ou solopreneur et que vous construisez plus que vous ne vendez — ce post est pour vous.

La perfection technique ne paie pas les factures. Les conversations, oui.

#entrepreneuriat #freelance #transparence #IA #automatisation""",
        "comment_link": "https://aissabelkoussa.fr/diagnostic",
    },
    {
        "id": 5,
        "title": "Article blog — 3 signaux site web couteux",
        "date_prevue": "7 avril 2026",
        "hashtags": "#siteweb #PME #artisans #digital #TPE",
        "content": """Vous payez un hébergement.
Vous avez payé un prestataire.
Peut-être même un nom de domaine premium.

Et votre site ne génère ni appels, ni emails, ni demandes de devis.

J'ai écrit un article sur les 3 signaux concrets qui montrent que votre site vous coûte de l'argent au lieu d'en rapporter.

Signal 1 : Vous ne savez pas combien de visiteurs vous recevez.
→ Un site sans analytics, c'est un magasin sans compteur de passages.

Signal 2 : Votre dernier contact entrant via le site date de plus de 3 mois.
→ Un artisan qui facture 45€/h et perd 1 lead/semaine, c'est 36 000€/an de CA non capté.

Signal 3 : Votre formulaire envoie un email que personne ne lit.
→ Le prospect attend. Et il finit chez votre concurrent qui a répondu en 2h.

La bonne nouvelle : les 3 se corrigent en moins de 10 jours.

L'article complet est en commentaire 👇

Si vous cochez 2 sur 3, faites le diagnostic gratuit (2 min) sur mon site. Résultat immédiat.

#siteweb #PME #artisans #digital #TPE""",
        "comment_link": "L'article complet : https://www.aissabelkoussa.fr/blog/site-web-coute-argent-3-signaux\n\nDiagnostic gratuit (2 minutes, résultat immédiat) : https://www.aissabelkoussa.fr/diagnostic",
    },
    {
        "id": 3,
        "title": "Post educatif : 3 signaux site mort",
        "date_prevue": "14 avril 2026",
        "hashtags": "#siteweb #PME #digital #artisans #ROI",
        "content": """3 signaux que votre site web est une vitrine morte :

1. Vous ne savez pas combien de visiteurs il reçoit par mois.
Si vous ne mesurez pas, vous ne pouvez pas améliorer.
Un site sans analytics, c'est comme un magasin sans compteur de passages.

2. Votre dernier appel entrant via le site date de plus de 3 mois.
Un site qui ne génère pas de contact n'est pas un site.
C'est une carte de visite en ligne. Et même ça, c'est généreux.

3. Votre formulaire de contact envoie un email que personne ne lit.
Le prospect prend le temps d'écrire. Et il reçoit... rien.
Pas de confirmation. Pas de rappel. Pas de suivi.

Si vous cochez 2 sur 3 — votre site vous coûte de l'argent au lieu d'en rapporter.

La bonne nouvelle : ça se corrige en 5 à 10 jours.
→ Un formulaire intelligent qui qualifie automatiquement
→ Des notifications en temps réel quand un prospect chaud arrive
→ Un suivi automatique pour ne plus perdre de leads

Faites le diagnostic gratuit (2 minutes) et voyez ce que vous perdez chaque semaine.

#siteweb #PME #digital #artisans #ROI""",
        "comment_link": "https://aissabelkoussa.fr/diagnostic",
    },
    {
        "id": 4,
        "title": "SEO vs GEO — visibilite IA",
        "date_prevue": "6 avril 2026",
        "hashtags": "#SEO #GEO #IA #VisibiliteDigitale #MarketingDigital #Freelance",
        "content": """Le SEO ne suffit plus.
Si votre site ne parle pas aux IA, vous êtes déjà en retard.

J'ai vu passer le post de Laetitia Moreau cette semaine. Elle a demandé à ChatGPT quel consultant SEO contacter dans son secteur.
Son profil est ressorti en premier.

Ce n'est pas un coup de chance. Ça s'appelle le GEO — Generative Engine Optimization.

Aujourd'hui, vos clients ne cherchent plus seulement sur Google.
Ils ouvrent ChatGPT, Perplexity ou Gemini et demandent :
"Quel prestataire contacter pour [mon besoin] à [ma ville] ?"

Si vous n'apparaissez pas dans ces réponses, vous êtes invisible pour une part croissante de votre marché.

La différence entre le SEO et le GEO ?

Le SEO vous place dans une liste de 10 résultats.
Le GEO vous fait CITER nommément dans la réponse.

Ce que je construis pour mes clients pour y arriver :

→ Données structurées Schema.org (la fiche d'identité que les IA savent lire)
→ Pages d'expertise thématiques (1 page = 1 problème résolu = 1 réponse IA potentielle)
→ Alignement multicanal (site + LinkedIn + Google Business = même message partout)
→ Contenu d'autorité avec des vrais chiffres — pas du blabla marketing

Je ne conseille pas le GEO. Je le code.

J'ai écrit un guide complet : SEO vs GEO, ce que les IA regardent, et les 5 actions concrètes pour apparaître dans leurs réponses.
Lien en commentaire 👇

Question : avez-vous déjà demandé à ChatGPT quel professionnel de votre métier contacter dans votre ville ?
Faites le test. Le résultat pourrait vous surprendre.

—
Je construis des sites et systèmes digitaux visibles sur Google ET dans les réponses IA.
MP ou commentaire pour faire le point sur votre visibilité.

#SEO #GEO #IA #VisibiliteDigitale #MarketingDigital #Freelance""",
        "comment_link": "L'article complet est ici : https://www.aissabelkoussa.fr/blog/seo-vs-geo-visibilite-ia-2026\n\nAu programme :\n• La différence SEO vs GEO en un tableau\n• Ce que les IA regardent concrètement pour vous citer\n• 5 actions concrètes avec les coûts associés\n• FAQ (comment tester, en combien de temps ça marche)",
    },
]


def publish_post(post_content):
    """Publie un post texte sur LinkedIn via l'API Posts."""
    url = "https://api.linkedin.com/v2/ugcPosts"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
    }
    payload = {
        "author": PERSON_URN,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": post_content},
                "shareMediaCategory": "NONE",
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
    }

    response = requests.post(url, headers=headers, json=payload, timeout=30)

    if response.status_code == 201:
        post_id = response.headers.get("x-restli-id", "inconnu")
        return {"success": True, "post_id": post_id}
    else:
        return {
            "success": False,
            "status": response.status_code,
            "error": response.text,
        }


def add_comment(post_urn, comment_text):
    """Ajoute un commentaire sous un post (pour le lien)."""
    from urllib.parse import quote

    encoded_urn = quote(post_urn, safe="")
    url = f"https://api.linkedin.com/v2/socialActions/{encoded_urn}/comments"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
    }
    payload = {
        "actor": PERSON_URN,
        "message": {"text": comment_text},
    }

    response = requests.post(url, headers=headers, json=payload, timeout=30)
    if response.status_code not in (200, 201):
        print(f"  Debug comment: {response.status_code} — {response.text}")
    return response.status_code in (200, 201)


def list_posts():
    print("\n=== Posts disponibles ===\n")
    for p in POSTS:
        print(f"  [{p['id']}] {p['title']}")
        print(f"      Date prevue : {p['date_prevue']}")
        print(f"      Hashtags : {p['hashtags']}")
        print()


def preview_post(post_id):
    post = next((p for p in POSTS if p["id"] == post_id), None)
    if not post:
        print(f"Post #{post_id} introuvable.")
        return
    print(f"\n{'='*60}")
    print(f"APERCU — Post #{post['id']} : {post['title']}")
    print(f"Date prevue : {post['date_prevue']}")
    print(f"{'='*60}\n")
    print(post["content"])
    print(f"\n{'='*60}")
    print(f"Commentaire auto : {post['comment_link']}")
    print(f"{'='*60}\n")


def publish(post_id):
    if not ACCESS_TOKEN or not PERSON_URN:
        print("Erreur : Lance d'abord auth.py pour obtenir un token.")
        print("  python auth.py")
        sys.exit(1)

    post = next((p for p in POSTS if p["id"] == post_id), None)
    if not post:
        print(f"Post #{post_id} introuvable.")
        return

    preview_post(post_id)

    confirm = input("Publier ce post sur LinkedIn ? (oui/non) : ").strip().lower()
    if confirm not in ("oui", "o", "yes", "y"):
        print("Publication annulee.")
        return

    print("\nPublication en cours...")
    result = publish_post(post["content"])

    if result["success"]:
        post_urn = result["post_id"]
        print(f"Post publie avec succes !")
        print(f"Post ID : {post_urn}")

        # Ajouter le lien en commentaire
        if post.get("comment_link"):
            print(f"Ajout du lien en commentaire...")
            comment_ok = add_comment(
                post_urn,
                f"Le lien : {post['comment_link']}",
            )
            if comment_ok:
                print("Commentaire ajoute.")
            else:
                print("Echec ajout commentaire — ajoute-le manuellement.")

        # Logger la publication
        log_publication(post, post_urn)
        print("\nTermine.")
    else:
        print(f"Erreur {result['status']} : {result['error']}")
        if result["status"] == 401:
            print("Token expire. Relance : python auth.py")
        elif result["status"] == 403:
            print("Scope w_member_social manquant. Verifie les permissions de ton app LinkedIn.")


def log_publication(post, post_urn):
    """Log chaque publication dans un fichier JSON."""
    log_file = os.path.join(os.path.dirname(__file__), "publications.json")
    logs = []
    if os.path.exists(log_file):
        with open(log_file, "r") as f:
            logs = json.load(f)

    logs.append({
        "post_id": post["id"],
        "title": post["title"],
        "post_urn": post_urn,
        "published_at": datetime.now().isoformat(),
    })

    with open(log_file, "w") as f:
        json.dump(logs, f, indent=2, ensure_ascii=False)


def interactive_menu():
    if not ACCESS_TOKEN or not PERSON_URN:
        print("=== LinkedIn Post Publisher ===\n")
        print("Token non configure. Lance d'abord :")
        print("  python auth.py\n")
        sys.exit(1)

    print("=== LinkedIn Post Publisher ===\n")
    list_posts()

    choice = input("Quel post publier ? (1/2/3 ou 'q' pour quitter) : ").strip()
    if choice in ("q", "quit"):
        return
    try:
        post_id = int(choice)
        publish(post_id)
    except ValueError:
        print("Choix invalide.")


def main():
    parser = argparse.ArgumentParser(description="Publier des posts LinkedIn")
    parser.add_argument("--post", type=int, help="Publier le post #N directement")
    parser.add_argument("--list", action="store_true", help="Lister les posts")
    parser.add_argument("--preview", type=int, help="Apercu du post #N")
    args = parser.parse_args()

    if args.list:
        list_posts()
    elif args.preview:
        preview_post(args.preview)
    elif args.post:
        publish(args.post)
    else:
        interactive_menu()


if __name__ == "__main__":
    main()
