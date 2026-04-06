#!/bin/bash
# ===========================================
# Seed de donnees de test
# ===========================================
set -e

PB_URL="${PUBLIC_POCKETBASE_URL:-http://localhost:8090}"
ADMIN_EMAIL="${PB_ADMIN_EMAIL:-hugo34fabresse@gmail.com}"
ADMIN_PASSWORD="${PB_ADMIN_PASSWORD:-superpasword1234}"

echo "=== Seed des donnees de test ==="

# Auth
TOKEN=$(curl -s -X POST "$PB_URL/api/collections/_superusers/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}" \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['token'])")

H="Authorization: Bearer $TOKEN"

create_record() {
  local collection=$1
  local data=$2
  RESULT=$(curl -s -X POST "$PB_URL/api/collections/$collection/records" -H "$H" -H "Content-Type: application/json" -d "$data")
  ID=$(echo "$RESULT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
  if [ -n "$ID" ] && [ "$ID" != "" ]; then
    echo "$ID"
  else
    MSG=$(echo "$RESULT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('message','erreur inconnue'))" 2>/dev/null)
    echo "ERREUR: $MSG" >&2
    echo ""
  fi
}

# --- Creer un user staff ---
echo ""
echo "[1/4] Creation du compte staff..."
curl -s -X POST "$PB_URL/api/collections/users/records" \
  -H "$H" -H "Content-Type: application/json" \
  -d '{
    "email": "staff@epitech.eu",
    "password": "staffpassword12",
    "passwordConfirm": "staffpassword12",
    "name": "Marie Dupont",
    "campus": "paris",
    "role": "staff",
    "verified": true
  }' | python3 -c "import json,sys; d=json.load(sys.stdin); print(f\"  Staff: {d.get('name','')} ({d.get('email','')}) - ID: {d.get('id','')}\")" 2>/dev/null || echo "  SKIP (existe deja ?)"

# --- Students ---
echo ""
echo "[2/4] Creation des lyceens..."

STUDENTS=(
  '{"nom":"Martin","prenom":"Lucas","email":"lucas.martin@lycee-hugo.fr","etablissement":"Lycee Victor Hugo","niveau":"terminale","campus":"paris"}'
  '{"nom":"Bernard","prenom":"Emma","email":"emma.bernard@lycee-moliere.fr","etablissement":"Lycee Moliere","niveau":"premiere","campus":"paris"}'
  '{"nom":"Petit","prenom":"Nathan","email":"nathan.petit@lycee-pasteur.fr","etablissement":"Lycee Pasteur","niveau":"terminale","campus":"paris"}'
  '{"nom":"Robert","prenom":"Chloe","email":"chloe.robert@lycee-curie.fr","etablissement":"Lycee Marie Curie","niveau":"seconde","campus":"paris"}'
  '{"nom":"Moreau","prenom":"Hugo","email":"hugo.moreau@lycee-voltaire.fr","etablissement":"Lycee Voltaire","niveau":"terminale","campus":"paris"}'
  '{"nom":"Leroy","prenom":"Lea","email":"lea.leroy@lycee-zola.fr","etablissement":"Lycee Emile Zola","niveau":"premiere","campus":"lyon"}'
  '{"nom":"Simon","prenom":"Tom","email":"tom.simon@lycee-lumiere.fr","etablissement":"Lycee Lumiere","niveau":"terminale","campus":"lyon"}'
  '{"nom":"Laurent","prenom":"Jade","email":"jade.laurent@lycee-ampere.fr","etablissement":"Lycee Ampere","niveau":"seconde","campus":"lyon"}'
  '{"nom":"Michel","prenom":"Enzo","email":"enzo.michel@lycee-thiers.fr","etablissement":"Lycee Thiers","niveau":"terminale","campus":"marseille"}'
  '{"nom":"Garcia","prenom":"Manon","email":"manon.garcia@lycee-perier.fr","etablissement":"Lycee Perier","niveau":"premiere","campus":"marseille"}'
)

STUDENT_IDS=()
for s in "${STUDENTS[@]}"; do
  ID=$(create_record "students" "$s")
  STUDENT_IDS+=("$ID")
  NOM=$(echo "$s" | python3 -c "import json,sys; d=json.load(sys.stdin); print(f\"  {d['prenom']} {d['nom']} ({d['campus']})\")")
  echo "$NOM - ID: $ID"
done

# --- Events ---
echo ""
echo "[3/4] Creation des evenements..."

EVENTS=(
  '{"titre":"Stage Decouverte Programmation","description":"Stage de 5 jours pour decouvrir la programmation avec Python et JavaScript. Aucun prerequis.","date_debut":"2026-04-20 09:00:00","date_fin":"2026-04-24 17:00:00","campus":"paris","places_max":20,"type":"stage","created_by":"staff"}'
  '{"titre":"Hackathon Lyceens 2026","description":"24h pour creer une application en equipe. Themes : environnement et tech for good.","date_debut":"2026-05-15 09:00:00","date_fin":"2026-05-16 17:00:00","campus":"paris","places_max":50,"type":"evenement","created_by":"staff"}'
  '{"titre":"Coding Club Python","description":"Atelier hebdomadaire de programmation Python. Niveau debutant a intermediaire.","date_debut":"2026-04-10 14:00:00","date_fin":"2026-06-26 16:00:00","campus":"paris","places_max":15,"type":"coding_club","created_by":"staff"}'
  '{"titre":"Journee Portes Ouvertes","description":"Decouverte des locaux, des projets etudiants et des formations Epitech.","date_debut":"2026-05-03 10:00:00","date_fin":"2026-05-03 17:00:00","campus":"lyon","places_max":100,"type":"evenement","created_by":"staff"}'
  '{"titre":"Stage IA et Data","description":"Stage de 3 jours autour de intelligence artificielle et data science.","date_debut":"2026-06-01 09:00:00","date_fin":"2026-06-03 17:00:00","campus":"lyon","places_max":15,"type":"stage","created_by":"staff"}'
  '{"titre":"Coding Club Web","description":"Creer son premier site web avec HTML, CSS et JavaScript.","date_debut":"2026-04-12 14:00:00","date_fin":"2026-06-28 16:00:00","campus":"marseille","places_max":12,"type":"coding_club","created_by":"staff"}'
)

EVENT_IDS=()
for e in "${EVENTS[@]}"; do
  ID=$(create_record "events" "$e")
  EVENT_IDS+=("$ID")
  TITRE=$(echo "$e" | python3 -c "import json,sys; d=json.load(sys.stdin); print(f\"  {d['titre']} ({d['campus']})\")")
  echo "$TITRE - ID: $ID"
done

# --- Participations ---
echo ""
echo "[4/4] Creation des participations..."

# Lucas Martin -> Stage Decouverte (inscrit)
if [ -n "${STUDENT_IDS[0]}" ] && [ -n "${EVENT_IDS[0]}" ]; then
  create_record "participations" "{\"student_id\":\"${STUDENT_IDS[0]}\",\"event_id\":\"${EVENT_IDS[0]}\",\"statut\":\"inscrit\",\"note\":\"\",\"xp\":0}" > /dev/null
  echo "  Lucas Martin -> Stage Decouverte (inscrit)"
fi

# Emma Bernard -> Stage Decouverte (inscrit)
if [ -n "${STUDENT_IDS[1]}" ] && [ -n "${EVENT_IDS[0]}" ]; then
  create_record "participations" "{\"student_id\":\"${STUDENT_IDS[1]}\",\"event_id\":\"${EVENT_IDS[0]}\",\"statut\":\"inscrit\",\"note\":\"\",\"xp\":0}" > /dev/null
  echo "  Emma Bernard -> Stage Decouverte (inscrit)"
fi

# Nathan Petit -> Hackathon (inscrit)
if [ -n "${STUDENT_IDS[2]}" ] && [ -n "${EVENT_IDS[1]}" ]; then
  create_record "participations" "{\"student_id\":\"${STUDENT_IDS[2]}\",\"event_id\":\"${EVENT_IDS[1]}\",\"statut\":\"inscrit\",\"note\":\"\",\"xp\":0}" > /dev/null
  echo "  Nathan Petit -> Hackathon (inscrit)"
fi

# Hugo Moreau -> Coding Club Python (present, avec XP)
if [ -n "${STUDENT_IDS[4]}" ] && [ -n "${EVENT_IDS[2]}" ]; then
  create_record "participations" "{\"student_id\":\"${STUDENT_IDS[4]}\",\"event_id\":\"${EVENT_IDS[2]}\",\"statut\":\"present\",\"note\":\"Tres motive, bonne progression\",\"xp\":150}" > /dev/null
  echo "  Hugo Moreau -> Coding Club Python (present, 150xp)"
fi

# Lea Leroy -> JPO Lyon (inscrit)
if [ -n "${STUDENT_IDS[5]}" ] && [ -n "${EVENT_IDS[3]}" ]; then
  create_record "participations" "{\"student_id\":\"${STUDENT_IDS[5]}\",\"event_id\":\"${EVENT_IDS[3]}\",\"statut\":\"inscrit\",\"note\":\"\",\"xp\":0}" > /dev/null
  echo "  Lea Leroy -> JPO Lyon (inscrit)"
fi

# Tom Simon -> Stage IA Lyon (present, avec XP)
if [ -n "${STUDENT_IDS[6]}" ] && [ -n "${EVENT_IDS[4]}" ]; then
  create_record "participations" "{\"student_id\":\"${STUDENT_IDS[6]}\",\"event_id\":\"${EVENT_IDS[4]}\",\"statut\":\"present\",\"note\":\"Excellent niveau en maths, a compris les concepts ML\",\"xp\":200}" > /dev/null
  echo "  Tom Simon -> Stage IA Lyon (present, 200xp)"
fi

# Enzo Michel -> Coding Club Web Marseille (present, avec XP)
if [ -n "${STUDENT_IDS[8]}" ] && [ -n "${EVENT_IDS[5]}" ]; then
  create_record "participations" "{\"student_id\":\"${STUDENT_IDS[8]}\",\"event_id\":\"${EVENT_IDS[5]}\",\"statut\":\"present\",\"note\":\"A cree son premier portfolio\",\"xp\":120}" > /dev/null
  echo "  Enzo Michel -> Coding Club Web (present, 120xp)"
fi

# Chloe Robert -> Stage Decouverte (annule)
if [ -n "${STUDENT_IDS[3]}" ] && [ -n "${EVENT_IDS[0]}" ]; then
  create_record "participations" "{\"student_id\":\"${STUDENT_IDS[3]}\",\"event_id\":\"${EVENT_IDS[0]}\",\"statut\":\"annule\",\"note\":\"Annulation pour raison personnelle\",\"xp\":0}" > /dev/null
  echo "  Chloe Robert -> Stage Decouverte (annule)"
fi

echo ""
echo "=== Seed termine ==="
echo ""
echo "Donnees creees :"
echo "  - 1 compte staff (staff@epitech.eu / staffpassword12)"
echo "  - 10 lyceens (3 campus : paris, lyon, marseille)"
echo "  - 6 evenements (stages, hackathon, coding clubs, JPO)"
echo "  - 8 participations"
echo ""
echo "Dashboard : $PB_URL/_/"
echo "Frontend  : http://localhost:5173"
