#!/bin/bash
# ===========================================
# Setup complet du projet
# ===========================================
# A lancer une seule fois apres le clone

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "============================================"
echo "  Setup — Mini Intra Qualite"
echo "============================================"
echo ""

# 1. Git init si necessaire
echo -n "[1/6] Repository git... "
if [ ! -d "$PROJECT_ROOT/.git" ]; then
  cd "$PROJECT_ROOT"
  git init -b main > /dev/null 2>&1
  echo -e "${GREEN}initialise${NC}"
else
  echo -e "${GREEN}existe deja${NC}"
fi

# 2. Copier .env
echo -n "[2/6] Variables d'environnement... "
if [ ! -f "$PROJECT_ROOT/.env" ]; then
  cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
  echo -e "${YELLOW}copie de .env.example → .env (a remplir)${NC}"
else
  echo -e "${GREEN}existe deja${NC}"
fi

# 3. Installer les dependances frontend
echo "[3/6] Dependances frontend..."
cd "$PROJECT_ROOT/frontend"
if command -v pnpm &> /dev/null; then
  pnpm install 2>&1 | tail -1
else
  echo -e "${YELLOW}pnpm non trouve, installation...${NC}"
  npm install -g pnpm
  pnpm install 2>&1 | tail -1
fi
echo -e "  ${GREEN}✓ dependances installees${NC}"

# 4. Installer les hooks
echo "[4/6] Git hooks..."
bash "$SCRIPT_DIR/install-hooks.sh" 2>&1 | grep -E "✓|⚠"

# 5. Verifier Docker
echo -n "[5/6] Docker... "
if command -v docker &> /dev/null; then
  echo -e "${GREEN}disponible ($(docker --version | cut -d' ' -f3 | tr -d ','))${NC}"
else
  echo -e "${RED}non installe — necessaire pour lancer l'app${NC}"
fi

# 6. Lancer les tests
echo "[6/6] Tests..."
cd "$PROJECT_ROOT/frontend"
pnpm test 2>&1 | tail -3

echo ""
echo "============================================"
echo -e "  ${GREEN}Setup termine !${NC}"
echo "============================================"
echo ""
echo "Prochaines etapes :"
echo "  1. Remplir les credentials dans .env"
echo "  2. Lancer l'app : make dev"
echo "  3. Creer le superuser PocketBase"
echo "  4. Lancer le seed : make seed"
echo ""
