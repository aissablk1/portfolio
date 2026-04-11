# LinkedIn DM Launcher — Design

**Date :** 2026-04-11
**Auteur :** Aïssa + Claude
**Statut :** Brainstormé, en attente de validation user pour passage au plan d'implémentation

## Contexte

Aïssa a rédigé 6 DM LinkedIn B2B ciblés (artisans BTP de l'Albigeois) le 5 avril 2026 dans `scripts/linkedin/dms-btp-prets.md`. Aucun n'a été envoyé 6 jours plus tard. Le blocage n'est ni éditorial (les messages sont écrits), ni technique (aucun outil manquant au sens strict) : c'est la friction psychologique d'appuyer sur Envoyer, amplifiée par un perfectionnisme d'ingénieur qui cherche à automatiser ce qui ne devrait pas l'être.

L'objectif de ce design est donc **volontairement non-ambitieux** : réduire la friction opérationnelle autour de l'envoi (ouverture de LinkedIn, copie-collage, tracking) sans remplacer l'acte humain d'appuyer sur Envoyer — qui reste le seul levier qui compte.

## Contrainte majeure

**LinkedIn ne permet pas l'envoi de DM via API publique.** Le Messaging API est réservé aux partenaires Talent Solutions / Sales Navigator. Les alternatives (Phantombuster, Linked Helper, Dux-Soup) violent les ToS LinkedIn et exposent le compte à un bannissement. Pour 6 prospects, c'est déraisonnable.

**Conséquence :** l'automatisation ne peut être que partielle. L'outil assiste l'envoi, il ne l'exécute pas.

## Objectifs

1. **Phase 0 (ship immédiat)** : permettre l'envoi des 6 DM existants en ~5 minutes, avec tracking automatique de la date d'envoi dans le fichier source.
2. **Phase 1** : ajouter une génération de 2 variantes par DM via Claude API (original + court + angle différent) pour donner une vraie valeur éditoriale — pas pour perfectionner indéfiniment.
3. **Phase 2** : découpler la génération et l'envoi en deux sous-commandes distinctes, pour permettre une revue éditoriale différée.

## Non-objectifs (YAGNI)

- Pas de scoring ou de sélection automatique de prospects
- Pas de recherche auto du profil LinkedIn (URN) via API
- Pas de génération automatique de relances J+3 / J+7
- Pas de dashboard, de stats ou de rapport
- Pas de retry automatique sur erreur API
- Pas de support d'autres plateformes (Twitter, email) dans ce scope
- Pas de tests unitaires sur `pbcopy` / `webbrowser` (side-effects testés manuellement via `--dry-run`)

## Architecture

### Stack et dépendances

- **Langage** : Python 3 (cohérence avec `post.py`, `scheduler.py`, `auth.py` existants)
- **Environnement** : `scripts/linkedin/.venv` existant, même pattern `.env` + `python-dotenv`
- **Phase 0 : zéro nouvelle dépendance.** Utilise `pbcopy` natif macOS via `subprocess`, `webbrowser` stdlib, `argparse` stdlib, parsing `.md` maison.
- **Phases 1+2** : ajout de `anthropic>=0.40.0` dans `requirements.txt` et `ANTHROPIC_API_KEY` dans `scripts/linkedin/.env`.

### Fichiers

```
scripts/linkedin/
├── auth.py                      (existant, inchangé)
├── post.py                      (existant, inchangé)
├── scheduler.py                 (existant, inchangé)
├── dm.py                        (NOUVEAU — CLI principal, ~250 lignes au total)
├── claude_variants.py           (NOUVEAU, phases 1+2 — module isolé, ~80 lignes)
├── dms-btp-prets.md             (existant — source de vérité + tracker)
├── dms-btp-variantes.md         (NOUVEAU, phase 2 — gitignored)
├── .dm-variants-cache.json      (NOUVEAU, phase 1+2 — gitignored)
├── .env                         (+ ANTHROPIC_API_KEY pour phases 1+2)
└── requirements.txt             (+ anthropic pour phases 1+2)
```

### Module `claude_variants.py`

Interface publique minimale :

```python
def generate_variants(original: str) -> list[str]:
    """
    Génère 2 variantes à partir d'un DM original.
    Retourne [V2_court, V3_angle_different].
    V1 (l'original) est géré par l'appelant, pas par ce module.
    Cache basé sur SHA1 du message original.
    Raise AnthropicAPIError si ANTHROPIC_API_KEY absent ou appel échoue.
    """
```

**Prompt Claude utilisé** (modèle `claude-sonnet-4-6`, ~1500 tokens total) :

> Voici un DM LinkedIn B2B rédigé pour un artisan BTP français. Génère exactement 2 variantes, dans cet ordre :
> - **V2 — Version courte** : ~50% de la longueur de l'original, même structure (accroche → question → preuve DK Building → proposition 15 min), ton plus direct.
> - **V3 — Angle pain point** : même longueur que l'original, mais attaque par un pain point explicite du métier du prospect au lieu d'une observation neutre.
>
> Contraintes strictes : ton direct, pas de superlatifs, pas d'emoji, pas de formule "j'espère que vous allez bien", signature "Aïssa" à la fin. Français uniquement. Retourne JSON `{"v2": "...", "v3": "..."}`.

Module **testable en isolation** : fonction pure (string → list[string]) dépendant uniquement de l'API Anthropic. `dm.py` l'importe sans connaître ses internals.

### Module `dm.py` — CLI

Sous-commandes `argparse` :

| Commande | Comportement | Phase |
|---|---|---|
| `python dm.py` | Interactif, parse `dms-btp-prets.md`, affiche les DM non envoyés, launcher par prospect | 0 |
| `python dm.py --variants` | Interactif + génération Claude avant chaque launcher | 1 |
| `python dm.py generate` | Génère uniquement → écrit `dms-btp-variantes.md`, pas de launcher | 2 |
| `python dm.py launch` | Lit `dms-btp-variantes.md`, envoie les variantes cochées `[x]` | 2 |
| `python dm.py --dry-run` | Désactive `pbcopy` + `webbrowser.open` + écriture `.md` pour tests manuels | 0, 1, 2 |

## Flux détaillé

### Phase 0 — Launcher seul (priorité absolue)

```
1. parse dms-btp-prets.md → [{id, nom, message, date_envoye}]
2. filtre DM non envoyés (date_envoye vide)
3. pour chaque DM non envoyé :
   a. affiche preview (10 premières lignes du message)
   b. prompt interactif : [E]nvoyer / [S]kip / [Q]uit
   c. si [E] :
      - pbcopy(message)
      - webbrowser.open("https://www.linkedin.com/search/results/people/?keywords=" + url_encode(nom))
      - prompt : "Message envoyé ? Appuie sur Entrée pour marquer comme envoyé, Ctrl+C pour annuler."
      - écrit date du jour dans la colonne "Date envoi" du .md (écriture atomique via tempfile + os.rename)
   d. passe au DM suivant
4. fin : affiche récap ("3 DM envoyés, 3 skippés")
```

### Phase 1 — Flux linéaire avec génération

Remplace l'étape (3.a) ci-dessus par :

```
a. appel claude_variants.generate_variants(message_original)
b. affiche V1 (original), V2 (court), V3 (angle différent)
c. prompt : [1/2/3] pour choisir variante / [E]dit pour retoucher / [S]kip / [Q]uit
d. si [E], ouvre $EDITOR avec la variante sélectionnée préchargée
e. variante finale → pbcopy → open LinkedIn → confirmation → update .md
```

Cache SHA1 évite de re-appeler Claude sur le même message entre deux runs.

### Phase 2 — Découplage generate/launch

**`generate`** :
- Parse `dms-btp-prets.md` (DM non envoyés uniquement)
- Pour chaque : génère V2 + V3 via `claude_variants`
- Écrit `dms-btp-variantes.md` avec sections par DM, format Markdown :

```markdown
## DM 1 — Vaysse Stefan Plomberie

### [ ] V1 — Original
[contenu]

### [ ] V2 — Court
[contenu]

### [ ] V3 — Angle pain point
[contenu]
```

- Affiche : "Ouvre `dms-btp-variantes.md`, coche une variante par DM (`[ ]` → `[x]`), puis lance `python dm.py launch`."

**`launch`** :
- Parse `dms-btp-variantes.md`
- Vérifie : exactement une variante cochée `[x]` par DM
- Pour chaque DM avec variante cochée : pbcopy → open LinkedIn → confirmation → update `dms-btp-prets.md`

## Gestion d'erreurs

| Cas | Comportement |
|---|---|
| `dms-btp-prets.md` introuvable | Message explicite + exit 1 |
| Tous les DM déjà envoyés (filtre vide) | Affiche "Tous les DM sont déjà envoyés. Rien à faire." + exit 0 |
| Parsing `.md` échoue sur un DM | Warning, skip ce DM, continue |
| `pbcopy` indisponible ou échoue | Fallback : affiche le message en clair dans le terminal, l'utilisateur copie à la main |
| `webbrowser.open()` échoue | Affiche l'URL à ouvrir manuellement |
| `Ctrl+C` entre deux DM | Exit propre, pas de corruption du `.md` (écriture atomique tempfile+rename) |
| `ANTHROPIC_API_KEY` absent + `--variants` passé | Erreur explicite avec lien vers `https://console.anthropic.com/`, exit 1 |
| Plus d'une variante cochée `[x]` sur un DM (phase 2 launch) | Liste les DM ambigus, exit 1 |
| Aucune variante cochée sur un DM (phase 2 launch) | Warning, skip ce DM, continue |
| Erreur API Claude (rate limit, réseau) | Affiche l'erreur, skip le DM, continue le flux (pas de retry auto) |

## Stratégie de test

**Règle projet : données réelles uniquement, zéro mock.**

- Test d'intégration unique : parse le vrai `scripts/linkedin/dms-btp-prets.md`, vérifie que 6 DM sont trouvés avec les bons champs (id, nom, longueur message > 100).
- Side-effects (`pbcopy`, `webbrowser.open`, écriture fichier) : testés manuellement via `--dry-run`.
- Phase 1 : `claude_variants.generate_variants()` testé avec un vrai appel API sur un message court (~50 tokens), vérifie qu'on reçoit exactement 2 variantes non vides, différentes de l'original.
- Pas de tests unitaires sur les exits / prompts interactifs.

## Estimation coût API (phases 1+2)

- 6 DM × ~500 tokens input + ~800 tokens output par DM
- Prix Claude Sonnet 4.6 : $3/M input, $15/M output
- **Coût par passage complet : ~0.06 €**
- Cache SHA1 → coût nul sur relances identiques

## Stratégie d'implémentation

**Ordre strict, un commit par phase, validation en conditions réelles entre chaque phase :**

1. **Phase 0** — implémentation + commit + utilisation réelle par Aïssa pour envoyer les 6 DM existants. **Validation = les 6 DM sont envoyés et la colonne "Date envoi" du `.md` est bien remplie.**
2. **Phase 1** — seulement si Phase 0 validée en usage. Ajout `--variants` + `claude_variants.py` + dépendance `anthropic` + setup `ANTHROPIC_API_KEY`.
3. **Phase 2** — seulement si Phase 1 validée. Ajout sous-commandes `generate` / `launch`.

Chaque phase doit pouvoir vivre seule. Si Phase 0 suffit à débloquer l'envoi (hypothèse forte), Phases 1 et 2 deviennent optionnelles — ce qui est le résultat souhaité, pas un échec.

## Références

- `scripts/linkedin/post.py` — pattern CLI existant à suivre (argparse, load_dotenv, dictionnaire de contenu en tête de fichier)
- `scripts/linkedin/dms-btp-prets.md` — source de vérité existante (6 DM rédigés le 5 avril 2026)
- Mémoire persistante : `reference_linkedin_api.md` — token OAuth dans `scripts/linkedin/.env`, pièges URN déjà résolus
