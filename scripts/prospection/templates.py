"""
Templates de relance CDS — J+3 / J+7 / J+14
Chaque fonction prend un dict prospect et retourne un message personnalise.
"""

BASE_URL = "https://www.aissabelkoussa.fr/blog/"

NICHE_ARTICLES = {
    "BTP": {
        "slug": "artisan-btp-fiche-google-maps-2026",
        "sujet": "apparaitre sur Google Maps quand on est artisan",
        "douleur": "la visibilite en ligne",
    },
    "Immobilier": {
        "slug": "agent-immobilier-chatbot-visite-ia",
        "sujet": "qualifier les visites avec un chatbot IA",
        "douleur": "les visites non qualifiees",
    },
    "Restaurant": {
        "slug": "restaurant-reservations-automatiques-ia",
        "sujet": "automatiser les reservations",
        "douleur": "le temps passe au telephone",
    },
    "Comptable": {
        "slug": "comptable-automatiser-relances-impayees",
        "sujet": "automatiser les relances d'impayes",
        "douleur": "les relances manuelles",
    },
    "Commerce": {
        "slug": "commerce-proximite-site-ecommerce-local",
        "sujet": "creer un site e-commerce local",
        "douleur": "la vente en ligne",
    },
}

DEFAULT_ARTICLE = {
    "slug": "roi-intelligence-artificielle-tpe-2026",
    "sujet": "le ROI de l'IA pour une TPE",
    "douleur": "la productivite",
}


def _get_article(niche: str) -> dict:
    return NICHE_ARTICLES.get(niche, DEFAULT_ARTICLE)


def relance_j3(prospect: dict) -> str:
    """Relance J+3 — Partage d'article cible par niche."""
    art = _get_article(prospect.get("niche", ""))
    prenom = prospect.get("nom", "").split()[0] if prospect.get("nom") else ""
    entreprise = prospect.get("entreprise", "")
    url = BASE_URL + art["slug"]

    return (
        f"Bonjour{' ' + prenom if prenom else ''},\n"
        f"\n"
        f"Suite a mon message, je me suis dit que cet article pourrait "
        f"vous interesser — il parle de {art['sujet']} :\n"
        f"\n"
        f"{url}\n"
        f"\n"
        f"C'est un sujet que je vois souvent chez les entreprises comme "
        f"{entreprise} : {art['douleur']} reste un vrai frein a la croissance.\n"
        f"\n"
        f"Si ca vous parle, je serais ravi d'en discuter 15 min.\n"
        f"\n"
        f"Bonne journee,\n"
        f"Aissa"
    )


def relance_j7(prospect: dict) -> str:
    """Relance J+7 — Preuve sociale / cas client."""
    art = _get_article(prospect.get("niche", ""))
    prenom = prospect.get("nom", "").split()[0] if prospect.get("nom") else ""
    entreprise = prospect.get("entreprise", "")
    ville = prospect.get("ville", "")

    lieu = f" a {ville}" if ville else ""

    return (
        f"Bonjour{' ' + prenom if prenom else ''},\n"
        f"\n"
        f"Je reviens vers vous avec un exemple concret. "
        f"J'ai accompagne une entreprise{lieu} sur {art['douleur']} "
        f"— en 3 semaines, ils ont vu une difference nette sur leur "
        f"visibilite et leurs demandes entrantes.\n"
        f"\n"
        f"Le contexte etait similaire a {entreprise} : pas de site "
        f"web performant, zero presence en ligne automatisee.\n"
        f"\n"
        f"Je ne veux pas etre insistant — juste vous montrer que "
        f"des solutions rapides existent. Un appel de 15 min suffit "
        f"pour voir si ca s'applique a votre cas.\n"
        f"\n"
        f"Qu'en pensez-vous ?\n"
        f"\n"
        f"Aissa"
    )


def relance_j14(prospect: dict) -> str:
    """Relance J+14 — Porte de sortie elegante."""
    prenom = prospect.get("nom", "").split()[0] if prospect.get("nom") else ""

    return (
        f"Bonjour{' ' + prenom if prenom else ''},\n"
        f"\n"
        f"Je comprends que le timing n'est peut-etre pas le bon "
        f"— et c'est tout a fait normal.\n"
        f"\n"
        f"Je ne vous relancerai plus, mais si un jour la question "
        f"du digital ou de l'IA se pose pour votre activite, "
        f"n'hesitez pas a revenir vers moi.\n"
        f"\n"
        f"Je vous souhaite une excellente continuation.\n"
        f"\n"
        f"Aissa"
    )
