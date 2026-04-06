#!/bin/bash
# ===========================================
# Installe les git hooks versionnes
# ===========================================
# Les hooks sont dans .githooks/ et copies dans .git/hooks/
# pour fonctionner sans modifier core.hooksPath

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
HOOKS_SRC="$PROJECT_ROOT/.githooks"
HOOKS_DST="$PROJECT_ROOT/.git/hooks"

echo "=== Installation des git hooks ==="

# Verifier qu'on est dans un repo git
if [ ! -d "$PROJECT_ROOT/.git" ]; then
  echo -e "${RED}Erreur : pas de repo git. Lancez d'abord :${NC}"
  echo "  git init"
  exit 1
fi

# Creer le dossier hooks s'il n'existe pas
mkdir -p "$HOOKS_DST"

# Copier chaque hook
for hook in pre-commit commit-msg pre-push; do
  if [ -f "$HOOKS_SRC/$hook" ]; then
    cp "$HOOKS_SRC/$hook" "$HOOKS_DST/$hook"
    chmod +x "$HOOKS_DST/$hook"
    echo -e "  ${GREEN}✓${NC} $hook"
  else
    echo -e "  ${YELLOW}⚠${NC} $hook (fichier source manquant)"
  fi
done

echo ""
echo -e "${GREEN}Git hooks installes avec succes.${NC}"
echo ""
echo "Hooks actifs :"
echo "  pre-commit  — lint, format, scan secrets, no console.log"
echo "  commit-msg  — validation Conventional Commits"
echo "  pre-push    — tests + build obligatoires"
echo ""
echo "Pour desactiver temporairement : git commit --no-verify"
