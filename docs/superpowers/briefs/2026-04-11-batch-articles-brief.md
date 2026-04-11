# Brief de rédaction — Batch articles blog (avril 2026)

Ce brief est utilisé par les subagents qui produisent les articles 2–9 du batch « semaine 14-18 avril 2026 ». Le pilote (article 1, vigneron Gaillac) est le modèle de référence concret.

## Référence concrète

**Toujours lire avant de rédiger :**
- `apps/frontend/src/content/blog/vigneron-gaillac-vente-directe-en-ligne.fr.mdx` (pilote FR)
- `apps/frontend/src/content/blog/vigneron-gaillac-vente-directe-en-ligne.en.mdx` (pilote EN)

Le ton, la structure, la longueur, le frontmatter, les encadrés de calcul concret, la typographie : calquer fidèlement sur le pilote.

## Livrables par article

Pour chaque article assigné, produire **deux fichiers MDX** dans `apps/frontend/src/content/blog/` :

- `<slug>.fr.mdx` (version française)
- `<slug>.en.mdx` (version anglaise)

## Structure type (8 sections)

1. **Hook narratif incarné** — une personne nommée (prénom + métier + lieu précis dans le Tarn ou l'Occitanie), scène concrète datée, 2-3 paragraphes
2. **Stat / contexte sourcé** — donnée réelle avec source citée (voir liste des sources autorisées)
3. **## Le coût caché du statu quo** — chiffrage concret en €/semaine puis €/an pour un cas-type
4. **## Les 3 niveaux de solution** (gratuit/intermédiaire/sur-mesure)
   Pour chaque niveau :
   - « Ce que ça fait » (liste)
   - « Ce que ça ne fait pas » (liste)
   - « Pour qui »
   - « Mise en place » (temps + coût)
5. **## Les pièges à éviter** — 3 à 4 pièges nommés (« Piège 1 — … »)
6. **## Combien ça coûte vraiment** — tableau de fourchettes réelles (Niveau 1/2/3)
7. **## Ce que je propose** — mention légère de DK Building (`dkbuilding.fr`) comme preuve sociale + 2 offres d'Aïssa (Niveau 2 et Niveau 3 adaptées à la niche) + proposition d'échange gratuit de 30 min
8. **## Trois questions à se poser** — 3 questions réflexives

## Longueur

- **FR** : 1500 à 2000 mots (le pilote fait ~1800)
- **EN** : fidèle au FR, même structure, exemples adaptés culturellement si pertinent

## Frontmatter MDX (obligatoire, à remplir pour chaque article)

```yaml
---
title: "[Titre avec accroche, 50-70 caractères, pain-point explicite]"
description: "[Description actionnable, 150-160 caractères, promesse claire]"
date: "YYYY-MM-DD"
publishAt: "YYYY-MM-DDTHH:MM:00+02:00"
updatedAt: "YYYY-MM-DD"
author: "Aïssa BELKOUSSA"
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
category: "[Automatisation | SEO | IA | Site web | Conseil | Conversion]"
image: "/assets/blog/[slug]/cover.jpg"
imageAlt: "[Description réelle et contextuelle de la cover]"
published: true
featured: false
---
```

## Règles INVIOLABLES

### 1. Ne JAMAIS inventer

**Interdit absolu** : inventer ou approximer
- Noms de produits commerciaux
- Noms de services
- Acronymes d'organismes
- Statistiques chiffrées précises non vérifiables

**Exemples d'inventions piégées à ne pas reproduire** (faites dans une version antérieure, corrigées depuis) :
- « Chronopost Vin », « Colissimo Précieux », « Geodis Calberson » — INVENTÉS
- « CIVG » (acronyme inventé pour Gaillac) — INVENTÉ
- « Winealley » (plateforme inventée) — INVENTÉ
- Chiffres précis « 36 % des Français » cités comme venant d'une étude sans connaître le vrai chiffre — INVENTÉ

**Si incertitude sur un nom, une stat, un acronyme** → rester générique :
- ❌ « Chronopost Vin » → ✅ « les transporteurs classiques (Chronopost, Colissimo, DPD, GLS, Geodis) »
- ❌ « 36 % des Français achètent en ligne » → ✅ « la part des Français qui achètent en ligne progresse chaque année »
- ❌ « selon l'étude X 2024 » → ✅ « les études sectorielles récentes montrent »

### 2. Sources autorisées (whitelist stricte)

Ne citer que ces organismes, aux noms exacts :

- **BTP** : FFB (Fédération Française du Bâtiment), CAPEB (Confédération de l'Artisanat et des Petites Entreprises du Bâtiment)
- **Viticulture** : INAO (Institut National de l'Origine et de la Qualité), FranceAgriMer
- **Hébergement / tourisme** : Insee, Atout France, DGE (Direction Générale des Entreprises)
- **Commerce / e-commerce** : Fevad (Fédération du e-commerce et de la vente à distance), Insee, CCI
- **Immobilier** : FNAIM, UNIS (Union des Syndicats de l'Immobilier), Insee
- **Associations** : Insee, Recherches & Solidarités
- **Général / macro** : Insee, Banque de France, France Num

Toute autre source → soit **ne pas la citer**, soit formuler génériquement (« les études sectorielles », « les chiffres du marché »).

### 3. Typographie Unicode stricte (CLAUDE.md §20)

#### Français

| Élément | Caractère à utiliser | À bannir |
|---|---|---|
| Apostrophes | `'` (U+2019) | `'` ASCII |
| Incise, tiret long | `—` (em dash U+2014) | `-`, `--` |
| Intervalles, plages | `–` (en dash U+2013) | `-` |
| Ellipses | `…` (U+2026) | `...` |
| Guillemets français | `«\u00A0…\u00A0»` (avec espaces insécables U+00A0 avant `»` et après `«`) | `"..."` |
| Flèches | `→ ← ↑ ↓` | `->`, `<-` |
| Multiplication | `×` (U+00D7) | `x` |
| Degré | `°` (U+00B0) | `deg` |
| Monnaie euro | `€` | `EUR` |
| Ponctuation double `: ; ! ?` | précédée d'un `\u00A0` insécable | espace normale |

#### Anglais

| Élément | Caractère |
|---|---|
| Apostrophes | `'` (U+2019) |
| Guillemets doubles | `"…"` (U+201C / U+201D) |
| Em dash, ellipses, degree, arrows | idem français |
| Pas de NBSP avant `: ; ! ?` | juste espace normale |

### 4. Ancrage local

Chaque article doit contenir au moins une mention précise du Tarn ou de l'Occitanie quand le contexte le permet : Albi, Gaillac, Castres, Carmaux, Lavaur, Graulhet, Mazamet, Rabastens, Cahuzac-sur-Vère, Castelnau-de-Montmiral, Lisle-sur-Tarn. Le hook narratif devrait si possible situer le personnage dans cette géographie.

### 5. CTA DK Building

Dans la section « Ce que je propose », mentionner **une seule fois** DK Building (dkbuilding.fr) comme preuve sociale, avec le même phrasing que le pilote : « PME BTP à Albi, construit en 10 jours, 3 demandes de contact la première semaine ».

Ne pas répéter la case study à d'autres endroits de l'article.

## Ton rédactionnel

- Direct, concret, pain-point-first
- Pas de superlatifs (« révolutionnaire », « incroyable », « puissant »)
- Pas d'emoji dans le corps du texte
- Personnages incarnés plutôt que généralités
- Chiffres réels ou fourchettes réalistes, jamais de « chiffre magique » inventé
- Honnêteté : dire ce qui ne marche pas aussi clairement que ce qui marche
- Pas de langage vendeur agressif — « voici comment » plutôt que « transformez »

## Check-list avant de rendre un fichier

- [ ] Frontmatter complet et valide (tous les champs du template)
- [ ] Longueur FR entre 1500 et 2000 mots
- [ ] Longueur EN fidèle au FR
- [ ] Hook narratif avec personnage nommé et lieu tarnais/occitan
- [ ] Au moins 1 stat sourcée (whitelist uniquement)
- [ ] Structure 8 sections respectée
- [ ] Tableau de prix présent
- [ ] Mention DK Building une seule fois
- [ ] 3 questions finales
- [ ] Typographie Unicode stricte (apostrophes courbes, em dashes, NBSP français, € au lieu de EUR)
- [ ] **Aucun nom inventé** — vérifier chaque produit/service/acronyme cité
- [ ] Aucun emoji dans le corps
- [ ] Fichier écrit dans `apps/frontend/src/content/blog/<slug>.fr.mdx` (ou `.en.mdx`)
