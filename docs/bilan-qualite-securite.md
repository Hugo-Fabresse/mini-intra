# Bilan Qualite & Securite — Mini Intra

> Ce document recapitule l'ensemble des mesures qualite et securite mises en place sur ce projet demo.
> Il sert de reference pour montrer l'approche Lead QA appliquee sur une stack SvelteKit + PocketBase + Docker.
>
> Derniere mise a jour : 2026-04-06

---

## Table des matieres

1. [Vue d'ensemble](#1--vue-densemble)
2. [Tests automatises](#2--tests-automatises)
3. [Linting & formatage](#3--linting--formatage)
4. [Git hooks](#4--git-hooks)
5. [CI/CD — GitHub Actions](#5--cicd--github-actions)
6. [Securite applicative](#6--securite-applicative)
7. [Securite infrastructure](#7--securite-infrastructure)
8. [Documentation securite & RGPD](#8--documentation-securite--rgpd)
9. [Architecture qualite](#9--architecture-qualite)
10. [Scripts d'outillage](#10--scripts-doutillage)
11. [Normes et conventions](#11--normes-et-conventions)
12. [Ce qui reste a faire](#12--ce-qui-reste-a-faire)

---

## 1 — Vue d'ensemble

| Metrique | Valeur |
|---|---|
| Tests unitaires | **97 tests**, 9 fichiers, tous verts |
| Fichiers source | 88 fichiers |
| Pipelines CI | 3 workflows GitHub Actions |
| Git hooks | 3 hooks versionnes |
| Documents securite | 5 documents + SECURITY.md |
| Regles ESLint | 15 regles strictes (securite + qualite + complexite) |
| Scripts d'outillage | 5 scripts + Makefile (15 commandes) |
| Commandes Make | `make setup`, `make dev`, `make test`, `make quality`, etc. |

---

## 2 — Tests automatises

### Strategie

Pyramide de tests definie dans l'ADR-002 :
- **70% unitaires** (Vitest) — fonctions pures, schemas, services, utils
- **20% integration** (Vitest + PocketBase de test) — services + DB
- **10% E2E** (Playwright) — parcours utilisateurs critiques

### Tests en place (97 tests)

| Fichier | Module teste | Nb tests | Ce qui est couvert |
|---|---|---|---|
| `sanitize.test.ts` | Securite des entrees | 19 | escapeHtml (XSS), escapePbFilter (injection), sanitizeFilename (path traversal), normalizeEmail |
| `schemas.test.ts` | Validation Zod | 16 | studentSchema, eventSchema, loginSchema — cas valides, invalides, normalisation, limites |
| `db-memory.test.ts` | Wrapper DB abstrait | 14 | CRUD complet, pagination, auth, reset — valide l'interface IDatabase |
| `student.service.test.ts` | Service metier etudiants | 12 | create (+ dedup email), getById, update, delete, search (limites longueur) |
| `date.test.ts` | Utilitaires dates | 9 | formatDate, isInFuture, isInPast, daysBetween — avec mock de Date.now |
| `guards.test.ts` | Auth guards | 8 | requireAuth, requireAdmin, requireCampusAccess — redirection si non autorise |
| `event.service.test.ts` | Service metier evenements | 8 | create, getById, update, delete, list — avec ServiceError |
| `errors.test.ts` | ServiceError | 6 | Factory methods (notFound, unauthorized, forbidden, validation, internal) |
| `session.test.ts` | Gestion cookies | 5 | setSessionCookie (secure/lax), getSessionToken, clearSession |

### Pourquoi ces tests

Chaque fichier de test correspond a un point identifie dans l'audit qualite du repo principal :
- **sanitize** : l'audit a identifie un escaping insuffisant (section 4.4 Injection)
- **schemas** : l'audit note l'absence de tests sur la validation (section 3.2 Events & CSV)
- **db-memory** : valide l'interface IDatabase qui n'existait pas (section 3.4 Acces donnees)
- **guards** : l'audit note 0 test sur le module le plus critique (section 3.1 Auth)
- **services** : logique metier non testee dans le repo principal (section 3.2)
- **session** : cookies de session non testes (section 4.1 Auth)

### Comment lancer

```bash
make test           # Lancer les tests
make test-watch     # Mode watch
make coverage       # Rapport de couverture HTML
```

---

## 3 — Linting & formatage

### ESLint — Regles appliquees

Fichier : `frontend/eslint.config.js`

| Categorie | Regle | Niveau | Justification |
|---|---|---|---|
| **TypeScript** | `no-explicit-any` | error | Eliminer les types faibles |
| | `no-unused-vars` | error | Code mort |
| **Securite** | `no-eval` | error | Prevenir l'execution de code arbitraire |
| | `no-implied-eval` | error | Idem pour setTimeout/setInterval avec string |
| | `no-new-func` | error | Idem pour new Function() |
| **Qualite** | `no-console` | error | Pas de console.log en prod (warn/error autorises) |
| | `no-debugger` | error | Pas de debugger oublie |
| | `eqeqeq` | error | Egalite stricte obligatoire (===) |
| | `no-var` | error | const/let uniquement |
| | `prefer-const` | error | const si pas de reassignation |
| | `no-throw-literal` | error | Toujours throw une Error |
| | `no-return-await` | error | Await inutile dans un return |
| | `no-shadow` | error | Pas de variables qui masquent une variable parente |
| | `no-duplicate-imports` | error | Un seul import par module |
| **Complexite** | `complexity` | warn (max 15) | Detecter les fonctions trop complexes |
| | `max-depth` | warn (max 4) | Limiter l'imbrication |
| | `max-lines-per-function` | warn (max 100) | Encourager le decoupage |
| | `max-params` | warn (max 5) | Encourager les objets de config |

### Prettier

Fichier : `frontend/.prettierrc`
- Tabs, single quotes, pas de trailing comma
- Plugins : svelte + tailwind (tri automatique des classes)

### EditorConfig

Fichier : `.editorconfig`
- Charset UTF-8, fin de ligne LF, indentation coherente
- Fonctionne avec tous les IDE sans configuration

### Comment lancer

```bash
make lint           # Verifier
make lint-fix       # Corriger automatiquement
make format         # Prettier uniquement
```

---

## 4 — Git hooks

### Emplacement

Les hooks sont versionnes dans `.githooks/` et copies dans `.git/hooks/` via `make hooks` ou `make setup`.

### pre-commit — Bloque le commit si :

1. **Fichiers sensibles** stages : `.env`, `credentials`, `.pem`, `.key`, `id_rsa`
2. **Secrets hardcodes** detectes : patterns `password=`, `api_key=`, `PRIVATE_KEY`, `Bearer token`
3. **console.log** present dans les fichiers `.ts` ou `.svelte`
4. **Erreurs ESLint** sur les fichiers modifies
5. **Mauvais formatage** Prettier sur les fichiers modifies

### commit-msg — Bloque le commit si :

Le message ne respecte pas le format **Conventional Commits** :
- Format : `type(scope): description`
- Types autorises : feat, fix, refactor, test, docs, chore, ci, style, perf
- Description en minuscule, pas de point final
- Ignore les merges et reverts

### pre-push — Bloque le push si :

1. Les **tests unitaires** echouent
2. Le **build** echoue

### Installation

```bash
make hooks
# ou : bash scripts/install-hooks.sh
```

---

## 5 — CI/CD — GitHub Actions

### Pipeline 1 : CI — Qualite (`ci.yml`)

**Declencheur** : push/PR sur main/develop

| Job | Ce qu'il fait |
|---|---|
| **lint** | ESLint + Prettier + svelte-check |
| **test** | Tests avec couverture — **fail si < 40%** |
| **build** | Build de production (depend de lint + test) |

### Pipeline 2 : Security — Audit & Scan (`security.yml`)

**Declencheur** : push/PR sur main/develop + **cron hebdomadaire** (lundi 8h)

| Job | Outil | Ce qu'il fait |
|---|---|---|
| **npm-audit** | pnpm audit | Detecte les vulnerabilites dans les dependances — **fail sur high+** |
| **secret-scan** | TruffleHog + Gitleaks | Scanne l'historique git pour des secrets commits par erreur |
| **sast** | CodeQL | Analyse statique de securite du code TypeScript/JavaScript |
| **docker-security** | Trivy | Scanne les images Docker pour les CVE critiques et hautes |
| **licence-check** | license-checker | Verifie qu'aucune dependance n'utilise une licence GPL/AGPL |

### Pipeline 3 : Quality Gate — PR (`quality-gate.yml`)

**Declencheur** : pull request sur main/develop

Tout-en-un qui bloque le merge si :
1. ESLint a des erreurs
2. Prettier n'est pas applique
3. svelte-check echoue
4. Les tests echouent
5. npm audit trouve des vulnerabilites high+
6. Le build casse
7. Des **patterns de secrets** sont detectes dans les fichiers modifies
8. Des **console.log** sont presents dans les fichiers modifies
9. Des **fichiers > 1MB** sont ajoutes (previent les binaires)

---

## 6 — Securite applicative

### Authentification

| Mesure | Implementation | Fichier |
|---|---|---|
| Cookies HTTPOnly | `httpOnly: true` dans setSessionCookie | `auth/session.ts` |
| Cookies Secure | `secure: true` en HTTPS | `auth/session.ts` |
| SameSite Strict | `sameSite: 'strict'` en HTTPS, `'lax'` en dev | `auth/session.ts` |
| Expiration 14 jours | `maxAge: 1209600` | `auth/session.ts` |
| Refresh a chaque requete | `authRefresh()` dans le hook serveur | `hooks.server.ts` |
| Token invalide = nettoyage | try/catch dans authHook, reset user a null | `hooks.server.ts` |
| Messages generiques | "Identifiants invalides" (ne revele pas si email existe) | `auth/login/+page.server.ts` |

### Autorisation (route guards)

| Guard | Comportement | Fichier |
|---|---|---|
| `requireAuth` | Redirige vers `/auth/login` si non connecte | `auth/guards.ts` |
| `requireAdmin` | Redirige vers `/` si pas admin | `auth/guards.ts` |
| `requireCampusAccess` | Redirige si staff d'un autre campus (admin passe) | `auth/guards.ts` |

Tous les guards sont testes (8 tests dans `guards.test.ts`).

### Validation des entrees

| Couche | Outil | Ce qui est valide |
|---|---|---|
| Schemas | Zod | Types, longueurs min/max, formats (email, date), enums |
| Sanitisation | `escapeHtml()` | Caracteres HTML (`<`, `>`, `"`, `'`, `/`, `&`) |
| Sanitisation | `escapePbFilter()` | Caracteres dangereux pour les filtres PocketBase (`'`, `\`) |
| Sanitisation | `sanitizeFilename()` | Caracteres non alphanumeriques remplaces, tronque a 200 |
| Normalisation | `normalizeEmail()` | Lowercase + trim |
| Recherche | Validation longueur | Min 2, max 100 caracteres |

Toutes les fonctions de sanitisation sont testees (19 tests dans `sanitize.test.ts`).

### Headers HTTP securises

Configures dans `hooks.server.ts` :

| Header | Valeur | Protection |
|---|---|---|
| `X-Frame-Options` | `DENY` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Fuite d'URL |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Acces API navigateur |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Downgrade HTTPS (en prod) |

---

## 7 — Securite infrastructure

### Docker

| Mesure | Fichier | Detail |
|---|---|---|
| Utilisateur non-root | `frontend/Dockerfile` | User `sveltekit` cree avec adduser |
| Utilisateur non-root | `pocketbase-backend/Dockerfile` | User `pocketbase` cree avec adduser |
| Multi-stage build | `frontend/Dockerfile` | Image finale ne contient que le build |
| .dockerignore | `frontend/.dockerignore` | Exclut node_modules, .env, .git, coverage |
| Health checks | `docker-compose.yml` | wget sur /api/health (PB) et / (frontend) |
| Alpine Linux | Les deux Dockerfiles | Image minimale, surface d'attaque reduite |

### Secrets

| Mesure | Ou |
|---|---|
| `.env` dans `.gitignore` | `.gitignore` |
| `.env.example` sans valeurs secretes | `.env.example` |
| Scan de secrets en pre-commit | `.githooks/pre-commit` |
| Scan de secrets en CI | `security.yml` (TruffleHog + Gitleaks) |
| Pas de secrets dans `PUBLIC_*` | Seul `PUBLIC_POCKETBASE_URL` est public |

---

## 8 — Documentation securite & RGPD

### Documents produits

| Document | Chemin | Contenu |
|---|---|---|
| **Threat Model** | `docs/securite/threat-model.md` | Surface d'attaque, 11 menaces classees par severite, mitigations |
| **Registre RGPD** | `docs/securite/rgpd-registre-traitements.md` | 3 traitements documentes, donnees collectees, durees, droits des personnes, consentement mineurs |
| **Politique de confidentialite** | `docs/securite/politique-confidentialite.md` | Document a presenter aux utilisateurs, conforme CNIL |
| **Checklist securite** | `docs/securite/checklist-securite.md` | 40+ points classes par categorie (auth, entrees, exposition, injection, deps, infra, CI, RGPD) |
| **Runbook incident** | `docs/securite/runbook-incident.md` | Procedure P0-P3, confinement, notification CNIL (72h), post-mortem |
| **SECURITY.md** | `SECURITY.md` | Comment signaler une vulnerabilite, delais de reponse |

### Pourquoi ces documents

Le repo principal (Intra-Epitech-Academy) a ete audite et les manques suivants ont ete identifies :
- **RGPD non conforme** : donnees de mineurs sans registre ni politique de confidentialite
- **Pas de threat model** : aucune identification formelle des menaces
- **Pas de procedure d'incident** : aucun runbook en cas de fuite de donnees
- **Pas de checklist** : verification manuelle et non systematique
- **Pas de SECURITY.md** : pas de canal pour signaler les vulnerabilites

---

## 9 — Architecture qualite

### Wrapper DB abstrait

Fichiers : `frontend/src/lib/server/db/`

| Fichier | Role |
|---|---|
| `interface.ts` | Interface `IDatabase` — contrat commun |
| `pocketbase.adapter.ts` | Implementation PocketBase |
| `memory.adapter.ts` | Implementation en memoire pour les tests |

**Pourquoi** : le repo principal fait des appels directs au SDK PocketBase partout.
Le wrapper permet de :
- Tester les services sans PocketBase (MemoryAdapter)
- Preparer la migration vers Supabase sans toucher au code metier
- Documenter le contrat de la couche donnees (ADR-001)

### Services metier

| Service | Fichier | Responsabilite |
|---|---|---|
| `StudentService` | `services/student.service.ts` | CRUD etudiants, recherche, dedup email |
| `EventService` | `services/event.service.ts` | CRUD evenements, filtrage par campus |

Tous les services :
- Utilisent le wrapper DB (jamais d'appel direct PocketBase)
- Retournent des `ServiceError` typees
- Sont testables avec le `MemoryAdapter`

### Gestion des erreurs

| Classe | Fichier | Codes |
|---|---|---|
| `ServiceError` | `types/errors.ts` | NOT_FOUND (404), UNAUTHORIZED (401), FORBIDDEN (403), VALIDATION (400), INTERNAL (500) |

Chaque couche transforme les erreurs :
```
PocketBase → ServiceError → Store → Message utilisateur
```

---

## 10 — Scripts d'outillage

### Makefile (15 commandes)

Le `Makefile` centralise toutes les operations du projet :

| Categorie | Commandes |
|---|---|
| Setup | `make setup`, `make hooks` |
| Dev | `make dev`, `make dev-bg`, `make prod`, `make stop`, `make logs` |
| Qualite | `make test`, `make test-watch`, `make coverage`, `make lint`, `make lint-fix`, `make format`, `make check`, `make quality` |
| Donnees | `make seed`, `make reset-db` |
| Securite | `make audit` |

### Scripts (`scripts/`)

| Script | Usage | Ce qu'il fait |
|---|---|---|
| `setup-project.sh` | `make setup` | Git init + .env + pnpm install + hooks + tests |
| `install-hooks.sh` | `make hooks` | Copie `.githooks/*` vers `.git/hooks/` |
| `check-quality.sh` | `make quality` | ESLint + Prettier + svelte-check + tests + npm audit + scan secrets |
| `reset-db.sh` | `make reset-db` | Arrete Docker, supprime le volume PB, relance |
| `generate-coverage.sh` | `make coverage` | Lance tests avec couverture, genere rapport HTML |

### Scripts racine

| Script | Usage | Ce qu'il fait |
|---|---|---|
| `setup-collections.sh` | `make seed` | Cree les 4 collections PocketBase via l'API |
| `seed-data.sh` | `make seed` | Injecte 1 staff + 10 lyceens + 6 events + 8 participations |

---

## 11 — Normes et conventions

### Documents de reference

| Document | Chemin | Applique par |
|---|---|---|
| Norme de code | `docs/norme-code.md` | ESLint + Prettier + review |
| Glossaire metier | `docs/glossaire.md` | Convention de nommage |
| Convention de commits | `docs/norme-code.md` (section Commits) | Hook commit-msg |
| Definition of Done | `docs/norme-code.md` (section DoD) | Checklist PR |
| Template PR | `.github/pull_request_template.md` | GitHub |
| Template Bug | `.github/ISSUE_TEMPLATE/bug_report.md` | GitHub |
| Template Feature | `.github/ISSUE_TEMPLATE/feature_request.md` | GitHub |

### Ce qui est automatise vs manuel

| Verification | Automatique | Manuel |
|---|---|---|
| Formatage (Prettier) | Hook pre-commit + CI | — |
| Lint (ESLint) | Hook pre-commit + CI | — |
| Tests | Hook pre-push + CI | — |
| Conventional Commits | Hook commit-msg | — |
| Scan secrets | Hook pre-commit + CI | — |
| Audit npm | CI (hebdomadaire) | `make audit` |
| Scan Docker (Trivy) | CI | — |
| SAST (CodeQL) | CI | — |
| Code review | — | Reviewer humain |
| Checklist securite PR | — | Auteur + reviewer |
| Couverture > 40% | CI | — |

---

## 12 — Ce qui reste a faire

Points identifies dans l'audit mais non implementes dans cette demo (scope volontairement limite) :

### Haute priorite

| Action | Justification |
|---|---|
| Tests E2E Playwright (flux login, CRUD) | Couvrir les parcours utilisateurs complets |
| Mentions RGPD sur les formulaires UI | Obligation legale |
| Workflow consentement parental | Mineurs < 15 ans |
| Rate limiting sur les API | Anti-scraping |
| Audit logging (qui a modifie quoi) | Tracabilite des acces aux donnees |

### Priorite normale

| Action | Justification |
|---|---|
| HTTPS en production (reverse proxy Caddy/Nginx) | Chiffrement en transit |
| Backups automatises SQLite | Resilience donnees |
| Sentry (monitoring erreurs) | Observabilite production |
| Environnement de staging | Valider avant deploiement prod |
| Procedure de purge automatique des donnees | Conformite RGPD duree de conservation |

### Nice to have

| Action | Justification |
|---|---|
| Storybook pour les composants UI | Documentation visuelle |
| Documentation OpenAPI des endpoints | Reference API |
| Dashboard metriques qualite | Suivi couverture, lint, vulns par sprint |

---

> Ce document est maintenu a jour a chaque evolution significative du projet.
> Pour toute question : consulter les documents specifiques dans `docs/` ou contacter le Lead Qualite.
