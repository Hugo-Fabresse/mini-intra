# Mini Intra - Projet Demo Lead QA

> Projet de demonstration des pratiques qualite et securite pour le poste de Lead Qualite sur l'Intra Epitech Lyceens.
> Stack identique au projet reel : SvelteKit + TypeScript + PocketBase + Docker.

## Stack technique

| Composant | Technologie |
|---|---|
| Frontend | SvelteKit 2 + Svelte 5 |
| Langage | TypeScript (strict mode) |
| Backend | PocketBase |
| Validation | Zod + Superforms |
| CSS | Tailwind CSS 4 |
| Tests unitaires | Vitest (97 tests) |
| Tests E2E | Playwright |
| Lint | ESLint (regles strictes) + Prettier |
| CI/CD | GitHub Actions (3 pipelines) |
| Securite CI | CodeQL, TruffleHog, Gitleaks, Trivy |
| Conteneurisation | Docker + Docker Compose |
| Git hooks | pre-commit, commit-msg, pre-push |

## Architecture

```
mini-intra/
├── frontend/                # Application SvelteKit
│   └── src/
│       ├── lib/
│       │   ├── server/      # Code serveur uniquement
│       │   │   ├── auth/    # Authentification & gardes de route
│       │   │   ├── db/      # Wrapper DB (interface abstraite)
│       │   │   └── services/ # Logique metier
│       │   ├── components/  # Composants Svelte reutilisables
│       │   ├── schemas/     # Schemas Zod de validation
│       │   ├── stores/      # Stores Svelte
│       │   ├── types/       # Types TypeScript
│       │   └── utils/       # Fonctions utilitaires pures
│       ├── routes/          # Pages & API SvelteKit
│       └── tests/           # Tests unitaires (9 fichiers, 97 tests)
├── pocketbase-backend/      # Backend PocketBase (Dockerfile)
├── docs/                    # Documentation technique
│   ├── adr/                 # Architecture Decision Records
│   └── securite/            # Threat model, RGPD, checklist, runbook
├── scripts/                 # Scripts d'outillage
├── .githooks/               # Git hooks versionnes
├── .github/                 # GitHub Actions & templates
│   ├── workflows/           # CI, security scan, quality gate
│   └── ISSUE_TEMPLATE/      # Bug report, feature request
├── docker-compose.yml       # Production
├── docker-compose.dev.yml   # Dev avec hot reload
└── Makefile                 # Commandes centralisees
```

## Setup rapide

### Prerequis

- Docker + Docker Compose
- Git

### Premiere installation

```bash
git clone https://github.com/Hugo-Fabresse/mini-intra.git
cd mini-intra
make setup
```

Ce script fait tout automatiquement :
1. Initialise le repo git
2. Copie `.env.example` vers `.env`
3. Installe les dependances frontend
4. Installe les git hooks
5. Lance les tests pour verifier

### Lancer l'application

```bash
# Mode dev (hot reload)
make dev

# Mode dev en arriere-plan
make dev-bg

# Mode production
make prod

# Arreter
make stop
```

- **Frontend dev** : http://localhost:5173
- **Frontend prod** : http://localhost:3000
- **PocketBase Admin** : http://localhost:8090/_/

### Configurer la base de donnees

```bash
# 1. Creer le superuser PocketBase (voir le lien dans les logs Docker)
make logs

# 2. Creer les collections et injecter les donnees de test
make seed
```

Compte staff de test : `staff@epitech.eu` / `staffpassword12`

## Commandes Make

```bash
make help          # Affiche toutes les commandes disponibles
```

| Commande | Description |
|---|---|
| **Setup** | |
| `make setup` | Setup complet du projet (1ere fois) |
| `make hooks` | Installe les git hooks |
| **Dev** | |
| `make dev` | Lance l'app en mode dev (Docker) |
| `make dev-bg` | Lance en arriere-plan |
| `make prod` | Lance en mode production |
| `make stop` | Arrete tous les containers |
| `make logs` | Affiche les logs |
| **Qualite** | |
| `make test` | Lance les 97 tests unitaires |
| `make test-watch` | Tests en mode watch |
| `make coverage` | Rapport de couverture HTML |
| `make lint` | Verifie ESLint + Prettier |
| `make lint-fix` | Corrige automatiquement |
| `make format` | Formate avec Prettier |
| `make check` | Verification des types (svelte-check) |
| `make quality` | Check complet avant PR |
| **Donnees** | |
| `make seed` | Collections + donnees de test |
| `make reset-db` | Reset complet de la BDD |
| **Securite** | |
| `make audit` | Audit des dependances npm |

## Qualite & Securite

### Tests (97 tests, 9 fichiers)

| Fichier | Module | Tests |
|---|---|---|
| `sanitize.test.ts` | XSS, PB filter, filename, email | 19 |
| `schemas.test.ts` | Validation Zod (student, event, login) | 16 |
| `db-memory.test.ts` | Wrapper DB (interface IDatabase) | 14 |
| `student.service.test.ts` | Service metier etudiants | 12 |
| `date.test.ts` | Utilitaires dates | 9 |
| `guards.test.ts` | Auth guards (requireAuth, requireAdmin, requireCampus) | 8 |
| `event.service.test.ts` | Service metier evenements | 8 |
| `errors.test.ts` | ServiceError factory | 6 |
| `session.test.ts` | Cookies de session | 5 |

### GitHub Actions (3 pipelines)

| Pipeline | Declencheur | Ce qu'il fait |
|---|---|---|
| **CI — Qualite** | Push/PR sur main/develop | ESLint, Prettier, svelte-check, tests + couverture (seuil 40%), build |
| **Security — Audit & Scan** | Push/PR + cron hebdo | npm audit, TruffleHog, Gitleaks, CodeQL SAST, Trivy Docker, licences |
| **Quality Gate — PR** | Pull Request | Tout-en-un : lint, tests, audit, build, detection secrets, no console.log, taille fichiers |

### Git Hooks (versionnes dans `.githooks/`)

| Hook | Ce qu'il bloque |
|---|---|
| `pre-commit` | Fichiers sensibles (.env, .pem), secrets hardcodes, console.log, erreurs ESLint, mauvais formatage |
| `commit-msg` | Messages non Conventional Commits, majuscule initiale, point final |
| `pre-push` | Tests qui echouent, build qui casse |

### ESLint (regles strictes)

- `no-explicit-any` : interdit
- `no-eval`, `no-implied-eval`, `no-new-func` : securite
- `no-console` : erreur (sauf warn/error)
- `eqeqeq` : egalite stricte obligatoire
- `complexity` : max 15
- `max-depth` : max 4 niveaux d'imbrication
- `max-lines-per-function` : max 100 lignes
- `max-params` : max 5 parametres

### Securite

- Auth avec cookies HTTPOnly, Secure, SameSite=Strict
- Route guards cote serveur (requireAuth, requireAdmin, requireCampusAccess)
- Validation Zod sur toutes les entrees
- Sanitisation XSS (escapeHtml) et PocketBase (escapePbFilter)
- Headers HTTP securises (CSP, HSTS, X-Frame-Options, etc.)
- Docker avec utilisateur non-root + health checks
- Wrapper DB abstrait (preparation migration Supabase)

## Documentation

| Document | Chemin |
|---|---|
| Glossaire metier | [`docs/glossaire.md`](docs/glossaire.md) |
| Norme de code | [`docs/norme-code.md`](docs/norme-code.md) |
| Threat Model | [`docs/securite/threat-model.md`](docs/securite/threat-model.md) |
| Registre RGPD | [`docs/securite/rgpd-registre-traitements.md`](docs/securite/rgpd-registre-traitements.md) |
| Politique confidentialite | [`docs/securite/politique-confidentialite.md`](docs/securite/politique-confidentialite.md) |
| Checklist securite | [`docs/securite/checklist-securite.md`](docs/securite/checklist-securite.md) |
| Runbook incident | [`docs/securite/runbook-incident.md`](docs/securite/runbook-incident.md) |
| ADR — Wrapper DB | [`docs/adr/ADR-001-wrapper-db-abstraction.md`](docs/adr/ADR-001-wrapper-db-abstraction.md) |
| ADR — Strategie tests | [`docs/adr/ADR-002-strategie-tests-vitest.md`](docs/adr/ADR-002-strategie-tests-vitest.md) |
| Securite | [`SECURITY.md`](SECURITY.md) |
| Contribution | [`CONTRIBUTING.md`](CONTRIBUTING.md) |

## Conventions

- **Commits** : [Conventional Commits](https://www.conventionalcommits.org/) — `type(scope): description` (applique par hook)
- **Branches** : `type/description-courte` (ex: `feature/formulaire-inscription`)
- **PR** : Template obligatoire avec checklist code/tests/securite
- **Tests** : Tout code critique doit etre teste avant merge
- **Definition of Done** : tests + lint + review + securite (voir `docs/norme-code.md`)

## Licence

Projet interne Epitech — Tous droits reserves.
