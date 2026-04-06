#!/bin/bash
# ===========================================
# Reset complet de la base de donnees
# ===========================================
# Supprime le volume Docker PocketBase et recree tout

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${YELLOW}=== ATTENTION : Reset complet de la base de donnees ===${NC}"
echo "Cela va supprimer toutes les donnees PocketBase."
echo ""
read -p "Continuer ? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Annule."
  exit 0
fi

cd "$PROJECT_ROOT"

echo "[1/4] Arret des containers..."
docker compose -f docker-compose.dev.yml down 2>/dev/null || true

echo "[2/4] Suppression du volume..."
docker volume rm mini-intra_pb_data 2>/dev/null || true

echo "[3/4] Relancement..."
docker compose -f docker-compose.dev.yml up --build -d

echo "[4/4] Attente que PocketBase soit pret..."
for i in $(seq 1 30); do
  if curl -s http://localhost:8090/api/health > /dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo ""
echo -e "${GREEN}Base de donnees reinitalisee.${NC}"
echo ""
echo "Prochaines etapes :"
echo "  1. Creer le superuser : voir les logs Docker pour le lien d'installation"
echo "  2. Creer les collections : ./setup-collections.sh"
echo "  3. Injecter les donnees : ./seed-data.sh"
