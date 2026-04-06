#!/bin/bash
# ===========================================
# Verification qualite complete
# ===========================================
# Lance tous les checks sans commiter
# Utile avant d'ouvrir une PR

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FRONTEND="$PROJECT_ROOT/frontend"
ERRORS=0

echo "============================================"
echo "  Verification qualite & securite"
echo "============================================"
echo ""

cd "$FRONTEND"

# 1. ESLint
echo -n "[1/6] ESLint... "
if npx eslint . 2>/dev/null; then
  echo -e "${GREEN}OK${NC}"
else
  echo -e "${RED}ERREURS${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 2. Prettier
echo -n "[2/6] Prettier... "
if npx prettier --check . 2>/dev/null; then
  echo -e "${GREEN}OK${NC}"
else
  echo -e "${RED}ERREURS${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 3. TypeScript / Svelte check
echo -n "[3/6] Svelte check... "
if pnpm check 2>/dev/null; then
  echo -e "${GREEN}OK${NC}"
else
  echo -e "${YELLOW}WARNINGS${NC}"
fi

# 4. Tests
echo "[4/6] Tests..."
if pnpm test 2>&1 | tail -3; then
  echo -e "  ${GREEN}OK${NC}"
else
  echo -e "  ${RED}ERREURS${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 5. Audit securite npm
echo -n "[5/6] npm audit... "
AUDIT_RESULT=$(pnpm audit --audit-level=high 2>&1) && {
  echo -e "${GREEN}OK${NC}"
} || {
  HIGH_COUNT=$(echo "$AUDIT_RESULT" | grep -c "high" || true)
  CRIT_COUNT=$(echo "$AUDIT_RESULT" | grep -c "critical" || true)
  if [ "$CRIT_COUNT" -gt 0 ] || [ "$HIGH_COUNT" -gt 0 ]; then
    echo -e "${RED}${CRIT_COUNT} critiques, ${HIGH_COUNT} hautes${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}OK (pas de high/critical)${NC}"
  fi
}

# 6. Scan de secrets
echo -n "[6/6] Scan secrets... "
SECRET_PATTERNS="password\s*[:=]\s*['\"][^'\"]{8,}|api[_-]?key\s*[:=]\s*['\"]|PRIVATE[_-]?KEY|Bearer\s+[A-Za-z0-9]"
SECRETS_FOUND=$(grep -rlE "$SECRET_PATTERNS" --include="*.ts" --include="*.svelte" --include="*.js" "$FRONTEND/src" 2>/dev/null || true)
if [ -n "$SECRETS_FOUND" ]; then
  echo -e "${YELLOW}ATTENTION — fichiers suspects :${NC}"
  echo "$SECRETS_FOUND" | while read f; do echo "  $f"; done
else
  echo -e "${GREEN}OK${NC}"
fi

# Resume
echo ""
echo "============================================"
if [ "$ERRORS" -eq 0 ]; then
  echo -e "  ${GREEN}Tous les checks sont passes !${NC}"
  echo "  Pret pour ouvrir une PR."
else
  echo -e "  ${RED}${ERRORS} check(s) en echec.${NC}"
  echo "  Corrigez avant de pusher."
fi
echo "============================================"

exit $ERRORS
