"""
LinkedIn Post Scheduler
Programme la publication automatique des 3 posts selon le calendrier.

Calendrier prevu :
  - Post 1 (storytelling BTP)  : 5 avril 2026 a 8h30
  - Post 2 (verite/transparence) : 10 avril 2026 a 8h30
  - Post 3 (educatif)           : 14 avril 2026 a 8h30

Usage:
    python scheduler.py              # Lancer le scheduler (tourne en continu)
    python scheduler.py --dry-run    # Voir ce qui serait publie sans publier
    python scheduler.py --cron       # Generer la commande crontab equivalente
"""

import os
import sys
import json
import argparse
from datetime import datetime

from dotenv import load_dotenv

load_dotenv()

# Calendrier de publication
SCHEDULE = [
    {"post_id": 1, "date": "2026-04-05", "time": "08:30", "label": "Storytelling BTP"},
    {"post_id": 2, "date": "2026-04-10", "time": "08:30", "label": "Post verite"},
    {"post_id": 3, "date": "2026-04-14", "time": "08:30", "label": "Post educatif"},
]

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(SCRIPT_DIR, "publications.json")


def is_already_published(post_id):
    if not os.path.exists(LOG_FILE):
        return False
    with open(LOG_FILE, "r") as f:
        logs = json.load(f)
    return any(log["post_id"] == post_id for log in logs)


def show_schedule():
    print("\n=== Calendrier de publication LinkedIn ===\n")
    now = datetime.now()
    for entry in SCHEDULE:
        scheduled = datetime.strptime(f"{entry['date']} {entry['time']}", "%Y-%m-%d %H:%M")
        published = is_already_published(entry["post_id"])

        if published:
            status = "PUBLIE"
        elif scheduled <= now:
            status = "EN RETARD"
        else:
            delta = scheduled - now
            status = f"dans {delta.days}j {delta.seconds // 3600}h"

        print(f"  Post #{entry['post_id']} — {entry['label']}")
        print(f"    Date : {entry['date']} a {entry['time']}")
        print(f"    Statut : {status}")
        print()


def generate_cron():
    """Genere les commandes crontab pour publier automatiquement."""
    python_path = sys.executable
    post_script = os.path.join(SCRIPT_DIR, "post.py")

    print("\n=== Commandes crontab ===\n")
    print("Ajoute ces lignes avec 'crontab -e' :\n")

    for entry in SCHEDULE:
        date = datetime.strptime(entry["date"], "%Y-%m-%d")
        hour, minute = entry["time"].split(":")
        # cron: minute heure jour mois *
        cron_line = (
            f"{minute} {hour} {date.day} {date.month} * "
            f"cd {SCRIPT_DIR} && {python_path} {post_script} --post {entry['post_id']} --auto-confirm"
        )
        print(f"# Post #{entry['post_id']} — {entry['label']} ({entry['date']})")
        print(cron_line)
        print()

    print("Ou utilise launchd (macOS) pour plus de fiabilite.")


def run_scheduler():
    """Verifie si un post doit etre publie maintenant."""
    import time

    print("=== LinkedIn Scheduler actif ===")
    print("Verification toutes les 5 minutes.\n")
    show_schedule()

    while True:
        now = datetime.now()

        for entry in SCHEDULE:
            if is_already_published(entry["post_id"]):
                continue

            scheduled = datetime.strptime(
                f"{entry['date']} {entry['time']}", "%Y-%m-%d %H:%M"
            )

            # Fenetre de 10 minutes autour de l'heure prevue
            diff_minutes = (now - scheduled).total_seconds() / 60
            if 0 <= diff_minutes <= 10:
                print(f"\n[{now.strftime('%H:%M')}] Publication du post #{entry['post_id']}...")

                # Import et publication
                from post import publish_post, add_comment, log_publication, POSTS

                post = next(p for p in POSTS if p["id"] == entry["post_id"])
                result = publish_post(post["content"])

                if result["success"]:
                    print(f"  Post #{entry['post_id']} publie : {result['post_id']}")
                    if post.get("comment_link"):
                        add_comment(result["post_id"], f"Le lien : {post['comment_link']}")
                    log_publication(post, result["post_id"])
                else:
                    print(f"  Erreur : {result['error']}")

        time.sleep(300)  # 5 minutes


def main():
    parser = argparse.ArgumentParser(description="Scheduler LinkedIn")
    parser.add_argument("--dry-run", action="store_true", help="Voir le calendrier sans publier")
    parser.add_argument("--cron", action="store_true", help="Generer les commandes crontab")
    args = parser.parse_args()

    if args.dry_run:
        show_schedule()
    elif args.cron:
        generate_cron()
    else:
        run_scheduler()


if __name__ == "__main__":
    main()
