#!/bin/bash
# ===========================================
# Installation des git hooks versionnes
# ===========================================
# A executer une fois apres le clone du repo :
#   chmod +x .githooks/setup.sh && ./.githooks/setup.sh

set -e

echo "=== Configuration des git hooks ==="

# Pointer git vers le dossier .githooks
git config core.hooksPath .githooks

# Rendre les hooks executables
chmod +x .githooks/pre-commit
chmod +x .githooks/commit-msg
chmod +x .githooks/pre-push

echo ""
echo "Git hooks installes :"
echo "  - pre-commit  : lint, format, scan secrets, no console.log"
echo "  - commit-msg  : validation Conventional Commits"
echo "  - pre-push    : tests + build"
echo ""
echo "Pour desactiver temporairement : git commit --no-verify"
echo "Pour revenir aux hooks par defaut : git config --unset core.hooksPath"
