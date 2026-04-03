# Checklist de lancement — Du site au premier client

> Objectif : premier client payant dans 14 jours
> Date de création : 03/04/2026

---

## Phase 1 — Infra (tout est fait)

- [x] Site portfolio live sur Vercel
- [x] Page /services avec pricing Autonome/Accélérateur/Partenaire
- [x] Page /go (landing page)
- [x] Page /diagnostic (qualification automatique)
- [x] Formulaire contact simplifié avec plan pré-sélectionné
- [x] API contact + Resend (emails auto)
- [x] CGV complètes (PI, SLA, période lancement, résiliation)
- [x] SEO + Schema.org sur /services et /go
- [x] WhatsApp flottant
- [x] Exit intent modal
- [x] Calculateur ROI interactif
- [x] Sitemap + robots.txt corrigés
- [x] Templates email rétention (3 templates HTML)

## Phase 2 — Go-to-market (à faire MAINTENANT)

### Semaine 1 (cette semaine)

- [ ] **Créer un compte Calendly** et remplacer le lien dans `ContactForm.tsx`
- [ ] **Optimiser ton profil LinkedIn** :
  - Photo pro (utilise /docs/linkedin-photo-profil.html)
  - Headline : "Je construis des systèmes digitaux pour les artisans BTP | 5-10 jours | 2 900 €"
  - Bannière : utilise /docs/linkedin-banner.html
  - Section "À propos" : 3 paragraphes (problème → solution → preuve)
- [ ] **Identifier 30 artisans BTP** dans le Tarn sur Google Maps
  - Chercher : "plombier Albi", "électricien Albi", "maçon Albi", etc.
  - Noter : nom, entreprise, téléphone, a un site ? (oui/non)
  - Les ajouter dans un Google Sheet ou Notion
- [ ] **Envoyer 10 DMs LinkedIn** (template dans docs/cold-outreach-templates.md)
- [ ] **Publier le premier post LinkedIn** (template dans docs/linkedin-premier-post.md)

### Semaine 2

- [ ] **Envoyer 10 DMs supplémentaires**
- [ ] **Relancer les non-réponses de la semaine 1** (DM #2 plus court)
- [ ] **Publier 2 posts LinkedIn** (alterner : insight tech + résultat client)
- [ ] **Appeler 5 artisans** qui n'ont pas de site (cold call rapide, 2 min)
- [ ] **Si un lead chaud** → appel découverte 30 min → proposition 48h

### Semaine 3

- [ ] **Premier projet signé** (idéalement)
- [ ] **Configurer n8n** pour automatiser les notifs de leads
- [ ] **Créer le pipeline Notion** (colonnes : Lead → Qualifié → Proposition → Signé → En cours → Livré)
- [ ] **Publier 3 posts LinkedIn**
- [ ] **Rejoindre 3 groupes Facebook** BTP locaux (Albi, Tarn, Occitanie)

### Semaine 4

- [ ] **Si premier client signé** : démarrer le Sprint
- [ ] **Demander un témoignage** dès la livraison (même un message WhatsApp suffit)
- [ ] **Publier l'étude de cas** sur LinkedIn + ajouter sur le site
- [ ] **Mettre à jour les stats** social proof avec les vrais chiffres

## Phase 3 — Scale (mois 2-3)

- [ ] Connecter Stripe pour les paiements automatiques
- [ ] Activer les séquences email n8n (nurturing + transition mois 3)
- [ ] Créer un programme de parrainage (client existant → -10% sur le prochain mois)
- [ ] Élargir la zone géographique (Toulouse, Montauban, Castres)
- [ ] Tester les annonces Google Ads sur "site web artisan" (budget : 300 €/mois)
- [ ] Objectif : 3 projets/mois + 5 clients en maintenance

## Phase 4 — Système (mois 4-6)

- [ ] Passer en SASU si CA > 50K €
- [ ] Recruter un freelance dev junior pour les Sprints simples
- [ ] Automatiser le rapport mensuel de performance
- [ ] Lancer le plan Partenaire pour les clients B2B
- [ ] Objectif : 10 000 € MRR
