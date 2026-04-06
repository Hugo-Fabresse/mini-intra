# ===========================================
# Makefile — Mini Intra Qualite
# ===========================================
# Commandes disponibles : make help

.PHONY: help setup dev prod stop logs test lint format check quality seed reset-db coverage hooks

# --- Setup ---

help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Setup complet du projet (1ere fois)
	@chmod +x scripts/*.sh
	@bash scripts/setup-project.sh

hooks: ## Installe les git hooks
	@bash scripts/install-hooks.sh

# --- Dev ---

dev: ## Lance l'app en mode dev (Docker)
	docker compose -f docker-compose.dev.yml up --build

dev-bg: ## Lance l'app en mode dev en arriere-plan
	docker compose -f docker-compose.dev.yml up --build -d
	@echo ""
	@echo "App lancee en arriere-plan :"
	@echo "  Frontend : http://localhost:5173"
	@echo "  PocketBase : http://localhost:8090/_/"
	@echo ""
	@echo "Logs : make logs"
	@echo "Stop : make stop"

prod: ## Lance l'app en mode production (Docker)
	docker compose up --build -d

stop: ## Arrete tous les containers
	docker compose -f docker-compose.dev.yml down 2>/dev/null || true
	docker compose down 2>/dev/null || true

logs: ## Affiche les logs des containers
	docker compose -f docker-compose.dev.yml logs -f

# --- Qualite ---

test: ## Lance les tests unitaires
	cd frontend && pnpm test

test-watch: ## Lance les tests en mode watch
	cd frontend && pnpm test:watch

coverage: ## Genere le rapport de couverture
	@bash scripts/generate-coverage.sh

lint: ## Verifie le lint (ESLint + Prettier)
	cd frontend && pnpm eslint . && pnpm prettier --check .

lint-fix: ## Corrige automatiquement le lint
	cd frontend && pnpm eslint --fix . && pnpm prettier --write .

format: ## Formate le code avec Prettier
	cd frontend && pnpm format

check: ## Verification des types (svelte-check)
	cd frontend && pnpm check

quality: ## Verification qualite complete (avant PR)
	@bash scripts/check-quality.sh

# --- Donnees ---

seed: ## Injecte les donnees de test
	@bash setup-collections.sh
	@bash seed-data.sh

reset-db: ## Reset complet de la base de donnees
	@bash scripts/reset-db.sh

# --- Securite ---

audit: ## Audit des dependances npm
	cd frontend && pnpm audit

audit-fix: ## Corrige les vulnerabilites npm
	cd frontend && pnpm audit --fix
