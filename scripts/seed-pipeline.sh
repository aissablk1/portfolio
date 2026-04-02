#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# seed-pipeline.sh — Seed pipeline avec les 10 prospects + Alexandre
# Usage: ./scripts/seed-pipeline.sh
# Nécessite: curl, jq
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# ── Config ───────────────────────────────────────────────────
API_BASE="${API_BASE:-https://api-aissabelkoussa.onrender.com}"
ADMIN_USER="${ADMIN_USER:-aissa}"
echo -n "Mot de passe admin: "
read -s ADMIN_PASS
echo ""

# ── Login ────────────────────────────────────────────────────
echo "🔐 Connexion à l'API..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_BASE}/api/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"${ADMIN_USER}\", \"password\": \"${ADMIN_PASS}\"}" \
  -c /tmp/pipeline-cookies.txt)

if echo "$LOGIN_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ Connecté"
else
  echo "❌ Échec de connexion: $LOGIN_RESPONSE"
  exit 1
fi

# ── Fonction pour créer un deal ──────────────────────────────
create_deal() {
  local name="$1" email="$2" company="$3" niche="$4" plan="$5" value="$6" source="$7" notes="$8"

  RESPONSE=$(curl -s -X POST "${API_BASE}/api/admin/pipeline" \
    -H "Content-Type: application/json" \
    -b /tmp/pipeline-cookies.txt \
    -d "{
      \"name\": \"${name}\",
      \"email\": \"${email}\",
      \"company\": \"${company}\",
      \"niche\": \"${niche}\",
      \"plan\": \"${plan}\",
      \"value\": ${value},
      \"source\": \"${source}\",
      \"notes\": \"${notes}\",
      \"stage\": \"lead\"
    }")

  if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    local deal_id=$(echo "$RESPONSE" | jq -r '.data.id')
    echo "  ✅ ${name} (${company}) — ${value}€ — ID: ${deal_id}"
  else
    echo "  ❌ ${name}: $RESPONSE"
  fi
}

# ── Seed BTP / Artisans ──────────────────────────────────────
echo ""
echo "🏗️  Niche BTP / Artisans"
echo "─────────────────────────"

create_deal \
  "Stefan Vaysse" "" "Vaysse Stefan Plomberie" "btp" "accelerateur" 2900 "cold_email" \
  "Puygouzon. Plomberie chauffage clim. Site basique, pas de RDV/devis en ligne. Prospect cold outreach."

create_deal \
  "Christophe Massiau" "" "Plomberie Massiau" "btp" "accelerateur" 2900 "cold_email" \
  "Albi. Plomberie dépannage urgence. Aucune fonctionnalité digitale. Formulaire urgence + RDV."

create_deal \
  "Dirigeant SOLESBAT" "" "SOLESBAT SAS" "btp" "accelerateur" 2900 "cold_email" \
  "Albi. Maçonnerie gros œuvre 6-9 salariés. Site vitrine, pas de devis en ligne. Multi-corps de métier."

create_deal \
  "Dirigeant SG ELEC" "" "SG ELEC" "btp" "accelerateur" 2900 "cold_email" \
  "Dénat/Albi. Électricité photovoltaïque. Forte demande PV, pas de tunnel qualification."

create_deal \
  "Dirigeant LMA" "" "La Menuiserie Albigeoise" "btp" "partenaire" 6900 "cold_email" \
  "Lescure-d'Albigeois. Menuiserie 10-19 salariés, 20 ans. Pas de configurateur devis."

create_deal \
  "Dirigeant Favero" "" "Favero Menuiserie" "btp" "accelerateur" 2900 "cold_email" \
  "Albi. Menuiserie ~985K€ CA. Budget dispo, pas de devis en ligne."

# ── Seed Prestataires B2B ────────────────────────────────────
echo ""
echo "💼  Niche Prestataires B2B"
echo "─────────────────────────"

create_deal \
  "Dirigeant Elhéa" "" "Elhéa" "b2b" "accelerateur" 2900 "cold_email" \
  "Tarn. Cabinet RH externalisation recrutement. Site pro mais aucun tunnel, pas de lead magnet."

create_deal \
  "Dirigeant Action Formation" "" "Action Formation 81" "b2b" "accelerateur" 2900 "cold_email" \
  "Albi. Centre formation. Site daté (http://). Pas d'inscription en ligne fluide."

create_deal \
  "Françoise Castel" "" "Altair Business" "b2b" "partenaire" 6900 "cold_email" \
  "Toulouse. Conseil management aéro EN9100 Qualiopi. +25 ans expertise, site chargé sans parcours conversion."

create_deal \
  "Dirigeant Consupting" "" "Consupting" "b2b" "accelerateur" 2900 "cold_email" \
  "Toulouse. Coaching dirigeants. Solo, pas de capture de leads, fonctionne sur bouche-à-oreille."

create_deal \
  "Dirigeant Zenessor" "" "Zenessor (ActionCOACH)" "b2b" "accelerateur" 2900 "cold_email" \
  "Toulouse. Coaching business TPE/PME. Vend du conseil mais pas de tunnel lui-même. Bilan santé statique."

# ── Alexandre BRIHIEZ — Partenaire ───────────────────────────
echo ""
echo "🤝  Partenaire"
echo "─────────────────────────"

create_deal \
  "Alexandre BRIHIEZ" "" "Apporteur d'affaires" "other" "accelerateur" 0 "referral" \
  "Partenaire apporteur d'affaires. Commission 15-20%. Période d'essai 2 mois. Réunion 03/04/2026 9h30 Teams."

# ── Résumé ───────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════"
echo "✅ Seed terminé — 12 deals créés"
echo "  → 6 BTP / Artisans"
echo "  → 5 Prestataires B2B"
echo "  → 1 Partenaire (Alexandre)"
echo ""
echo "🔗 Va sur admin.aissabelkoussa.fr/dashboard/pipeline"
echo "═══════════════════════════════════════"

# Cleanup
rm -f /tmp/pipeline-cookies.txt
