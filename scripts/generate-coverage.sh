#!/bin/bash
# ===========================================
# Genere le rapport de couverture de tests
# ===========================================

set -e

GREEN='\033[0;32m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT/frontend"

echo "=== Generation du rapport de couverture ==="
echo ""

pnpm test:coverage 2>&1

echo ""
echo -e "${GREEN}Rapport genere dans frontend/coverage/${NC}"
echo ""
echo "Pour voir le rapport HTML :"
echo "  open frontend/coverage/index.html"
echo "  # ou : xdg-open frontend/coverage/index.html"
