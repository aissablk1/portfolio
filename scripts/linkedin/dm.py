"""
LinkedIn DM Launcher — Phase 0

Lit les DM pre-rediges dans dms-btp-prets.md, filtre ceux qui n'ont pas
encore ete envoyes (via dm-log.json), et pour chaque DM :
  1. Affiche un apercu
  2. Copie le message dans le presse-papier (pbcopy)
  3. Ouvre LinkedIn sur la recherche du prospect
  4. Marque le DM comme envoye apres confirmation utilisateur

L'envoi reel reste manuel (LinkedIn Messaging API pas disponible).

Usage:
    python dm.py              # Lance le launcher interactif
    python dm.py --dry-run    # Mode test, aucun effet de bord
    python dm.py --list       # Liste les DM et leur statut
"""

import argparse
import json
import os
import re
import subprocess
import sys
import webbrowser
from datetime import datetime
from pathlib import Path
from urllib.parse import quote_plus

SCRIPT_DIR = Path(__file__).parent
DMS_FILE = SCRIPT_DIR / "dms-btp-prets.md"
LOG_FILE = SCRIPT_DIR / "dm-log.json"
LINKEDIN_SEARCH_URL = "https://www.linkedin.com/search/results/people/?keywords={}"

DM_HEADER_RE = re.compile(r"^## DM (\d+) — (.+?)$", re.MULTILINE)
PARENTHETICAL_RE = re.compile(r"\s*\([^)]*\)\s*$")
CODE_BLOCK_RE = re.compile(r"```\n(.*?)\n```", re.DOTALL)
TRACKER_MARKER = "## Tableau de suivi"


def parse_dms(md_path: Path) -> list[dict]:
    """Parse dms-btp-prets.md et retourne la liste des DM structures."""
    content = md_path.read_text(encoding="utf-8")
    main_part = content.split(TRACKER_MARKER)[0]

    headers = list(DM_HEADER_RE.finditer(main_part))
    dms = []
    for i, match in enumerate(headers):
        dm_id = int(match.group(1))
        prospect = PARENTHETICAL_RE.sub("", match.group(2).strip())
        start = match.end()
        end = headers[i + 1].start() if i + 1 < len(headers) else len(main_part)
        body = main_part[start:end]

        code_match = CODE_BLOCK_RE.search(body)
        if not code_match:
            print(f"⚠ DM {dm_id} ({prospect}) : aucun bloc de code trouve, skip")
            continue

        message = code_match.group(1).strip()
        dms.append({"id": dm_id, "prospect": prospect, "message": message})

    return dms


def load_log(log_path: Path) -> dict:
    if not log_path.exists():
        return {}
    try:
        return json.loads(log_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"⚠ {log_path.name} corrompu ({e}), on repart de zero")
        return {}


def save_log_atomic(log_path: Path, data: dict) -> None:
    """Ecrit le log via tempfile + rename pour eviter la corruption."""
    tmp = log_path.with_suffix(".json.tmp")
    tmp.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    os.replace(tmp, log_path)


def copy_to_clipboard(text: str) -> bool:
    try:
        subprocess.run(
            ["pbcopy"],
            input=text.encode("utf-8"),
            check=True,
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def open_linkedin_search(prospect: str) -> bool:
    url = LINKEDIN_SEARCH_URL.format(quote_plus(prospect))
    try:
        return webbrowser.open(url)
    except Exception as e:  # noqa: BLE001
        print(f"⚠ Ouverture navigateur echouee : {e}")
        print(f"  Ouvre manuellement : {url}")
        return False


def preview_message(message: str, max_lines: int = 10) -> str:
    lines = message.split("\n")
    head = "\n".join(lines[:max_lines])
    if len(lines) > max_lines:
        head += f"\n... (+{len(lines) - max_lines} lignes)"
    return head


def list_dms(dms: list[dict], log: dict) -> None:
    print(f"\n{len(dms)} DM dans dms-btp-prets.md\n")
    for dm in dms:
        key = str(dm["id"])
        if key in log:
            sent_at = log[key].get("sent_at", "?")
            status = f"✓ envoye le {sent_at}"
        else:
            status = "⧖ en attente"
        print(f"  DM {dm['id']:>2} — {dm['prospect']:<35} {status}")
    print()


SENT = "sent"
SKIPPED = "skipped"
QUIT = "quit"


def process_dm(dm: dict, dry_run: bool) -> str:
    """Retourne SENT, SKIPPED ou QUIT."""
    print(f"\n── DM {dm['id']} — {dm['prospect']} ──")
    print(preview_message(dm["message"]))
    print()

    try:
        choice = input("[E]nvoyer / [S]kip / [Q]uit ? ").strip().lower()
    except EOFError:
        return QUIT

    if choice == "q":
        return QUIT
    if choice in ("s", ""):
        print("Skippe.")
        return SKIPPED
    if choice != "e":
        print("Choix non reconnu, skip.")
        return SKIPPED

    if dry_run:
        print(f"[DRY-RUN] Copierait {len(dm['message'])} caracteres dans le presse-papier")
        print(f"[DRY-RUN] Ouvrirait {LINKEDIN_SEARCH_URL.format(quote_plus(dm['prospect']))}")
        print("[DRY-RUN] Pas de log mis a jour")
        return SKIPPED

    if copy_to_clipboard(dm["message"]):
        print("✓ Message copie dans le presse-papier (Cmd+V dans LinkedIn)")
    else:
        print("⚠ pbcopy indisponible, copie le message ci-dessous a la main :")
        print("─" * 60)
        print(dm["message"])
        print("─" * 60)

    open_linkedin_search(dm["prospect"])
    print(f"✓ LinkedIn ouvert : recherche '{dm['prospect']}'")
    print()

    try:
        input("→ Quand tu as envoye le DM, appuie sur Entree (Ctrl+C pour annuler ce DM)...")
    except KeyboardInterrupt:
        print("\n⚠ DM non marque comme envoye")
        return SKIPPED

    return SENT


def run(dry_run: bool) -> int:
    if not DMS_FILE.exists():
        print(f"✗ {DMS_FILE} introuvable")
        return 1

    dms = parse_dms(DMS_FILE)
    if not dms:
        print(f"✗ Aucun DM parse depuis {DMS_FILE.name}")
        return 1

    log = load_log(LOG_FILE)
    unsent = [d for d in dms if str(d["id"]) not in log]

    if not unsent:
        print("✓ Tous les DM sont deja envoyes. Rien a faire.")
        return 0

    print(f"{len(unsent)} DM a envoyer sur {len(dms)} total")
    if dry_run:
        print("[DRY-RUN mode actif — aucun effet de bord]")

    sent_count = 0
    quit_early = False
    try:
        for dm in unsent:
            result = process_dm(dm, dry_run=dry_run)
            if result == QUIT:
                quit_early = True
                break
            if result == SENT:
                log[str(dm["id"])] = {
                    "prospect": dm["prospect"],
                    "sent_at": datetime.now().isoformat(timespec="seconds"),
                }
                save_log_atomic(LOG_FILE, log)
                print(f"✓ DM {dm['id']} marque comme envoye")
                sent_count += 1
    except KeyboardInterrupt:
        print("\n── Ctrl+C detecte, arret ──")

    remaining = len(unsent) - sent_count
    suffix = " (arret anticipe)" if quit_early else ""
    print(f"\n── Fin : {sent_count} envoyes, {remaining} restants{suffix} ──")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Launcher LinkedIn DM — phase 0",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Mode test : pas de clipboard, pas d'ouverture navigateur, pas de log",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="Liste les DM et leur statut, puis quitte",
    )
    args = parser.parse_args()

    if args.list:
        if not DMS_FILE.exists():
            print(f"✗ {DMS_FILE} introuvable")
            return 1
        dms = parse_dms(DMS_FILE)
        log = load_log(LOG_FILE)
        list_dms(dms, log)
        return 0

    return run(dry_run=args.dry_run)


if __name__ == "__main__":
    sys.exit(main())
