# Batch articles blog — Semaine 14-18 avril 2026

**Date :** 2026-04-11
**Auteur :** Aïssa + Claude
**Statut :** Design validé, pilote à produire avant batch

## Contexte

Le calendrier blog d'Aïssa cible 12 articles/semaine (mémoire `project_blog_calendar_strategy.md`). 21 articles FR+EN sont déjà publiés ou programmés jusqu'au mardi 14 avril 2026 inclus (14 avril = mardi, pas lundi). Ce batch couvre la suite : **9 articles pour les slots vides à partir du mercredi 15 avril 2026**.

Le mardi 14 avril est déjà rempli (3 articles, légèrement sur-booké). Le rappel « semaine 14-18 avril » couvre Mar 14 → Sam 18 mais ne laisse que 7 slots vides (Mer 15 à Sam 18). On étend donc à **Dim 19 + Lun 20 avril** pour atteindre les 9 articles — choix retenu plutôt que de double-booker Mar 14.

## Stratégie niches (B + C mergé — exploration forte)

Option retenue : **7 niches vierges + 2 niches déjà amorcées en deep-dive**. Raison : Aïssa a 0 client payant actuellement, donc la notion de « niche validée » est théorique. Les niches vierges offrent un océan bleu dans son corpus blog, et Gaillac/Tarn donne un avantage local géographique réel (viticulture notamment).

### Les 9 articles

| # | Slug | Niche | publishAt | Jour | Angle |
|---|---|---|---|---|---|
| 1 | `vigneron-gaillac-vente-directe-en-ligne` | Viticulture | 2026-04-15 08:00 | Mercredi | Vente directe sans Comptoir des Vignes |
| 2 | `cave-viticole-oenotourisme-site-web` | Viticulture | 2026-04-15 14:00 | Mercredi | Capter les œnotouristes via le web |
| 3 | `salon-coiffure-prise-rdv-en-ligne-vraie-valeur` | Beauté | 2026-04-16 08:00 | Jeudi | RDV online qui rapporte vs agenda décoratif |
| 4 | `gite-rural-tarn-dependance-airbnb-cout-reel` | Hébergement | 2026-04-16 14:00 | Jeudi | Coût réel de la dépendance Airbnb |
| 5 | `association-site-web-automatisation-sans-budget` | Associations | 2026-04-17 08:00 | Vendredi | Web + automatisation sans budget |
| 6 | `salle-reception-traiteur-capter-mariages-2027` | Événementiel | 2026-04-17 14:00 | Vendredi | Capter les couples qui se marient en 2027 |
| 7 | `commerce-physique-vendre-en-ligne-complement` | Commerce | 2026-04-18 12:00 | Samedi | Vendre en ligne en complément boutique |
| 8 | `couvreur-charpentier-se-differencier-devis-gratuit` | BTP (deep-dive) | 2026-04-19 20:00 | Dimanche | Se différencier du « devis gratuit » |
| 9 | `gestion-locative-automatiser-relances-loyers` | Immobilier (deep-dive) | 2026-04-20 08:00 | Lundi | Automatiser relances loyers sans casser relation |

## Architecture de production

### Pipeline en 2 étapes

**Étape 1 — Pilote (foreground, cette session) :**
1. Rédaction complète de l'article #1 (`vigneron-gaillac-vente-directe-en-ligne`) en FR puis traduction EN fidèle
2. Validation utilisateur du style, ton, longueur, structure
3. Extraction d'un **brief de référence** `docs/superpowers/briefs/2026-04-11-batch-articles-brief.md` à partir du pilote validé

**Étape 2 — Batch (parallèle, après validation pilote) :**
1. Dispatch de 8 subagents `general-purpose` en parallèle via l'Agent tool
2. Chaque subagent reçoit : brief de référence + pilote comme exemple + slug/niche/publishAt assigné
3. Chaque subagent écrit `<slug>.fr.mdx` ET `<slug>.en.mdx` directement dans `apps/frontend/src/content/blog/`
4. Vérification post-batch : 16 fichiers présents + build Next.js ne casse pas
5. Commit unique : `feat(blog): batch 9 articles — exploration niches (15-20 avril)`

### Pourquoi pilote + batch (pas tout en parallèle)

- Validation intermédiaire évite de gaspiller ~500k tokens si le style dérive
- Le pilote devient la **référence concrète** pour les 8 subagents — bien plus efficace qu'un brief textuel abstrait
- Cohérent avec le warning « 8/10 sessions aujourd'hui » du hook de démarrage

## Structure type d'un article

Alignée sur les articles existants (`artisan-btp-planning-chantier-automatise.fr.mdx` comme référence) :

```
1. Hook narratif local (scène concrète, personnage nommé ou métier incarné)
2. Stat + source (donnée réelle citée, institution crédible)
3. H2 — Le coût caché du statu quo
   → Chiffrage concret EUR/semaine → EUR/an
4. H2 — Les 3 niveaux de solution (gratuit / intermédiaire / sur-mesure)
   → Pour chaque : ce que ça fait, ce que ça ne fait pas, pour qui, mise en place
5. H2 — Les pièges et arnaques courantes
6. H2 — Combien ça coûte vraiment (fourchettes réelles, pas « sur devis »)
7. H2 — Ce que je propose (soft CTA DK Building pattern)
8. Conclusion — 3 questions à se poser
```

**Longueur cible :** 1500-2000 mots FR, traduction EN fidèle (même structure, mêmes exemples adaptés culturellement).

## Contraintes de style (strictes)

### Ton

- Direct, concret, pain-point-first
- Pas de superlatifs (« révolutionnaire », « incroyable »)
- Pas d'emoji dans le corps du texte
- Personnages incarnés (« Marie, vigneronne à Gaillac » plutôt que « un vigneron »)
- Chiffres réels ou fourchettes réalistes, toujours avec source

### Typographie Unicode (CLAUDE.md §20 — strict)

| Élément | Caractère à utiliser | À bannir |
|---|---|---|
| Incise, tiret long | `—` (em dash U+2014) | `-`, `--` |
| Intervalles, plages | `–` (en dash U+2013) | `-` |
| Ellipses | `…` (U+2026) | `...` |
| Guillemets français | `« … »` avec `&nbsp;` insécables avant `»` et après `«` | `"..."` |
| Apostrophes | `'` (U+2019) | `'` ASCII |
| Flèches | `→ ← ↑ ↓` | `->`, `<-` |
| Multiplication | `×` (U+00D7) | `x` |
| Degré | `°` (U+00B0) | `deg` |
| Chevron « Learn more » | `›` (U+203A) avec `&nbsp;` avant | `>` |
| Monnaie euro | `€` | `EUR` |

**Note sur `€` vs `EUR`** : les articles existants utilisent parfois `EUR`. Les nouveaux articles utilisent `€`. Pas de refactor des articles existants — uniquement les nouveaux.

### Sources autorisées

- **BTP** : FFB, CAPEB, ArtisanSmart
- **Viticulture** : INAO, FranceAgriMer, CIVL, Interprofession Gaillac
- **Hébergement** : Insee, Atout France, DGE
- **Commerce** : Fevad, Insee, CCI
- **Immobilier** : FNAIM, UNIS, Insee
- **Associations** : Recherches & Solidarités, Insee
- **Général** : Insee, Banque de France

Toute stat citée doit être **réelle** — pas d'invention. Si incertitude, formuler en fourchette avec conditionnel (« entre 30 et 50 % selon les régions »).

## Frontmatter MDX obligatoire

```yaml
---
title: "[Titre avec accroche, 50-70 caractères]"
description: "[Description actionnable, 150-160 caractères]"
date: "2026-04-15"
publishAt: "2026-04-15T08:00:00+02:00"
updatedAt: "2026-04-15"
author: "Aïssa BELKOUSSA"
tags: ["tag1", "tag2", "tag3"]
category: "[Automatisation | SEO | IA | Site web | Conseil]"
image: "/assets/blog/[slug]/cover.jpg"
imageAlt: "[Description réelle de l'image, contexte visible]"
published: true
featured: false
---
```

**Note images** : les chemins `/assets/blog/<slug>/cover.jpg` pointent vers des fichiers qui n'existent pas encore — hors scope de ce batch. Les balises restent présentes dans le frontmatter pour que le build Next soit prêt à les charger dès que les images seront ajoutées (hors scope).

## Gestion d'erreurs

| Cas | Comportement |
|---|---|
| Pilote ne plaît pas à l'user | Réécriture dans la même session, pas de batch tant que pilote pas validé |
| Subagent échoue sur un article | Marquer l'article comme manquant, continuer le batch, reprise manuelle après |
| Build Next casse après batch | Revert du commit de batch, diagnostic article par article |
| Source introuvable pour une stat | Retirer la stat ou reformuler en fourchette conditionnelle — jamais inventer |
| Conflit slug (existe déjà) | Erreur bloquante du subagent, on renomme |

## Non-objectifs (YAGNI)

- Pas de génération d'images de cover (reste manuel)
- Pas de posts LinkedIn associés (étape distincte, autre batch)
- Pas de dimanche 20 avril (hors scope semaine 14-18)
- Pas de refactor des 21 articles existants pour aligner typographie
- Pas de tests de rendu MDX (on fait confiance au build Next)
- Pas de traduction automatique — la version EN est rédigée fidèlement à partir du FR par le même subagent

## Stratégie d'exécution

1. **Maintenant (cette session)** : rédaction pilote article #1 + validation utilisateur
2. **Après validation pilote** : extraction brief + dispatch 8 subagents parallèles
3. **Après batch** : vérification fichiers + build Next + commit
4. **Plus tard (hors scope)** : génération images cover, posts LinkedIn associés, article dimanche 20 si souhaité

## Références

- `docs/superpowers/specs/2026-04-11-linkedin-dm-launcher-design.md` — pattern de design phasé utilisé dans cette session
- `apps/frontend/src/content/blog/artisan-btp-planning-chantier-automatise.fr.mdx` — article de référence pour structure et ton
- Mémoire `project_blog_calendar_strategy.md` — cadence et 20 niches
- CLAUDE.md §20 — règles typographie Unicode strictes
