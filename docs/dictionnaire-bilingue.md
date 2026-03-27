# Dictionnaire bilingue (LanguageContext)

## Vue d'ensemble

Systeme i18n maison base sur React Context. Tout le contenu textuel du site est centralise dans un dictionnaire FR/EN type-safe.

**Fichier :** `src/components/LanguageContext.tsx`

---

## Architecture

### LanguageProvider
Composant wrapper qui fournit le contexte langue a toute l'application.

- Stocke la langue courante dans `useState`
- Persiste le choix dans `localStorage` (cle : `lang`)
- Charge la preference au montage via `useEffect`

### useLanguage()
Hook qui expose :
- `language` : `"fr" | "en"` — langue active
- `setLanguage(lang)` : change la langue + persiste dans localStorage
- `dict` : l'objet dictionnaire complet pour la langue active

---

## Structure du dictionnaire (type Dictionary)

```
warning          → banniere d'alerte phishing
nav              → labels de navigation (6 liens)
hero             → titre, sous-titre, 2 CTAs
offers           → titre section + 3 piliers (titre + description)
approach         → titre, intro, bio, subtitle, 4 piliers (titre + contenu)
expertises       → titre + 8 items (titre, description, microcopy)
systems          → titre, intro + 3 items projet (id, slug, title, sub, desc, color, stack[])
about            → contenu bio + localisation
contact          → titre, sous-titre, CTA
footer           → jobTitle, industry, systemsStrategy, title, baseline, credits, reserved, legal links
funnel           → formulaire multi-etapes :
  steps.identity → title, nameLabel, namePlaceholder, emailLabel, emailPlaceholder, contextLabel, contextPlaceholder
  steps.needs    → title, 6 options (id, label, template)
  steps.details  → title, messageLabel, budgetLabel, customMessage, useTemplate
  cta            → next, prev, submit
  success        → title, message
```

---

## Sections du site qui consomment le dictionnaire

| Section | Cle dict | Composant |
|---|---|---|
| Navigation | `nav` | Header.tsx, SideNav.tsx, Footer.tsx |
| Hero | `hero` | Hero.tsx |
| Offres | `offers` | Offers.tsx |
| Approche | `approach` | Approach.tsx |
| Expertises | `expertises` | Expertises.tsx |
| Systemes/Projets | `systems` | Systems.tsx |
| A propos | `about` | About.tsx |
| Contact | `contact` | Contact.tsx |
| Formulaire | `funnel` | ContactForm.tsx |
| Footer | `footer` | Footer.tsx |

---

## Ajouter du contenu

1. Ajouter le champ dans l'interface `Dictionary`
2. Ajouter la valeur FR dans `dictionaries.fr`
3. Ajouter la valeur EN dans `dictionaries.en`
4. TypeScript verifiera que les deux langues ont la meme structure
