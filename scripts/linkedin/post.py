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
    {
        "id": 6,
        "title": "Artisan BTP : votre fiche Google est invisible",
        "date_prevue": "10 avril 2026",
        "hashtags": "#BTP #artisans #GoogleMaps #Tarn #referencement",
        "content": """Votre fiche Google Business existe.
Mais personne ne vous trouve.

87% des clients cherchent un artisan local sur Google avant de decrocher leur telephone. Si votre fiche n'apparait pas dans les 3 premiers resultats du pack local, vous etes invisible pour la majorite de vos prospects.

J'ai audite des dizaines de fiches d'artisans dans le Tarn. Les 3 erreurs reviennent systematiquement :

1. Aucune photo de chantier.
Google favorise les fiches actives. Une fiche sans photo recente, c'est une fiche que l'algorithme enterre. Les fiches avec plus de 10 photos recoivent 35% de clics supplementaires par rapport a celles qui n'en ont pas.

2. Zero avis client.
Un artisan avec 0 avis face a un concurrent qui en a 15, c'est un match perdu d'avance. 72% des consommateurs ne contactent pas une entreprise avec moins de 3 avis.

3. Categories mal choisies.
"Construction" au lieu de "Constructeur de maisons individuelles". Google est literal. Si votre categorie est vague, il vous classe derriere ceux qui sont precis.

3 actions a faire cette semaine :
- Ajoutez 5 photos de vos derniers chantiers (avant/apres)
- Envoyez un SMS a vos 3 derniers clients satisfaits pour leur demander un avis
- Verifiez votre categorie principale sur business.google.com

J'ai ecrit un guide complet avec les 7 etapes concretes pour passer de invisible a premier resultat local. Le lien est en commentaire.

Si vous voulez un diagnostic gratuit de votre fiche Google, le lien est aussi en commentaire. Ca prend 2 minutes.

#BTP #artisans #GoogleMaps #Tarn #referencement""",
        "comment_link": "Le guide complet (7 etapes) : https://www.aissabelkoussa.fr/blog/artisan-btp-fiche-google-maps-2026\n\nDiagnostic gratuit de votre presence en ligne (2 minutes) : https://www.aissabelkoussa.fr/diagnostic",
    },
    {
        "id": 7,
        "title": "Agent immobilier : arretez les visites inutiles",
        "date_prevue": "11 avril 2026",
        "hashtags": "#immobilier #chatbot #IA #qualification #leads",
        "content": """Un agent immobilier fait en moyenne 12 visites pour signer 1 mandat.
40% de ces visiteurs ne sont pas qualifies.

C'est du tourisme immobilier. Des curieux sans financement, des acheteurs qui ne savent pas encore ce qu'ils cherchent, des vendeurs qui testent le marche sans intention reelle.

Chaque visite non qualifiee, c'est 1h30 de perdue. Le deplacement, la preparation du dossier, le temps sur place, le compte-rendu. Multipliez par 5 visites inutiles par semaine : vous perdez presque une journee entiere.

La solution existe et elle ne demande pas de revolution technologique.

Un chatbot installe sur votre site pose 5 questions avant la prise de rendez-vous :
- Quel est votre budget ?
- Avez-vous obtenu un accord de principe bancaire ?
- Dans quel delai souhaitez-vous acheter ?
- Quelle surface minimum recherchez-vous ?
- Quel secteur geographique ?

Si le prospect ne passe pas ces 5 filtres, il recoit une reponse automatique avec des ressources utiles. Pas de rendez-vous pris.

Les resultats constates chez les agents qui l'utilisent :
- 35% de visites non qualifiees en moins
- 10 heures recuperees par mois
- Un taux de conversion visite-mandat qui passe de 8% a 14%

Le chatbot travaille 24h/24. Il repond aux demandes du dimanche soir. Il ne se fatigue pas et il ne juge pas.

L'article complet avec le detail de la mise en place est en commentaire.

#immobilier #chatbot #IA #qualification #leads""",
        "comment_link": "L'article complet : https://www.aissabelkoussa.fr/blog/agent-immobilier-chatbot-visite-ia\n\nDiagnostic gratuit de votre presence en ligne (2 minutes) : https://www.aissabelkoussa.fr/diagnostic",
    },
    {
        "id": 8,
        "title": "Restaurateur : le telephone vous coute 1 500 EUR/mois",
        "date_prevue": "12 avril 2026",
        "hashtags": "#restaurant #reservation #automatisation #hotellerie #TPE",
        "content": """Votre serveur decroche le telephone 47 fois par service.
Pendant ce temps, la table 6 attend sa commande.

Le telephone sonne pour des reservations, des modifications, des annulations, des questions sur le menu, des demandes d'horaires. La moitie de ces appels pourrait etre traitee automatiquement.

Faisons le calcul.

Un serveur passe en moyenne 2 heures par jour au telephone. Au SMIC charge, ca represente environ 1 500 EUR par mois. Pour repondre a des questions dont 60% ont la meme reponse : "Oui, on est ouvert ce soir. Non, on ne prend pas de reservation avant 19h. Oui, on a une terrasse."

3 solutions concretes, de la plus simple a la plus complete :

Google Reserve (gratuit).
Connectez votre fiche Google Business a un systeme de reservation. Le client reserve directement depuis Google Maps. Zero appel, zero friction. C'est gratuit et ca se configure en 20 minutes.

Chatbot sur votre site.
Un widget de chat repond aux questions frequentes et prend les reservations 24h/24. Le client du dimanche soir qui veut reserver pour mardi n'a plus besoin d'attendre lundi midi.

WhatsApp Business automatise.
Reponses automatiques aux messages les plus frequents. Confirmation de reservation instantanee. Le client recoit un message de rappel la veille.

Resultat : votre serveur sert les clients au lieu de decrocher le telephone. Et vos reservations augmentent parce que le client n'a plus a attendre que quelqu'un reponde.

L'article complet avec le comparatif des solutions est en commentaire.

#restaurant #reservation #automatisation #hotellerie #TPE""",
        "comment_link": "L'article complet : https://www.aissabelkoussa.fr/blog/restaurant-reservations-automatiques-ia\n\nDiagnostic gratuit de votre presence en ligne (2 minutes) : https://www.aissabelkoussa.fr/diagnostic",
    },
    {
        "id": 9,
        "title": "Comptable : vos relances partent a J+45",
        "date_prevue": "14 avril 2026",
        "hashtags": "#comptable #impayes #automatisation #n8n #recouvrement",
        "content": """Vos relances d'impayes partent a J+45.
Vos confreres les envoient a J+3. Automatiquement.

Le probleme n'est pas la volonte. C'est le temps. Entre la saisie, les declarations, les bilans et les rendez-vous clients, les relances passent en bas de la pile. Et quand vous y pensez enfin, le retard de paiement est devenu un impaye.

Un systeme de relance automatise fonctionne en 3 niveaux :

Niveau 1 — J+3 apres echeance. Ton courtois.
"Bonjour, nous constatons que la facture F-2026-0847 d'un montant de 2 340 EUR arrivee a echeance le 7 avril n'a pas encore ete reglee. Merci de proceder au reglement ou de nous indiquer si un probleme se pose."

Niveau 2 — J+15. Ton formel.
Rappel avec mention des penalites de retard prevues dans les CGV. Piece jointe : la facture originale et les conditions de reglement.

Niveau 3 — J+30. Escalade.
Notification au responsable du dossier. Mise en demeure preparee automatiquement. Le comptable n'intervient que pour valider l'envoi.

Les outils pour mettre ca en place :
- n8n (gratuit, auto-heberge) : connecte votre logiciel comptable a votre messagerie
- Make (10 EUR/mois) : alternative cloud sans installation

Les chiffres parlent d'eux-memes : taux de recouvrement de 78% en relance manuelle contre 94% en relance automatisee. La difference, c'est la regularite. La machine ne procrastine pas.

L'article complet avec les templates de relance et le tutoriel de configuration est en commentaire.

#comptable #impayes #automatisation #n8n #recouvrement""",
        "comment_link": "L'article complet : https://www.aissabelkoussa.fr/blog/comptable-automatiser-relances-impayees\n\nDiagnostic gratuit de votre presence en ligne (2 minutes) : https://www.aissabelkoussa.fr/diagnostic",
    },
    {
        "id": 10,
        "title": "Commerce local : faut-il vraiment un site e-commerce ?",
        "date_prevue": "15 avril 2026",
        "hashtags": "#commerce #ecommerce #local #clickandcollect #TPE",
        "content": """Un commerce de proximite a-t-il interet a vendre en ligne ?
La reponse honnete : ca depend.

Tout le monde vous dit qu'il faut un site e-commerce. Les agences vous vendent des boutiques Shopify a 3 000 EUR. Mais personne ne vous pose les bonnes questions avant.

3 criteres pour savoir si ca vaut le coup :

1. Vos produits sont-ils recurrents ?
Si vos clients achetent une seule fois (un meuble, un cadeau), le e-commerce aura du mal a etre rentable. Si vos clients reviennent chaque mois (epicerie, cosmetiques, fournitures), le panier recurrent justifie l'investissement.

2. Votre catalogue depasse-t-il 20 references ?
En dessous, une simple page avec un formulaire de commande suffit. Un vrai site e-commerce avec gestion de stock, paiement en ligne et logistique n'a de sens qu'avec un catalogue suffisant pour que le client ait l'envie de naviguer.

3. Pouvez-vous y consacrer 3 heures par semaine ?
Un site e-commerce demande de la maintenance : mise a jour des stocks, traitement des commandes, photos produits, reponses aux questions. Si vous n'avez pas ce temps, le site deviendra une vitrine abandonnee.

Quand NE PAS le faire :
- Vous avez moins de 10 produits
- Vos clients viennent uniquement pour le conseil en magasin
- Vous n'avez personne pour gerer les commandes en ligne

Le meilleur compromis pour beaucoup de commerces locaux : le click and collect. Le client commande en ligne, vous preparez, il passe recuperer. Pas de livraison, pas de logistique complexe, pas de frais de port qui decouragent l'achat.

L'article complet avec le comparatif des solutions est en commentaire.

#commerce #ecommerce #local #clickandcollect #TPE""",
        "comment_link": "L'article complet : https://www.aissabelkoussa.fr/blog/commerce-proximite-site-ecommerce-local\n\nDiagnostic gratuit de votre presence en ligne (2 minutes) : https://www.aissabelkoussa.fr/diagnostic",
    },
    {
        "id": 11,
        "title": "L'IA promet 40% de gains. Pour une TPE, ca donne combien ?",
        "date_prevue": "16 avril 2026",
        "hashtags": "#IA #ROI #TPE #productivite #automatisation",
        "content": """L'IA promet des gains de productivite de 40%.
Mais pour une TPE de 3 personnes, combien ca rapporte en euros ?

Les grands cabinets publient des chiffres impressionnants. McKinsey annonce 40% de gains de productivite. Goldman Sachs parle de 300 millions d'emplois impactes. Mais ces chiffres concernent des entreprises de 500 personnes avec des budgets IT a 6 chiffres.

Pour une TPE, voici ce que ca donne concretement.

Administration : 850 EUR/mois de gains.
Facturation automatique, relances d'impayes a J+3, classement des documents par IA. Une assistante administrative qui passait 3 heures par jour sur ces taches les fait en 45 minutes.

Commercial : 5 leads supplementaires par semaine.
Chatbot de qualification sur le site, reponses automatiques aux demandes recurrentes, suivi automatise des prospects. Le commercial passe son temps a closer au lieu de trier les demandes.

Service client : 60% des demandes traitees automatiquement.
FAQ intelligente, chatbot qui repond aux questions de premier niveau, redirection vers le bon interlocuteur. Le client a une reponse en 30 secondes au lieu d'attendre 48 heures.

Total : environ 7 450 EUR par mois de gains pour un investissement de 354 EUR (outils IA + automatisations).

Mais il y a un piege.

L'IA sans processus clairement definis, c'est zero retour sur investissement. Si vos process actuels sont desorganises, l'IA automatisera le desordre. Il faut d'abord structurer, ensuite automatiser.

L'article complet avec le detail des calculs et les outils recommandes est en commentaire.

#IA #ROI #TPE #productivite #automatisation""",
        "comment_link": "L'article complet : https://www.aissabelkoussa.fr/blog/roi-intelligence-artificielle-tpe-2026\n\nDiagnostic gratuit de votre presence en ligne (2 minutes) : https://www.aissabelkoussa.fr/diagnostic",
    },
    {
        "id": 12,
        "title": "Le planning de chantier sur post-it coute plus cher que l'outil",
        "date_prevue": "17 avril 2026",
        "hashtags": "#BTP #planning #chantier #artisan #automatisation",
        "content": """Le planning de chantier sur post-it coute plus cher que l'outil qui le remplace.

3 heures par semaine. C'est le temps moyen qu'un artisan passe a reorganiser son planning manuellement. Appeler les sous-traitants, verifier les disponibilites, decaler les interventions quand la meteo ne suit pas, prevenir les clients du retard.

3 heures par semaine, a 45 EUR de l'heure, ca fait 6 345 EUR par an de temps non facture.

Et le resultat n'est meme pas fiable. Selon la FFB, 40% des chantiers en France sont livres en retard. La premiere cause : un manque de coordination entre les intervenants.

3 solutions, du gratuit au sur-mesure :

Google Calendar partage (gratuit).
Chaque chantier est un calendrier. Chaque intervenant voit ses creneaux. Les modifications sont synchronisees en temps reel. Ce n'est pas un logiciel de planning BTP, mais pour un artisan avec 2 a 5 chantiers simultanes, ca suffit.

Obat (25 a 79 EUR/mois).
Logiciel francais concu pour les artisans du batiment. Planning, devis, factures et suivi de chantier dans un seul outil. L'avantage : c'est pense pour le BTP, pas adapte depuis un outil generique.

Solution sur mesure.
Pour les entreprises qui ont des besoins specifiques : planning connecte au logiciel de devis, notifications automatiques aux clients, tableau de bord temps reel sur la rentabilite de chaque chantier.

La question n'est pas "est-ce que j'ai besoin d'un outil ?" La question est : "est-ce que je peux me permettre de perdre 6 345 EUR par an en organisation manuelle ?"

L'article complet avec le comparatif detaille est en commentaire.

#BTP #planning #chantier #artisan #automatisation""",
        "comment_link": "L'article complet : https://www.aissabelkoussa.fr/blog/artisan-btp-planning-chantier-automatise\n\nDiagnostic gratuit de votre presence en ligne (2 minutes) : https://www.aissabelkoussa.fr/diagnostic",
    },
    {
        "id": 13,
        "title": "Votre formation se vend a 497 EUR. Le probleme n'est pas le prix.",
        "date_prevue": "18 avril 2026",
        "hashtags": "#coaching #formation #tunneldevente #marketing #freelance",
        "content": """Votre formation se vend a 497 EUR.
Votre page de vente convertit a 1,2%.
Le probleme n'est pas le prix.

Une page de vente seule, meme bien ecrite, convertit entre 1% et 2%. Ca signifie que sur 100 visiteurs, 98 partent sans acheter. Et la majorite ne reviendront jamais.

Un tunnel de vente complet convertit entre 4% et 8%. Pas parce qu'il est magique. Parce qu'il respecte le parcours naturel de decision d'un acheteur.

Les 5 etapes d'un tunnel qui fonctionne :

Etape 1 — Le lead magnet.
Un contenu gratuit a forte valeur qui resout un probleme precis de votre cible. Un guide PDF, une checklist, une mini-formation video. Le visiteur donne son email en echange.

Etape 2 — La page de capture.
Une seule page, un seul objectif : recuperer l'email. Pas de menu, pas de liens sortants, pas de distractions. Un titre, une promesse, un formulaire.

Etape 3 — La sequence email.
5 a 7 emails sur 10 jours. Chaque email apporte de la valeur et construit la confiance. Le dernier email presente l'offre.

Etape 4 — La page de vente.
Le prospect arrive ici apres avoir lu vos emails, consomme votre contenu gratuit et compris votre expertise. Il ne decouvre pas votre offre a froid. Il est prepare.

Etape 5 — L'upsell.
Apres l'achat : une offre complementaire (coaching individuel, module avance, communaute premium). 15 a 25% des acheteurs acceptent un upsell bien presente.

Pour demarrer sans investissement : Systeme.io est gratuit jusqu'a 2 000 contacts. Ca couvre les 5 etapes.

L'article complet avec les templates et les exemples concrets est en commentaire.

#coaching #formation #tunneldevente #marketing #freelance""",
        "comment_link": "L'article complet : https://www.aissabelkoussa.fr/blog/coach-tunnel-vente-formation-en-ligne\n\nDiagnostic gratuit de votre presence en ligne (2 minutes) : https://www.aissabelkoussa.fr/diagnostic",
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
