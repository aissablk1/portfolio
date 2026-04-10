"""
Templates de relance CDS — J+3 / J+7 / J+14
Chaque fonction prend un dict prospect et retourne un message personnalisé.
"""

BASE_URL = "https://www.aissabelkoussa.fr/blog/"

NICHE_ARTICLES = {
    "BTP": {
        "slug": "artisan-btp-fiche-google-maps-2026",
        "sujet": "apparaître sur Google Maps quand on est artisan",
        "douleur": "la visibilité en ligne",
    },
    "Immobilier": {
        "slug": "agent-immobilier-chatbot-visite-ia",
        "sujet": "qualifier les visites avec un chatbot IA",
        "douleur": "les visites non qualifiées",
    },
    "Restaurant": {
        "slug": "restaurant-reservations-automatiques-ia",
        "sujet": "automatiser les réservations",
        "douleur": "le temps passé au téléphone",
    },
    "Comptable": {
        "slug": "comptable-automatiser-relances-impayees",
        "sujet": "automatiser les relances d'impayés",
        "douleur": "les relances manuelles",
    },
    "Commerce": {
        "slug": "commerce-proximite-site-ecommerce-local",
        "sujet": "créer un site e-commerce local",
        "douleur": "la vente en ligne",
    },
}

DEFAULT_ARTICLE = {
    "slug": "roi-intelligence-artificielle-tpe-2026",
    "sujet": "le ROI de l'IA pour une TPE",
    "douleur": "la productivité",
}


def _get_article(niche: str) -> dict:
    return NICHE_ARTICLES.get(niche, DEFAULT_ARTICLE)


def relance_j3(prospect: dict) -> str:
    """Relance J+3 — Partage d'article ciblé par niche."""
    art = _get_article(prospect.get("niche", ""))
    prenom = prospect.get("nom", "").split()[0] if prospect.get("nom") else ""
    entreprise = prospect.get("entreprise", "")
    url = BASE_URL + art["slug"]

    return (
        f"Bonjour{' ' + prenom if prenom else ''},\n"
        f"\n"
        f"Suite à mon message, je me suis dit que cet article pourrait "
        f"vous intéresser — il parle de {art['sujet']} :\n"
        f"\n"
        f"{url}\n"
        f"\n"
        f"C'est un sujet que je vois souvent chez les entreprises comme "
        f"{entreprise} : {art['douleur']} reste un vrai frein à la croissance.\n"
        f"\n"
        f"Si ça vous parle, je serais ravi d'en discuter 15 min.\n"
        f"\n"
        f"Bonne journée,\n"
        f"Aïssa"
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
        f"J'ai accompagné une entreprise{lieu} sur {art['douleur']} "
        f"— en 3 semaines, ils ont vu une différence nette sur leur "
        f"visibilité et leurs demandes entrantes.\n"
        f"\n"
        f"Le contexte était similaire à {entreprise} : pas de site "
        f"web performant, zéro présence en ligne automatisée.\n"
        f"\n"
        f"Je ne veux pas être insistant — juste vous montrer que "
        f"des solutions rapides existent. Un appel de 15 min suffit "
        f"pour voir si ça s'applique à votre cas.\n"
        f"\n"
        f"Qu'en pensez-vous ?\n"
        f"\n"
        f"Aïssa"
    )


def relance_j14(prospect: dict) -> str:
    """Relance J+14 — Porte de sortie élégante."""
    prenom = prospect.get("nom", "").split()[0] if prospect.get("nom") else ""

    return (
        f"Bonjour{' ' + prenom if prenom else ''},\n"
        f"\n"
        f"Je comprends que le timing n'est peut-être pas le bon "
        f"— et c'est tout à fait normal.\n"
        f"\n"
        f"Je ne vous relancerai plus, mais si un jour la question "
        f"du digital ou de l'IA se pose pour votre activité, "
        f"n'hésitez pas à revenir vers moi.\n"
        f"\n"
        f"Je vous souhaite une excellente continuation.\n"
        f"\n"
        f"Aïssa"
    )
