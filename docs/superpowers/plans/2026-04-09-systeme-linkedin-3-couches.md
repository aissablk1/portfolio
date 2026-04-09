# Systeme LinkedIn 3 Couches — Plan d'implementation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrer le framework Skaale "3 Couches" (Attirer/Convertir/Fermer) dans l'ecosysteme documentaire existant — 1 document hub + 4 satellites enrichis + index/manifest.

**Architecture:** Hub operationnel (`strategie/systeme-linkedin-3-couches.html`) avec checklist quotidienne, scripts DM, KPIs. 4 satellites enrichis (`plan-linkedin.html`, `cold-outreach-templates.html`, `tracker-prospection.html`, `playbook-commercial.html`). Tous en HTML avec balises meta pour l'index documentaire.

**Tech Stack:** HTML/CSS/JS vanilla, meme design system que les docs existants (Geist/Inter, `--bg:#fafafa`, cards, badges, tables).

**Spec:** `docs/superpowers/specs/2026-04-09-systeme-linkedin-3-couches-design.html`

---

## File Structure

| # | Fichier | Action | Responsabilite |
|---|---|---|---|
| 1 | `docs/strategie/systeme-linkedin-3-couches.html` | Creer | Hub operationnel — framework, scripts DM, checklist quotidienne, KPIs |
| 2 | `docs/prospection/tracker-prospection.html` | Modifier | Enrichir statuts, colonnes source/relance, integrer 30 prospects BTP |
| 3 | `docs/prospection/cold-outreach-templates.html` | Modifier | Ajouter section Warm Outreach Skaale + relances |
| 4 | `docs/linkedin/plan-linkedin.html` | Modifier | Restructurer calendrier en Perspective/Preuve/Promo |
| 5 | `docs/strategie/playbook-commercial.html` | Modifier | Enrichir sections 5.1, 5.3, 5.5 |
| 6 | `docs/index.html` | Modifier | Verifier entree dans CATEGORIES (deja present via hook) |
| 7 | `docs/manifest.json` | Modifier | Verifier entree (deja present via hook) |

---

### Task 1: Creer le document Hub — systeme-linkedin-3-couches.html

**Files:**
- Create: `docs/strategie/systeme-linkedin-3-couches.html`

Ce fichier est le livrable principal. Il contient le framework complet, les 6 scripts DM, les 3 scripts de relance, la checklist quotidienne, la matrice CRM, et les KPIs.

- [ ] **Step 1: Creer le fichier HTML complet**

Creer `docs/strategie/systeme-linkedin-3-couches.html` avec :

**Structure HTML obligatoire :**
- Doctype HTML5, `lang="fr"`, charset UTF-8, viewport
- Balises meta : `doc-category="Strategie"`, `doc-title="Systeme LinkedIn 3 Couches"`, `doc-color="#0a66c2"`
- CSS : reprendre le design system des docs existants (`--fg:#1a1a1a`, `--muted:#737373`, `--border:#e5e5e5`, `--accent:#0a66c2`, `--bg:#fafafa`, font Geist/Inter)
- Lien retour : `<a href="../index.html" class="back">&larr; Retour</a>`

**Sections du contenu :**

1. **Header** : Titre "Systeme LinkedIn 3 Couches", sous-titre italique "Le contenu attire. Le DM ouvre. Le suivi ferme.", badge "Framework Skaale — Alexis Vidal", alerte rouge "90% des dirigeants postent, attendent, pas de DM, pas de relance. Des vues, 0 RDV."

2. **Diagramme 3 colonnes** (CSS grid `grid-template-columns:1fr 1fr 1fr`) :
   - Colonne 1 (accent bleu) : Couche 1 Attirer — Perspective, Preuve, Promo
   - Colonne 2 (amber) : Couche 2 Convertir — Signaux, Structure DM, Organisation leads
   - Colonne 3 (rouge) : Couche 3 Fermer — Timeline relance, KPI 80%, Erreurs

3. **Couche 1 — Attirer** : Tableau 4 colonnes (Type avec badge colore, Role, Exemples BTP, Exemples B2B). 3 lignes : Perspective (t-blue), Preuve (t-green), Promo (t-amber). Encart vert "Regle : Lundi=Perspective, Mercredi=Preuve, Vendredi=Promo. 3 mois minimum." Lien vers `../linkedin/plan-linkedin.html`.

4. **Couche 2 — Convertir** :
   - Liste ordonnee des 3 signaux (visiteurs profil 24h, connexions 48h, likes 24h)
   - Card dark avec structure DM : CONTEXTE → DOULEUR → PREUVE → INVITATION
   - 6 scripts DM en cards blanches avec `<pre>` (copier l'integralite des scripts de la spec design HTML — scripts 1 a 6 : BTP petit, BTP structure, B2B solo, B2B cabinet, Formation PME, Formation organisme)
   - Tableau 4 statuts leads (Prospect chaud/En discussion/Client/En attente) avec badges colores
   - Lien vers `../prospection/cold-outreach-templates.html`

5. **Couche 3 — Fermer** :
   - Tableau timeline (J+3 valeur/genereux, J+7 cas client/credible, J+14 message court/direct)
   - 3 scripts de relance en cards blanches avec `<pre>` (copier l'integralite des scripts de la spec)
   - Liste erreurs a eviter (4 items)
   - Alerte amber "80% des deals apres 3 messages. 90% abandonnent trop tot."

6. **Checklist quotidienne** :
   - 3 sous-sections : Matin 15min (4 items), Midi 20min (3 items), Soir 10min (4 items)
   - Utiliser `<ul class="checklist">` sans puces, avec bordures entre items
   - Alerte rouge "45 min/jour. Non negociable."
   - JavaScript minimal : checkboxes `<input type="checkbox">` devant chaque item, etat sauvegarde dans `localStorage` sous cle `skaale-checklist`. Au chargement, restaurer les etats. Ajouter un bouton "Reinitialiser" qui vide les checkboxes (pour un nouveau jour).

7. **Matrice outils CRM** : Tableau 5 colonnes (Outil, Prix, Pour qui, Avantages, Limites). 5 lignes : Tracker HTML 0€, Notion 0€, Google Sheets 0€, Waalaxy ~60€/mois, Lemlist ~59€/mois. Encart vert avec recommandation progressive (maintenant/30j/90j).

8. **KPIs systeme complet** : Tableau 5 colonnes (Couche, Metrique, Cible J30, J60, J90). 10 lignes avec rowspan pour les 3 couches. Copier les valeurs exactes de la spec.

- [ ] **Step 2: Verifier le rendu dans le navigateur**

Ouvrir `docs/strategie/systeme-linkedin-3-couches.html` en `file://` dans le navigateur. Verifier :
- Le diagramme 3 colonnes s'affiche correctement
- Les scripts DM sont lisibles et copiables
- La checklist fonctionne (clic = coche, rechargement = etat preserve)
- Le bouton "Reinitialiser" fonctionne
- Le responsive fonctionne (les 3 colonnes passent en 1 colonne sur mobile)
- Le lien "Retour" fonctionne

- [ ] **Step 3: Commit**

```bash
git add docs/strategie/systeme-linkedin-3-couches.html
git commit -m "feat: add LinkedIn 3-layer system hub (Skaale framework)"
```

---

### Task 2: Enrichir le tracker de prospection

**Files:**
- Modify: `docs/prospection/tracker-prospection.html`

Le tracker actuel a 12 prospects initiaux avec 6 statuts. On ajoute les statuts Skaale, les colonnes Source et Relance, et les 30 prospects BTP Tarn.

- [ ] **Step 1: Ajouter les nouveaux statuts dans le JavaScript**

Dans le tableau `statusOptions` (ligne ~81), ajouter les nouveaux statuts. Le tableau final doit etre :

```js
const statusOptions = [
  { value:"signal", label:"Signal" },
  { value:"pending", label:"En attente" },
  { value:"dm_sent", label:"DM envoye" },
  { value:"sent", label:"Envoye" },
  { value:"replied", label:"Repondu" },
  { value:"hot", label:"Prospect chaud" },
  { value:"call", label:"Appel fait" },
  { value:"signed", label:"Signe" },
  { value:"nurture", label:"A nourrir" },
  { value:"lost", label:"Perdu" },
];
```

- [ ] **Step 2: Ajouter la colonne Source**

Ajouter un `<th>Source</th>` apres la colonne "Canal" dans le thead. Ajouter les options de source :

```js
const sourceOptions = ["profil","connexion","like","commentaire","cold","referral"];
```

Generer un `<select>` avec ces options dans chaque ligne du tbody, avec la classe `c-source`.

- [ ] **Step 3: Ajouter la colonne Relance avec calcul automatique**

Ajouter un `<th>Relance</th>` apres la colonne "Statut". La cellule affiche automatiquement le statut de relance base sur la date d'envoi :

```js
function getRelanceStatus(dateStr, status) {
  if (!dateStr || status === "signed" || status === "lost" || status === "replied" || status === "call" || status === "hot") return "";
  var sent = new Date(dateStr);
  var now = new Date();
  var days = Math.floor((now - sent) / 86400000);
  if (days >= 14) return "J+14";
  if (days >= 7) return "J+7";
  if (days >= 3) return "J+3";
  return "";
}
```

Afficher avec code couleur : `J+3` = fond jaune `#fffbeb`, `J+7` = fond orange `#fff7ed`, `J+14` = fond rouge `#fef2f2`. Utiliser un `<span>` avec classe dynamique.

- [ ] **Step 4: Enrichir les stats du header**

Modifier le div `.stats` pour avoir 7 stats au lieu de 5 :

```html
<div class="stats" style="grid-template-columns:repeat(7,1fr)">
  <div class="stat"><div class="number" id="s-total">0</div><div class="label">Prospects</div></div>
  <div class="stat"><div class="number" id="s-signals" style="color:var(--amber)">0</div><div class="label">Signaux</div></div>
  <div class="stat"><div class="number" id="s-contacted" style="color:var(--amber)">0</div><div class="label">Contactes</div></div>
  <div class="stat"><div class="number" id="s-replied" style="color:var(--green)">0</div><div class="label">Reponses</div></div>
  <div class="stat"><div class="number" id="s-hot" style="color:#f97316">0</div><div class="label">Chauds</div></div>
  <div class="stat"><div class="number" id="s-calls" style="color:var(--accent)">0</div><div class="label">Appels</div></div>
  <div class="stat"><div class="number" id="s-signed" style="color:var(--green)">0</div><div class="label">Signes</div></div>
</div>
```

Mettre a jour la fonction `save()` / `updateStats()` pour compter les nouveaux statuts.

- [ ] **Step 5: Integrer les 30 prospects BTP Tarn**

Ajouter les 30 prospects du tableau `PROSPECTS` de `prospects-btp-tarn.html` dans le tableau `prospects` du tracker. Pour chaque prospect BTP, la structure est :

```js
{ name:"Dirigeant", company:"[entreprise]", niche:"btp" }
```

Liste complete des 30 entreprises a ajouter (apres les 12 existants) :

```js
{ name:"Dirigeant", company:"Societe Albigeoise de Maconnerie", niche:"btp" },
{ name:"Dirigeant", company:"Entreprise Batiment Albet", niche:"btp" },
{ name:"Dirigeant", company:"J.M. Camps", niche:"btp" },
{ name:"Dirigeant", company:"Florian Palazy", niche:"btp" },
{ name:"Dirigeant", company:"AMelec.tarn", niche:"btp" },
{ name:"Dirigeant", company:"Olivier Energies Service", niche:"btp" },
{ name:"Dirigeant", company:"FC Maconnerie", niche:"btp" },
{ name:"Dirigeant", company:"Tarn Entreprise de Batiment", niche:"btp" },
{ name:"Dirigeant", company:"Pierre Chamayou TP", niche:"btp" },
{ name:"Dirigeant", company:"Carivenc Bernard", niche:"btp" },
{ name:"Dirigeant", company:"Tarn Pavillon", niche:"btp" },
{ name:"Dirigeant", company:"CROS et Fils", niche:"btp" },
{ name:"Dirigeant", company:"Tarn Constructions", niche:"btp" },
{ name:"Dirigeant", company:"Faure et Fils", niche:"btp" },
{ name:"Dirigeant", company:"MG Peinture", niche:"btp" },
{ name:"Dirigeant", company:"Bonnaudet et Cie", niche:"btp" },
{ name:"Dirigeant", company:"Mtec Peinture", niche:"btp" },
{ name:"Dirigeant", company:"Conesa", niche:"btp" },
{ name:"Dirigeant", company:"Batirea Ingenierie", niche:"btp" },
{ name:"Dirigeant", company:"Appaix TP SAS", niche:"btp" },
{ name:"Dirigeant", company:"SARL Vedel", niche:"btp" },
{ name:"Dirigeant", company:"MT Renov Tarn", niche:"btp" },
{ name:"Dirigeant", company:"Pierre et Bois Tradition", niche:"btp" },
{ name:"Dirigeant", company:"Sarl Cayla Plomberie", niche:"btp" },
{ name:"Dirigeant", company:"Brice Molluna", niche:"btp" },
{ name:"Dirigeant", company:"CORNUS Plomberie", niche:"btp" },
{ name:"Dirigeant", company:"Terrassement 81", niche:"btp" },
{ name:"Dirigeant", company:"Socorebat Albi", niche:"btp" },
{ name:"Dirigeant", company:"Idealbat", niche:"btp" },
{ name:"Dirigeant", company:"MG Multi-services", niche:"btp" },
```

- [ ] **Step 6: Mettre a jour la fonction save/load pour les nouvelles colonnes**

La fonction `save()` doit aussi sauvegarder `source` et la fonction de rendu doit aussi generer la cellule Relance. Ajouter `source` dans l'objet sauvegarde :

```js
return {
  canal: row.querySelector('.c-canal').value,
  date: row.querySelector('.c-date').value,
  status: row.querySelector('.c-status').value,
  source: row.querySelector('.c-source').value,
  notes: row.querySelector('.c-notes').value,
};
```

- [ ] **Step 7: Verifier le rendu**

Ouvrir le tracker dans le navigateur. Verifier :
- Les 42 prospects (12 + 30) s'affichent
- Les nouveaux statuts apparaissent dans le select
- La colonne Source est fonctionnelle
- La colonne Relance calcule correctement (tester en mettant une date 4 jours dans le passe)
- Les stats header comptent correctement
- Les donnees persistent dans localStorage apres rechargement

- [ ] **Step 8: Commit**

```bash
git add docs/prospection/tracker-prospection.html
git commit -m "feat: enrich tracker with Skaale statuses, source/relance columns, 30 BTP prospects"
```

---

### Task 3: Ajouter la section Warm Outreach dans cold-outreach-templates

**Files:**
- Modify: `docs/prospection/cold-outreach-templates.html`

On ajoute une section complete apres les regles d'envoi existantes (ligne 341, avant `</div></body></html>`).

- [ ] **Step 1: Inserer la section Warm Outreach Skaale**

Juste avant la balise fermante `</div>` (ligne 342) du container, inserer le contenu HTML suivant :

```html
<hr>
<h2 id="warm-outreach-skaale">Templates DM — Format Skaale (Warm Outreach)</h2>

<div style="background:#eff6ff;border-left:4px solid #0a66c2;padding:1rem 1.25rem;border-radius:8px;margin:1rem 0;font-size:.875rem">
<strong>Difference Cold vs Warm :</strong> Les templates ci-dessus (sections 1-3) sont du <strong>cold outreach</strong> — on contacte quelqu'un qui ne nous connait pas. Les templates ci-dessous sont du <strong>warm outreach</strong> — on contacte quelqu'un qui a montre un signal d'interet (visite profil, connexion, like/commentaire).<br>
<strong>Source :</strong> Framework Skaale — Alexis Vidal. Voir <a href="../strategie/systeme-linkedin-3-couches.html">Systeme LinkedIn 3 Couches</a> pour le framework complet.
</div>

<h3>Signaux declencheurs</h3>
<table>
<thead><tr><th>Signal</th><th>Delai max</th><th>Action</th></tr></thead>
<tbody>
<tr><td><strong>Visite de profil</strong></td><td>24h</td><td>DM personnalise base sur le profil du visiteur</td></tr>
<tr><td><strong>Connexion acceptee</strong></td><td>48h</td><td>DM de bienvenue + question ouverte</td></tr>
<tr><td><strong>Like/commentaire</strong></td><td>24h</td><td>DM referençant le post en question</td></tr>
</tbody>
</table>

<h3>Structure du DM Skaale</h3>
<pre style="background:#1a1a1a;color:#fafafa;padding:1rem;border-radius:8px;font-size:.8125rem;line-height:1.6"><code>CONTEXTE   → "J'ai vu [element precis]"
DOULEUR    → "Ca me dit que [probleme identifie]"
PREUVE     → "On a aide [client similaire] a [resultat chiffre]"
INVITATION → "On en parle 15 min ?"</code></pre>
```

Puis inserer les 6 scripts DM complets (identiques a ceux du hub — voir spec section 4 scripts 1 a 6), chacun dans un `<h4>` + `<pre>` avec style fond clair.

- [ ] **Step 2: Inserer la section Scripts de relance**

Apres les 6 scripts DM, ajouter :

```html
<h3>Scripts de relance J+3 / J+7 / J+14</h3>

<h4>Relance J+3 — Apporter de la valeur</h4>
<pre style="background:#f8f8f8;padding:1rem;border-radius:8px;border:1px solid #e5e5e5;font-size:.8125rem">[Prenom], je suis tombe sur [article/stat/outil] qui pourrait vous interesser vu votre activite en [domaine]. [Lien ou resume en 2 lignes].

Pas de pression -- si le sujet de [automatisation/site/formation] revient, je suis la.</pre>

<h4>Relance J+7 — Cas client</h4>
<pre style="background:#f8f8f8;padding:1rem;border-radius:8px;border:1px solid #e5e5e5;font-size:.8125rem">[Prenom], je voulais partager un cas recent : [client similaire] avait exactement le meme enjeu que vous ([douleur identifiee dans le DM initial]). En [delai], on a [resultat concret].

Si ca parle a votre situation, je suis disponible pour un echange rapide.</pre>

<h4>Relance J+14 — Message court</h4>
<pre style="background:#f8f8f8;padding:1rem;border-radius:8px;border:1px solid #e5e5e5;font-size:.8125rem">[Prenom], juste un dernier mot -- si [probleme initial] est toujours un sujet, je suis disponible. Sinon, pas de souci, et bonne continuation avec [entreprise].</pre>
```

- [ ] **Step 3: Verifier le rendu**

Ouvrir le fichier dans le navigateur. Verifier que les deux sections (Cold existant + Warm Skaale) sont clairement separees par un `<hr>`, que les scripts sont lisibles et copiables.

- [ ] **Step 4: Commit**

```bash
git add docs/prospection/cold-outreach-templates.html
git commit -m "feat: add Skaale warm outreach DM templates + relance scripts"
```

---

### Task 4: Restructurer le calendrier LinkedIn en Perspective/Preuve/Promo

**Files:**
- Modify: `docs/linkedin/plan-linkedin.html`

Le plan LinkedIn actuel a une section calendrier (section 07). On ajoute un encart Skaale et une colonne "Type" aux tableaux.

- [ ] **Step 1: Localiser la section calendrier**

La section calendrier est identifiable par le texte "Le calendrier de contenu" dans le sommaire (ligne 78). Chercher le `<h2>` correspondant (section 07).

- [ ] **Step 2: Ajouter l'encart framework Skaale**

Juste apres le `<h2>` de la section calendrier, inserer :

```html
<div style="background:#eff6ff;border-left:4px solid #0a66c2;padding:16px 20px;border-radius:10px;margin:16px 0;font-size:13px">
<strong>Framework Skaale — 3 types de posts :</strong><br>
<span style="display:inline-block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:4px 10px;border-radius:20px;background:#eff6ff;color:#0a66c2">Perspective</span> Montrer l'expertise (lundi) &middot;
<span style="display:inline-block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:4px 10px;border-radius:20px;background:#f0fdf4;color:#16a34a">Preuve</span> Creer la confiance (mercredi) &middot;
<span style="display:inline-block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:4px 10px;border-radius:20px;background:#fffbeb;color:#d97706">Promo</span> Convertir l'attention (vendredi)<br>
<a href="../strategie/systeme-linkedin-3-couches.html">Voir le systeme complet &rarr;</a>
</div>
```

- [ ] **Step 3: Ajouter la colonne Type Skaale au tableau calendrier**

Le tableau a 4 colonnes (Semaine, Lundi, Mercredi, Vendredi). Il faut :
1. Ajouter un `<th>` "Type" en premiere position apres Semaine, ou bien ajouter les badges directement dans les cellules existantes.

**Approche recommandee** (moins invasive) : ajouter un badge au debut de chaque cellule du tableau existant :

- Cellules Lundi : ajouter `<span class="badge b-blue" style="font-size:9px;margin-right:4px">PERSPECTIVE</span>` au debut
- Cellules Mercredi : ajouter `<span class="badge b-green" style="font-size:9px;margin-right:4px">PREUVE</span>` au debut
- Cellules Vendredi : ajouter `<span class="badge b-amber" style="font-size:9px;margin-right:4px">PROMO</span>` au debut

Les classes `.b-blue`, `.b-green`, `.b-amber` existent deja dans le CSS du fichier (`.badge` + `.b-red/.b-green/.b-amber/.b-blue` definis dans le `<style>`).

- [ ] **Step 4: Ajouter l'encart "3 mois minimum"**

Apres le tableau du calendrier, ajouter :

```html
<div class="alert a-green">
<strong>Regle Skaale :</strong> Ce cycle Perspective/Preuve/Promo doit etre repete pendant <strong>3 mois minimum</strong>. Les resultats (visites profil, connexions, abonnes) sont les signaux d'entree de la <a href="../strategie/systeme-linkedin-3-couches.html">Couche 2 — Convertir</a>.
</div>
```

- [ ] **Step 5: Verifier le rendu**

Ouvrir le plan LinkedIn dans le navigateur. Verifier que l'encart Skaale apparait avant le tableau, que les badges sont visibles dans chaque cellule, et que l'encart vert apparait apres le tableau.

- [ ] **Step 6: Commit**

```bash
git add docs/linkedin/plan-linkedin.html
git commit -m "feat: restructure LinkedIn content calendar with Skaale Perspective/Preuve/Promo"
```

---

### Task 5: Enrichir le playbook commercial

**Files:**
- Modify: `docs/strategie/playbook-commercial.html`

3 modifications ponctuelles dans les sections 5.1, 5.3, et 5.5.

- [ ] **Step 1: Ajouter le paragraphe Systeme 3 couches dans la section 5.1**

Apres le paragraphe "Prospection : 20 demandes de connexion ciblees/jour..." (ligne 900) et avant le `<hr>` (ligne 901), inserer :

```html
<div style="background:#eff6ff;border-left:4px solid #0a66c2;padding:1rem 1.25rem;border-radius:8px;margin:1.5rem 0;font-size:.875rem">
<strong>Systeme 3 couches (framework Skaale) :</strong> La strategie LinkedIn est structuree en 3 couches — <strong>Attirer</strong> (contenu Perspective/Preuve/Promo), <strong>Convertir</strong> (DM declenches par des signaux), <strong>Fermer</strong> (relances J+3/J+7/J+14). Voir le document operationnel complet : <a href="systeme-linkedin-3-couches.html">Systeme LinkedIn 3 Couches</a>.
</div>
```

- [ ] **Step 2: Ajouter la sous-section Warm outreach dans la section 5.3**

Trouver la section 5.3 "Cold outreach cible" (ligne 949). Apres le tableau de sequence J0-J14 et le paragraphe "Volume/Objectif", ajouter :

```html
<h4 id="warm-outreach-signal-based">Warm outreach (signal-based)</h4>
<p>En parallele du cold outreach, un track <strong>warm</strong> est declenche par les signaux LinkedIn :</p>
<table>
<thead><tr><th>Signal</th><th>Delai</th><th>Action</th></tr></thead>
<tbody>
<tr><td>Visite de profil</td><td>24h</td><td>DM personnalise (format Skaale : Contexte/Douleur/Preuve/Invitation)</td></tr>
<tr><td>Connexion acceptee</td><td>48h</td><td>DM de bienvenue + question ouverte</td></tr>
<tr><td>Like/commentaire</td><td>24h</td><td>DM referençant le post</td></tr>
</tbody>
</table>
<p><strong>Taux de reponse attendu :</strong> 25-35% (warm) vs 8-15% (cold). Les scripts DM et relances sont dans le <a href="systeme-linkedin-3-couches.html">Systeme LinkedIn 3 Couches</a>.</p>
```

- [ ] **Step 3: Ajouter les KPIs Skaale dans la section 5.5**

Trouver la section 5.5 "Metriques Go-to-Market" (ligne 1042). Apres le tableau de metriques existant, ajouter :

```html
<h4 id="kpis-skaale">KPIs Skaale (systeme 3 couches)</h4>
<table>
<thead><tr><th>Metrique</th><th>J30</th><th>J60</th><th>J90</th></tr></thead>
<tbody>
<tr><td>Taux reponse DM warm</td><td>25%</td><td>30%</td><td>35%</td></tr>
<tr><td>Taux reponse DM cold</td><td>8%</td><td>12%</td><td>15%</td></tr>
<tr><td>Signaux detectes/semaine</td><td>10</td><td>25</td><td>50</td></tr>
<tr><td>Conversion signal &rarr; RDV</td><td>10%</td><td>15%</td><td>20%</td></tr>
</tbody>
</table>
```

- [ ] **Step 4: Verifier le rendu**

Ouvrir le playbook dans le navigateur. Verifier que les 3 ajouts s'integrent visuellement sans casser la mise en page existante.

- [ ] **Step 5: Commit**

```bash
git add docs/strategie/playbook-commercial.html
git commit -m "feat: enrich playbook with Skaale 3-layer system references and KPIs"
```

---

### Task 6: Verifier index.html et manifest.json

**Files:**
- Verify: `docs/index.html`
- Verify: `docs/manifest.json`

Les hooks ont deja ajoute les entrees. On verifie juste que tout est en ordre.

- [ ] **Step 1: Verifier manifest.json**

Executer :

```bash
grep "systeme-linkedin-3-couches" docs/manifest.json
```

Attendu : `"strategie/systeme-linkedin-3-couches.html"` doit apparaitre. Si absent, l'ajouter dans le tableau JSON.

**Note :** Le manifest contient actuellement l'entree dans `superpowers/specs/` (la spec design). Il faut verifier qu'il n'y a pas de confusion — le hub operationnel (`strategie/`) est un fichier different de la spec (`superpowers/specs/`). Si l'entree `strategie/systeme-linkedin-3-couches.html` est absente, l'ajouter.

- [ ] **Step 2: Verifier index.html**

Executer :

```bash
grep "systeme-linkedin-3-couches" docs/index.html
```

Attendu : une entree dans la categorie "Strategie". Si l'entree pointe vers `superpowers/specs/` au lieu de `strategie/`, la corriger.

- [ ] **Step 3: Commit si modifications**

```bash
git add docs/index.html docs/manifest.json
git commit -m "fix: ensure LinkedIn 3-layer hub is in index and manifest"
```

---

### Task 7: Verification finale

- [ ] **Step 1: Verifier tous les liens entre documents**

Ouvrir `systeme-linkedin-3-couches.html` et cliquer sur :
- Lien vers `plan-linkedin.html` — doit ouvrir le plan LinkedIn
- Lien vers `cold-outreach-templates.html` — doit ouvrir les templates
- Lien "Retour" — doit ouvrir l'index

Ouvrir `plan-linkedin.html` et verifier :
- Le lien vers `systeme-linkedin-3-couches.html` dans l'encart Skaale fonctionne

Ouvrir `playbook-commercial.html` et verifier :
- Les liens vers `systeme-linkedin-3-couches.html` fonctionnent

- [ ] **Step 2: Verifier l'index documentaire**

Ouvrir `docs/index.html` dans le navigateur. Verifier que "Systeme LinkedIn 3 Couches" apparait dans la categorie Strategie et que le lien fonctionne.

- [ ] **Step 3: Commit final si necessaire**

Si des corrections ont ete faites :

```bash
git add -A docs/
git commit -m "fix: correct cross-document links for LinkedIn 3-layer system"
```
