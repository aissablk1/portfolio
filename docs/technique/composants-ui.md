# Composants UI du portfolio

## Layout & Navigation

### Header.tsx
`src/components/Header.tsx`
Barre de navigation principale. Liens vers les sections (scroll smooth via ancres #). Responsive avec menu hamburger mobile.

### SideNav.tsx
`src/components/SideNav.tsx`
Navigation laterale (sidebar). Liens vers les memes sections que le Header.

### Footer.tsx
`src/components/Footer.tsx`
- Marquee anime avec ScrollVelocityContainer (nom + titre + industrie)
- Video glitch-red en background du titre
- Titre avec effet text-reveal (mix-blend-screen sur fond video)
- 3 liens sociaux : LinkedIn, GitHub, Telegram (target blank, noopener noreferrer)
- 3 colonnes de liens : Explore, Architecture, Legal
- Credits + infos legales (SIREN, NAF, SIRET)

### ScrollIndicator.tsx
`src/components/ScrollIndicator.tsx`
Indicateur de progression de scroll en haut de page. Utilise `react-overflow-indicator` ou equivalent.

---

## Sections

### Hero.tsx
`src/components/sections/Hero.tsx`
Section d'accueil avec :
- Titre principal + sous-titre (depuis dict.hero)
- 2 CTAs : "Initier un projet" + "Voir les systemes"

### Offers.tsx
`src/components/sections/Offers.tsx`
3 piliers d'offre :
1. De l'intuition au systeme autonome
2. Interface qui reflete ce que vous avez construit
3. Workflow algorithmique & intelligence des donnees

### Approach.tsx
`src/components/sections/Approach.tsx`
4 piliers de methodologie :
1. System-first, business-driven
2. Builder, pas consultant
3. Simplicite structurelle
4. Transparence totale

### Expertises.tsx
`src/components/sections/Expertises.tsx`
8 cartes d'expertise avec titre, description et microcopy :
- Automatisation, IA, Business temps reel, Process autonomes
- Pilotage chiffres, Site qui travaille, Outils equipe, Conversion

### Systems.tsx
`src/components/sections/Systems.tsx`
Grid de 3 projets. Chaque card :
- Placeholder visuel anime (mockup blanc qui remonte au hover)
- Titre, tagline, description
- Stack tags en pills (font-mono, border arrondi)
- Lien vers `/projects/[slug]`
- Animation Framer Motion (fade-in + scale au scroll)

### About.tsx
`src/components/sections/About.tsx`
Bio personnelle + localisation.

### Contact.tsx
`src/components/sections/Contact.tsx`
Titre accroche + sous-titre + CTA vers /contact.

---

## UI Primitives

### ScrollVelocityContainer / ScrollVelocityRow
`src/components/ui/scroll-based-velocity.tsx`
Composant de texte defilant (marquee) avec vitesse basee sur le scroll. Utilise dans le footer pour l'animation du nom.

### cn()
`src/utils/cn.ts`
Utilitaire de merge de classes CSS. Combine `clsx` + `tailwind-merge` pour eviter les conflits de classes Tailwind.
