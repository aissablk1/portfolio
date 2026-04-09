#!/usr/bin/env python3
"""
Systeme de suivi prospection CDS — Relances J+3 / J+7 / J+14.

Commandes :
  python follow-up.py              Relances du jour
  python follow-up.py --add        Ajouter un prospect
  python follow-up.py --status ID STATUS
  python follow-up.py --list       Tous les prospects par statut
  python follow-up.py --stats      Funnel de conversion
  python follow-up.py --import-html  Importer depuis prospects-btp-tarn.html
"""

import argparse
import json
import os
import re
import uuid
from datetime import datetime, date
from html.parser import HTMLParser
from pathlib import Path

from templates import relance_j3, relance_j7, relance_j14

SCRIPT_DIR = Path(__file__).resolve().parent
PROSPECTS_FILE = SCRIPT_DIR / "prospects.json"
HTML_FILE = SCRIPT_DIR.parent.parent / "docs" / "prospection" / "prospects-btp-tarn.html"

STATUTS = [
    "a_contacter",
    "dm_envoye",
    "relance_j3",
    "relance_j7",
    "relance_j14",
    "rdv_pris",
    "pas_interesse",
    "pas_de_reponse",
]

RELANCE_CHAIN = {
    "dm_envoye": {"jours": 3, "next": "relance_j3", "template": relance_j3, "label": "J+3"},
    "relance_j3": {"jours": 7, "next": "relance_j7", "template": relance_j7, "label": "J+7"},
    "relance_j7": {"jours": 14, "next": "relance_j14", "template": relance_j14, "label": "J+14"},
}


# ---------------------------------------------------------------------------
# Persistence
# ---------------------------------------------------------------------------

def load_prospects() -> list:
    if not PROSPECTS_FILE.exists():
        return []
    with open(PROSPECTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_prospects(prospects: list) -> None:
    with open(PROSPECTS_FILE, "w", encoding="utf-8") as f:
        json.dump(prospects, f, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
# HTML import parser
# ---------------------------------------------------------------------------

class BTProspectsParser(HTMLParser):
    """Parse le JavaScript PROSPECTS = [...] dans le HTML BTP."""

    def __init__(self):
        super().__init__()
        self._in_script = False
        self._script_data = ""

    def handle_starttag(self, tag, attrs):
        if tag == "script":
            self._in_script = True
            self._script_data = ""

    def handle_endtag(self, tag):
        if tag == "script":
            self._in_script = False

    def handle_data(self, data):
        if self._in_script:
            self._script_data += data

    def get_prospects(self) -> list:
        """Extrait les objets du tableau JS PROSPECTS."""
        match = re.search(
            r"var\s+PROSPECTS\s*=\s*\[(.*?)\];",
            self._script_data,
            re.DOTALL,
        )
        if not match:
            return []

        raw = match.group(1)
        results = []

        # Chaque objet { ... }
        for obj_match in re.finditer(r"\{([^}]+)\}", raw):
            block = obj_match.group(1)
            entry = {}
            for field in re.finditer(
                r'(\w+)\s*:\s*(?:"([^"]*)"|\'([^\']*)\'|null|([\w.]+))',
                block,
            ):
                key = field.group(1)
                val = field.group(2) or field.group(3) or field.group(4)
                if val == "null":
                    val = None
                entry[key] = val
            if entry.get("entreprise"):
                results.append(entry)

        return results


def import_html():
    """Importe les prospects BTP depuis le fichier HTML."""
    if not HTML_FILE.exists():
        print(f"Fichier introuvable : {HTML_FILE}")
        return

    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    parser = BTProspectsParser()
    parser.feed(html)
    raw_prospects = parser.get_prospects()

    if not raw_prospects:
        print("Aucun prospect trouve dans le HTML.")
        return

    existing = load_prospects()
    existing_names = {p["entreprise"].lower() for p in existing}
    added = 0

    for raw in raw_prospects:
        name = raw.get("entreprise", "").strip()
        if name.lower() in existing_names:
            continue

        prospect = {
            "id": uuid.uuid4().hex[:8],
            "nom": "",
            "entreprise": name,
            "ville": raw.get("ville", ""),
            "niche": "BTP",
            "canal": "linkedin",
            "statut": "a_contacter",
            "priorite": raw.get("priorite", ""),
            "activite": raw.get("activite", ""),
            "site": raw.get("site"),
            "linkedin": raw.get("linkedin"),
            "notes": "",
            "premier_dm": None,
            "date_ajout": date.today().isoformat(),
        }
        existing.append(prospect)
        existing_names.add(name.lower())
        added += 1

    save_prospects(existing)
    print(f"{added} prospects BTP importes ({len(existing)} total).")


# ---------------------------------------------------------------------------
# Add prospect
# ---------------------------------------------------------------------------

def add_prospect():
    """Ajout interactif d'un prospect."""
    print("\n--- Nouveau prospect ---\n")
    nom = input("Nom du contact       : ").strip()
    entreprise = input("Entreprise           : ").strip()
    ville = input("Ville                : ").strip()
    niche = input("Niche (BTP/Immobilier/Restaurant/Comptable/Commerce) : ").strip()
    canal = input("Canal (linkedin/email/telephone) : ").strip() or "linkedin"
    notes = input("Notes                : ").strip()

    if not entreprise:
        print("Entreprise obligatoire. Abandon.")
        return

    prospect = {
        "id": uuid.uuid4().hex[:8],
        "nom": nom,
        "entreprise": entreprise,
        "ville": ville,
        "niche": niche,
        "canal": canal,
        "statut": "a_contacter",
        "priorite": "",
        "activite": "",
        "site": None,
        "linkedin": None,
        "notes": notes,
        "premier_dm": None,
        "date_ajout": date.today().isoformat(),
    }

    prospects = load_prospects()
    prospects.append(prospect)
    save_prospects(prospects)
    print(f"\nProspect ajoute : {entreprise} [{prospect['id']}]")


# ---------------------------------------------------------------------------
# Update status
# ---------------------------------------------------------------------------

def update_status(prospect_id: str, new_status: str):
    """Met a jour le statut d'un prospect."""
    if new_status not in STATUTS:
        print(f"Statut invalide. Valeurs possibles : {', '.join(STATUTS)}")
        return

    prospects = load_prospects()
    found = False

    for p in prospects:
        if p["id"] == prospect_id:
            old = p["statut"]
            p["statut"] = new_status
            if new_status == "dm_envoye" and not p.get("premier_dm"):
                p["premier_dm"] = date.today().isoformat()
            found = True
            print(f"{p['entreprise']} : {old} -> {new_status}")
            break

    if not found:
        print(f"Prospect introuvable : {prospect_id}")
        return

    save_prospects(prospects)


# ---------------------------------------------------------------------------
# List prospects
# ---------------------------------------------------------------------------

def list_prospects():
    """Affiche tous les prospects groupes par statut."""
    prospects = load_prospects()

    if not prospects:
        print("Aucun prospect enregistre.")
        return

    by_status = {}
    for p in prospects:
        by_status.setdefault(p["statut"], []).append(p)

    for statut in STATUTS:
        group = by_status.get(statut, [])
        if not group:
            continue
        print(f"\n{'=' * 50}")
        print(f"  {statut.upper().replace('_', ' ')}  ({len(group)})")
        print(f"{'=' * 50}")
        for p in group:
            ville = f" — {p['ville']}" if p.get("ville") else ""
            dm = f" | DM: {p['premier_dm']}" if p.get("premier_dm") else ""
            print(f"  [{p['id']}] {p['entreprise']}{ville}{dm}")


# ---------------------------------------------------------------------------
# Stats
# ---------------------------------------------------------------------------

def show_stats():
    """Affiche les stats du funnel de prospection."""
    prospects = load_prospects()
    total = len(prospects)

    if total == 0:
        print("Aucun prospect enregistre.")
        return

    counts = {}
    for p in prospects:
        counts[p["statut"]] = counts.get(p["statut"], 0) + 1

    print(f"\n{'=' * 44}")
    print(f"  FUNNEL PROSPECTION — {total} prospects")
    print(f"{'=' * 44}\n")

    for statut in STATUTS:
        n = counts.get(statut, 0)
        if n == 0 and statut not in ("a_contacter", "dm_envoye", "rdv_pris"):
            continue
        pct = (n / total * 100) if total else 0
        bar = "#" * int(pct / 2)
        label = statut.replace("_", " ").capitalize()
        print(f"  {label:<20s} {n:>3d}  ({pct:5.1f}%)  {bar}")

    contacted = sum(
        counts.get(s, 0)
        for s in STATUTS
        if s != "a_contacter"
    )
    rdv = counts.get("rdv_pris", 0)
    print(f"\n  Contactes : {contacted}/{total}")
    if contacted > 0:
        print(f"  Taux RDV  : {rdv}/{contacted} ({rdv / contacted * 100:.1f}%)")


# ---------------------------------------------------------------------------
# Follow-ups du jour
# ---------------------------------------------------------------------------

def show_followups():
    """Affiche les relances a faire aujourd'hui."""
    prospects = load_prospects()
    today = date.today()
    pending = []

    for p in prospects:
        if p["statut"] not in RELANCE_CHAIN:
            continue
        if not p.get("premier_dm"):
            continue

        dm_date = date.fromisoformat(p["premier_dm"])
        rule = RELANCE_CHAIN[p["statut"]]
        delta = (today - dm_date).days

        if delta >= rule["jours"]:
            pending.append((p, rule))

    if not pending:
        print("\nAucune relance a faire aujourd'hui.")
        total_active = sum(
            1 for p in prospects
            if p["statut"] in ("dm_envoye", "relance_j3", "relance_j7")
        )
        print(f"Prospects en suivi actif : {total_active}")
        return

    print(f"\n{'=' * 50}")
    print(f"  RELANCES DU JOUR — {today.isoformat()}")
    print(f"  {len(pending)} relance(s) a envoyer")
    print(f"{'=' * 50}")

    modified = False

    for p, rule in pending:
        dm_date = date.fromisoformat(p["premier_dm"])
        delta = (today - dm_date).days

        print(f"\n{'─' * 50}")
        print(f"  {rule['label']} | {p['entreprise']} ({p.get('ville', '')})")
        print(f"  Niche: {p.get('niche', 'N/A')} | Canal: {p.get('canal', 'N/A')}")
        print(f"  DM envoye le {p['premier_dm']} (il y a {delta} jours)")
        if p.get("notes"):
            print(f"  Notes: {p['notes']}")
        print(f"{'─' * 50}")

        message = rule["template"](p)
        print(f"\n{message}\n")

        reponse = input(f"Relance envoyee ? (o/n) : ").strip().lower()
        if reponse == "o":
            p["statut"] = rule["next"]
            print(f"  -> Statut mis a jour : {rule['next']}")
            modified = True
        else:
            print(f"  -> Statut inchange : {p['statut']}")

    if modified:
        save_prospects(prospects)
        print("\nProspects sauvegardes.")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Suivi prospection CDS — relances J+3/J+7/J+14"
    )
    parser.add_argument("--add", action="store_true", help="Ajouter un prospect")
    parser.add_argument(
        "--status",
        nargs=2,
        metavar=("ID", "STATUT"),
        help="Mettre a jour le statut d'un prospect",
    )
    parser.add_argument("--list", action="store_true", help="Lister tous les prospects")
    parser.add_argument("--stats", action="store_true", help="Stats du funnel")
    parser.add_argument(
        "--import-html",
        action="store_true",
        help="Importer les prospects BTP depuis le HTML",
    )

    args = parser.parse_args()

    if args.add:
        add_prospect()
    elif args.status:
        update_status(args.status[0], args.status[1])
    elif args.list:
        list_prospects()
    elif args.stats:
        show_stats()
    elif args.import_html:
        import_html()
    else:
        show_followups()


if __name__ == "__main__":
    main()
