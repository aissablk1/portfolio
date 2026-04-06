# LinkedIn Automation — Posts API

Publie automatiquement les posts LinkedIn via l'API officielle.

## Setup (une seule fois)

### 1. Creer l'app LinkedIn Developer

1. Va sur https://www.linkedin.com/developers/apps/new
2. Remplis les champs (nom, page LinkedIn, logo)
3. Note le **Client ID** et **Client Secret**
4. Dans **Products** : active "Share on LinkedIn" + "Sign In with LinkedIn using OpenID Connect"
5. Dans **Auth** : ajoute `http://localhost:8888/callback` comme Redirect URL

### 2. Configurer

```bash
cd scripts/linkedin
cp .env.example .env
# Remplis LINKEDIN_CLIENT_ID et LINKEDIN_CLIENT_SECRET
```

### 3. Installer les dependances

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 4. S'authentifier

```bash
python auth.py
# Le navigateur s'ouvre, tu autorises, le token est sauvegarde automatiquement
```

## Utilisation

### Publier un post

```bash
python post.py              # Menu interactif
python post.py --list        # Voir les posts disponibles
python post.py --preview 1   # Apercu du post #1
python post.py --post 1      # Publier le post #1
```

### Programmer les publications

```bash
python scheduler.py              # Scheduler actif (tourne en continu)
python scheduler.py --dry-run    # Voir le calendrier
python scheduler.py --cron       # Generer les commandes crontab
```

## Calendrier prevu

| Post | Date | Contenu |
|------|------|---------|
| #1 | 5 avril 2026, 8h30 | Storytelling BTP/plombier |
| #2 | 10 avril 2026, 8h30 | Post verite/transparence |
| #3 | 14 avril 2026, 8h30 | Post educatif (3 signaux site mort) |

## Fichiers

- `auth.py` — OAuth 2.0 (a lancer une fois, token valide 60 jours)
- `post.py` — Publication des posts (menu interactif ou CLI)
- `scheduler.py` — Programmation automatique des publications
- `publications.json` — Log des publications (cree automatiquement)
- `.env` — Credentials (ne pas committer)

## Limitations

- **Posts texte uniquement** (pas d'images/videos via ce script)
- **Token expire apres 60 jours** — relancer `auth.py`
- **DMs non supportes** — l'API LinkedIn ne permet pas l'envoi de DMs pour les apps standard
