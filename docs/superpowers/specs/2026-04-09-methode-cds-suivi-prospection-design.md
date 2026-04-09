# Methode CDS : systeme de suivi prospection — Design Spec

**Date :** 9 avril 2026
**Objectif :** Implementer le S (Suivi) de la methode CDS avec un script CLI qui genere les relances J+3/J+7/J+14 personnalisees pour chaque prospect.

## Contexte

- **C (Contenu)** : fait — 15 articles blog + 13 posts LinkedIn
- **D (DM)** : fait — templates dans docs/prospection/cold-outreach-templates
- **S (Suivi)** : a construire — sequences de relance apres le DM initial

## Architecture

Script CLI Python sans dependance externe (json, datetime, argparse). Lit un fichier prospects.json, calcule les relances dues, genere les messages personnalises.

---

## Section 1 — Structure des donnees

Fichier : `scripts/prospection/prospects.json`

Chaque prospect :
```json
{
  "id": 1,
  "nom": "Stefan Vaysse",
  "entreprise": "Vaysse Plomberie",
  "ville": "Puygouzon",
  "niche": "BTP",
  "canal": "linkedin",
  "premier_dm": "2026-04-10",
  "statut": "dm_envoye",
  "notes": "Specialiste pompes a chaleur"
}
```

Statuts : `a_contacter` → `dm_envoye` → `relance_j3` → `relance_j7` → `relance_j14` → `rdv_pris` | `pas_interesse` | `pas_de_reponse`

---

## Section 2 — Templates de relance

Fichier : `scripts/prospection/templates.py`

3 niveaux de relance, chacun avec variables dynamiques ({prenom}, {entreprise}, {article_url}, {article_sujet}, {ville}) :

**J+3 — Valeur :**
> {prenom}, en passant — j'ai ecrit un guide sur {article_sujet}. Ca pourrait vous faire gagner du temps sur {douleur}. {article_url} — Aissa

**J+7 — Preuve sociale :**
> {prenom}, rapide retour : j'ai fini un projet pour {type_entreprise_similaire} a {ville_proche}. {resultat_concret}. Si c'est un sujet pour {entreprise}, je suis dispo cette semaine pour en discuter. — Aissa

**J+14 — Porte de sortie :**
> {prenom}, je ne veux pas insister — si le timing n'est pas bon, aucun souci. Si jamais le sujet revient, le diagnostic gratuit est toujours la : aissabelkoussa.fr/diagnostic — Aissa

---

## Section 3 — Script CLI

Fichier : `scripts/prospection/follow-up.py`

Commandes :
- `python follow-up.py` — relances du jour (defaut)
- `python follow-up.py --add` — ajouter un prospect interactivement
- `python follow-up.py --status ID STATUT` — mettre a jour un statut
- `python follow-up.py --list` — tous les prospects avec statut
- `python follow-up.py --stats` — funnel stats (combien a chaque etape)
- `python follow-up.py --import-html` — importer depuis docs/prospection/prospects-btp-tarn.html

### Logique relances du jour

Pour chaque prospect avec statut `dm_envoye`, `relance_j3`, ou `relance_j7` :
- Calculer jours depuis `premier_dm`
- Si >= 3 jours et statut `dm_envoye` → afficher relance J+3
- Si >= 7 jours et statut `relance_j3` → afficher relance J+7
- Si >= 14 jours et statut `relance_j7` → afficher relance J+14

Affichage : nom, entreprise, canal, message pret a copier. Apres confirmation, met a jour le statut.

---

## Section 4 — Mapping article par niche

| Niche | Slug article | Sujet pour template |
|-------|-------------|---------------------|
| BTP | artisan-btp-fiche-google-maps-2026 | apparaitre sur Google Maps quand on est artisan |
| Immobilier | agent-immobilier-chatbot-visite-ia | qualifier les visites avec un chatbot IA |
| Restaurant | restaurant-reservations-automatiques-ia | automatiser les reservations |
| Comptable | comptable-automatiser-relances-impayees | automatiser les relances d'impayes |
| Commerce | commerce-proximite-site-ecommerce-local | creer un site e-commerce local |
| Autre | roi-intelligence-artificielle-tpe-2026 | le ROI de l'IA pour une TPE |

---

## Fichiers

- Creer : `scripts/prospection/follow-up.py`
- Creer : `scripts/prospection/templates.py`
- Creer : `scripts/prospection/prospects.json` (vide initialement, peuple via --import-html ou --add)
- Existant : `docs/prospection/prospects-btp-tarn.html` (source import)

## Dependances

Zero. Python standard uniquement (json, datetime, argparse, html.parser pour l'import).

## Hors scope

- Envoi automatique de DM (pas d'API LinkedIn pour ca)
- Interface web
- Notifications push (a migrer vers n8n si > 200 prospects)
