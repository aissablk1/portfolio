# Sprint Contenu + Business — Design Spec

**Date :** 9 avril 2026
**Scope :** 9 → 17 avril 2026
**Objectif :** Passer de 7 a 15 articles blog, lancer la distribution LinkedIn, preparer la prospection BTP Albi.

## Metriques cibles

| Metrique | Avant | Apres |
|----------|-------|-------|
| Articles blog | 7 | 15 |
| Posts LinkedIn | 5 | 13 |
| Prospects BTP listes | 0 | 30 |

---

## Section 1 — Batch 8 articles blog bilingues

### Format

- Fichiers MDX bilingues : `{slug}.fr.mdx` + `{slug}.en.mdx`
- Frontmatter : title, description, date, publishAt, updatedAt, author, tags, category, image, imageAlt, published, featured
- Contenu : 800-1200 mots, tableaux prix reels, FAQ structuree, CTA vers /services ou /audit
- Images : placeholder `/assets/blog/{slug}/cover.jpg` (meme pattern que les existants)

### Sujets et niches

| # | Slug | Niche | Sujet FR |
|---|------|-------|----------|
| 8 | artisan-btp-fiche-google-maps-2026 | BTP | Comment apparaitre en premier sur Google Maps quand on est artisan |
| 9 | agent-immobilier-chatbot-visite-ia | Immobilier | Chatbot IA pour qualifier les visites immobilieres |
| 10 | restaurant-reservations-automatiques-ia | Restauration | Automatiser les reservations de restaurant avec l'IA |
| 11 | comptable-automatiser-relances-impayees | Prof. liberales | Comment un comptable automatise ses relances d'impayes |
| 12 | commerce-proximite-site-ecommerce-local | Commerce | Creer un site e-commerce local pour un commerce de proximite |
| 13 | roi-intelligence-artificielle-tpe-2026 | IA entreprises | Quel ROI attendre de l'IA quand on est TPE en 2026 |
| 14 | artisan-btp-planning-chantier-automatise | BTP | Automatiser le planning de chantier pour artisan BTP |
| 15 | coach-tunnel-vente-formation-en-ligne | Formation | Construire un tunnel de vente pour vendre une formation en ligne |

### Calendrier publishAt

| Date | 08h00 | 14h00 |
|------|-------|-------|
| 10 avril (jeu) | #8 Google Maps BTP | #9 Chatbot immobilier |
| 11 avril (ven) | #10 Restaurant IA | #11 Comptable relances |
| 12 avril (sam) | #12 Commerce local | — |
| 13 avril (dim) | #13 ROI IA TPE | — |
| 14 avril (lun) | #14 Planning chantier BTP | #15 Coach tunnel vente |

---

## Section 2 — Posts LinkedIn (8 nouveaux)

### Format

- Ajoutes dans `scripts/linkedin/post.py` (array POSTS, ids 6-13)
- Structure : id, title, date_prevue, hashtags, content, comment_link
- Content : hook stop-scroll, 3-4 points valeur standalone, CTA article, 5 hashtags max
- Commentaire auto : lien vers l'article blog

### Calendrier

| Post | Date LinkedIn | Article associe |
|------|---------------|-----------------|
| #6 | 10 avril 10h | #8 Google Maps BTP |
| #7 | 11 avril 10h | #9 Chatbot immobilier |
| #8 | 12 avril 12h | #10 Restaurant IA |
| #9 | 14 avril 10h | #11 Comptable relances |
| #10 | 15 avril 10h | #12 Commerce local |
| #11 | 16 avril 10h | #13 ROI IA TPE |
| #12 | 17 avril 10h | #14 Planning chantier BTP |
| #13 | 18 avril 10h | #15 Coach tunnel vente |

Publication : Aissa execute `python post.py --post N` le jour J.

---

## Section 3 — Liste 30 prospects BTP Albi/Tarn

### Document

Fichier : `docs/prospection/prospects-btp-tarn.md`

### Structure par prospect

| Champ | Description |
|-------|-------------|
| Entreprise | Nom commercial |
| Activite | Maconnerie, electricite, plomberie, charpente... |
| Ville | Albi, Castres, Gaillac, Carmaux, Mazamet... |
| Site web | URL ou "aucun" |
| LinkedIn | Profil dirigeant si disponible |
| Priorite | Haute (pas de site) / Moyenne (site obsolete) / Basse |

### Sourcing

Recherche web : Pages Jaunes, Google Maps, societe.com, LinkedIn — artisans BTP dans le Tarn (81).

### Exploitation

Templates DMs existants dans `docs/prospection/cold-outreach-templates.html`. Personnalises avec les articles blog comme preuve de credibilite (ex: "J'ai ecrit un guide sur comment apparaitre sur Google Maps quand on est artisan — [lien]").

---

## Repartition

### Claude

- 8 articles blog FR + EN (16 fichiers MDX)
- 8 posts LinkedIn dans post.py
- Document 30 prospects BTP
- Mise a jour scheduler LinkedIn

### Aissa

- Publier les posts via `python post.py --post N`
- Envoyer les DMs aux prospects
- DYNABUY le 10 avril — Alexandre en personne

---

## Hors scope

- Calendly : deja en place et lie au site
- Refonte design : pas dans ce sprint
- Backend/API : pas de modifications
