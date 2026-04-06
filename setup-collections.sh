#!/bin/bash
# ===========================================
# Setup des collections PocketBase
# ===========================================
# Usage : ./setup-collections.sh
# Prerequis : PocketBase doit tourner sur localhost:8090

set -e

PB_URL="${PUBLIC_POCKETBASE_URL:-http://localhost:8090}"
ADMIN_EMAIL="${PB_ADMIN_EMAIL:-hugo34fabresse@gmail.com}"
ADMIN_PASSWORD="${PB_ADMIN_PASSWORD:-superpasword1234}"

echo "=== Setup des collections PocketBase ==="
echo "URL: $PB_URL"

# 1. Auth admin
echo ""
echo "[1/4] Authentification admin..."
AUTH_RESPONSE=$(curl -s -X POST "$PB_URL/api/collections/_superusers/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}")

TOKEN=$(echo "$AUTH_RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('token',''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "ERREUR: Authentification echouee."
  echo "$AUTH_RESPONSE"
  exit 1
fi
echo "OK"

H="Authorization: Bearer $TOKEN"

create_collection() {
  local name=$1
  local payload=$2
  RESULT=$(curl -s -X POST "$PB_URL/api/collections" -H "$H" -H "Content-Type: application/json" -d "$payload")
  CREATED=$(echo "$RESULT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('name',''))" 2>/dev/null)
  if [ "$CREATED" = "$name" ]; then
    echo "OK"
  else
    MSG=$(echo "$RESULT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('message','inconnu'))" 2>/dev/null)
    echo "SKIP ($MSG)"
  fi
}

# 2. Collection: students
echo ""
echo "[2/4] Creation de la collection 'students'..."
create_collection "students" '{
  "name": "students",
  "type": "base",
  "fields": [
    {"name": "nom", "type": "text", "required": true},
    {"name": "prenom", "type": "text", "required": true},
    {"name": "email", "type": "email", "required": true},
    {"name": "etablissement", "type": "text", "required": true},
    {"name": "niveau", "type": "select", "required": true, "values": ["seconde", "premiere", "terminale"]},
    {"name": "campus", "type": "text", "required": true}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_students_email ON students (email)"],
  "listRule": "",
  "viewRule": "",
  "createRule": "",
  "updateRule": "",
  "deleteRule": ""
}'

# 3. Collection: events
echo ""
echo "[3/4] Creation de la collection 'events'..."
create_collection "events" '{
  "name": "events",
  "type": "base",
  "fields": [
    {"name": "titre", "type": "text", "required": true},
    {"name": "description", "type": "text", "required": false},
    {"name": "date_debut", "type": "date", "required": true},
    {"name": "date_fin", "type": "date", "required": true},
    {"name": "campus", "type": "text", "required": true},
    {"name": "places_max", "type": "number", "required": true, "min": 1, "max": 500},
    {"name": "type", "type": "select", "required": true, "values": ["stage", "evenement", "coding_club"]},
    {"name": "created_by", "type": "text", "required": false}
  ],
  "listRule": "",
  "viewRule": "",
  "createRule": "",
  "updateRule": "",
  "deleteRule": ""
}'

# 4. Collection: participations
echo ""
echo "[4/4] Creation de la collection 'participations'..."
create_collection "participations" '{
  "name": "participations",
  "type": "base",
  "fields": [
    {"name": "student_id", "type": "text", "required": true},
    {"name": "event_id", "type": "text", "required": true},
    {"name": "statut", "type": "select", "required": true, "values": ["inscrit", "present", "absent", "annule"]},
    {"name": "note", "type": "text", "required": false},
    {"name": "xp", "type": "number", "required": false, "min": 0}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_part_unique ON participations (student_id, event_id)"],
  "listRule": "",
  "viewRule": "",
  "createRule": "",
  "updateRule": "",
  "deleteRule": ""
}'

# 5. Ajouter campus + role a la collection users
echo ""
echo "[5/5] Mise a jour de la collection 'users' (ajout campus + role)..."
USERS_JSON=$(curl -s "$PB_URL/api/collections/users" -H "$H")
UPDATED=$(echo "$USERS_JSON" | python3 -c "
import json, sys
d = json.load(sys.stdin)
field_names = [f['name'] for f in d['fields']]
if 'campus' not in field_names:
    d['fields'].append({'name': 'campus', 'type': 'text', 'required': False})
if 'role' not in field_names:
    d['fields'].append({'name': 'role', 'type': 'select', 'required': False, 'values': ['admin', 'staff']})
print(json.dumps(d))
")
curl -s -X PATCH "$PB_URL/api/collections/users" -H "$H" -H "Content-Type: application/json" -d "$UPDATED" > /dev/null && echo "OK" || echo "SKIP"

echo ""
echo "=== Setup termine ==="
echo ""
echo "Collections creees :"
echo "  - students       (lyceens)"
echo "  - events         (stages, evenements, coding clubs)"
echo "  - participations (liens etudiant/evenement)"
echo "  - users          (staff Epitech — collection auth par defaut)"
echo ""
echo "Dashboard PocketBase : $PB_URL/_/"
