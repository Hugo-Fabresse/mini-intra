# Mini Intra Qualite - Projet Demo Lead QA

> Projet de demonstration des pratiques qualite et securite pour le poste de Lead Qualite sur l'Intra Epitech Lyceens.

## Stack technique

| Composant | Technologie |
|---|---|
| Frontend | SvelteKit 2 + Svelte 5 |
| Langage | TypeScript (strict mode) |
| Backend | PocketBase |
| Validation | Zod + Superforms |
| CSS | Tailwind CSS 4 |
| Tests unitaires | Vitest |
| Tests E2E | Playwright |
| Lint | ESLint + Prettier |
| CI/CD | GitHub Actions |
| Conteneurisation | Docker + Docker Compose |

## Architecture

```
mini-intra/
├── frontend/               # Application SvelteKit
│   └── src/
│       ├── lib/
│       │   ├── server/     # Code serveur uniquement
│       │   │   ├── auth/   # Authentification & gardes de route
│       │   │   ├── db/     # Wrapper DB (interface abstraite)
│       │   │   └── services/ # Logique metier
│       │   ├── components/  # Composants Svelte reutilisables
│       │   ├── schemas/     # Schemas Zod de validation
│       │   ├── stores/      # Stores Svelte
│       │   ├── types/       # Types TypeScript
│       │   └── utils/       # Fonctions utilitaires pures
│       ├── routes/          # Pages & API SvelteKit
│       └── tests/           # Tests unitaires & integration
├── pocketbase-backend/      # Backend PocketBase
├── docs/                    # Documentation technique
│   └── adr/                 # Architecture Decision Records
├── .github/                 # GitHub Actions & templates
└── docker-compose.yml       # Orchestration
```

## Lancer l'application

### Prerequis

- Docker + Docker Compose

C'est tout. Pas besoin d'installer Node.js, pnpm ou quoi que ce soit d'autre.

### Mode developpement (avec hot reload)

```bash
# 1. Copier les variables d'environnement
cp .env.example .env

# 2. Lancer tout le stack
docker compose -f docker-compose.dev.yml up --build
```

L'app est accessible sur :
- **Frontend** : http://localhost:5173
- **PocketBase Admin** : http://localhost:8090/_/

Les fichiers `src/` sont montes en volume : toute modification est refletee instantanement.

### Mode production

```bash
# 1. Configurer les variables d'environnement
cp .env.example .env
# Remplir PB_ADMIN_EMAIL et PB_ADMIN_PASSWORD avec des vraies valeurs

# 2. Build + lancement
docker compose up --build -d
```

L'app est accessible sur :
- **Frontend** : http://localhost:3000
- **PocketBase Admin** : http://localhost:8090/_/

### Commandes utiles

```bash
# Voir les logs
docker compose -f docker-compose.dev.yml logs -f

# Arreter tout
docker compose -f docker-compose.dev.yml down

# Reset la base de donnees
docker compose -f docker-compose.dev.yml down -v

# Lancer les tests (dans le container)
docker compose -f docker-compose.dev.yml exec frontend pnpm test

# Lancer le lint (dans le container)
docker compose -f docker-compose.dev.yml exec frontend pnpm lint
```

### Sans Docker (optionnel)

Si tu preferes lancer hors Docker :

```bash
# Prerequis : Node.js >= 20, pnpm
cd frontend && pnpm install
docker compose -f docker-compose.dev.yml up pocketbase -d  # juste le backend
pnpm dev
```

### Scripts npm disponibles

| Script | Description |
|---|---|
| `pnpm dev` | Serveur de developpement |
| `pnpm build` | Build de production |
| `pnpm test` | Tests unitaires (Vitest) |
| `pnpm test:e2e` | Tests E2E (Playwright) |
| `pnpm test:coverage` | Couverture de tests |
| `pnpm lint` | ESLint + svelte-check |
| `pnpm format` | Prettier |
| `pnpm check` | Verification des types Svelte |

## Documentation

| Sujet | Fichier |
|---|---|
| Glossaire metier | [`docs/glossaire.md`](docs/glossaire.md) |
| Norme de code | [`docs/norme-code.md`](docs/norme-code.md) |
| Securite | [`SECURITY.md`](SECURITY.md) |
| Contribution | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Decisions d'architecture | [`docs/adr/`](docs/adr/) |

## Conventions

- **Commits** : [Conventional Commits](https://www.conventionalcommits.org/) — `type(scope): description`
- **Branches** : `type/description-courte` (ex: `feature/formulaire-inscription`)
- **PR** : Template obligatoire, 1 review minimum
- **Tests** : Tout code critique doit etre teste avant merge

## Licence

Projet interne Epitech — Tous droits reserves.
