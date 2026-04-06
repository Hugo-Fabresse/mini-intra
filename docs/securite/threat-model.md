# Threat Model — Mini Intra Lyceens

> Derniere mise a jour : 2026-04-06
> Responsable : Lead Qualite

## Contexte

Application intranet gerant des donnees de lyceens (mineurs) pour Epitech.
Donnees sensibles : nom, prenom, email, etablissement, notes, progression.

## Surface d'attaque

```
                    ┌──────────────┐
   Internet         │   Navigateur  │
                    │  (Staff/Admin)│
                    └──────┬───────┘
                           │ HTTPS
                    ┌──────▼───────┐
                    │   SvelteKit   │ ← CSP, HSTS, X-Frame-Options
                    │   (Node.js)   │ ← Auth guards, Zod validation
                    │   Port 3000   │ ← Rate limiting
                    └──────┬───────┘
                           │ HTTP interne
                    ┌──────▼───────┐
                    │  PocketBase   │ ← RBAC, bcrypt, filtres
                    │  (Go/SQLite)  │ ← Regles par collection
                    │  Port 8090    │
                    └──────────────┘
```

## Menaces identifiees

### Critique

| # | Menace | Probabilite | Impact | Mitigation | Statut |
|---|---|---|---|---|---|
| T1 | Acces non autorise aux donnees de lyceens | Moyenne | Critique | Auth + RBAC campus-scoped + route guards serveur | MITIGE |
| T2 | Exposition de secrets (.env, tokens) | Basse | Critique | .gitignore + scan pre-commit + CI secret scan | MITIGE |
| T3 | Deploiement de code non teste | Haute | Haute | CI obligatoire (lint + tests + build) + pre-push hook | MITIGE |
| T4 | Usurpation de compte staff | Basse | Critique | Auth password + cookies HTTPOnly Secure SameSite=Strict | MITIGE |

### Haute

| # | Menace | Probabilite | Impact | Mitigation | Statut |
|---|---|---|---|---|---|
| T5 | Injection via filtres PocketBase | Moyenne | Haute | escapePbFilter() + requetes parametrees | MITIGE |
| T6 | XSS stocke/reflechi | Basse | Haute | Svelte echappe nativement + escapeHtml() pour templates | MITIGE |
| T7 | CSRF sur les formulaires | Basse | Haute | SvelteKit verifie Origin par defaut | MITIGE |
| T8 | Scraping des donnees etudiants | Basse | Haute | Auth requise + campus-scoped + rate limiting | MITIGE |

### Moyenne

| # | Menace | Probabilite | Impact | Mitigation | Statut |
|---|---|---|---|---|---|
| T9 | DoS via requetes massives | Moyenne | Moyenne | Rate limiting + pagination + max query length | MITIGE |
| T10 | Enumeration des lyceens | Basse | Moyenne | IDs non sequentiels (PocketBase) + auth requise | MITIGE |
| T11 | Upload de fichier malveillant | Basse | Moyenne | Validation type MIME + taille max (PocketBase) | MITIGE |

## Mesures de securite en place

### Authentification
- Mots de passe hashes bcrypt (PocketBase natif)
- Sessions via cookies HTTPOnly, Secure, SameSite=Strict
- Expiration 14 jours avec refresh
- Pas de tokens dans les URLs

### Autorisation
- Route guards cote serveur (`requireAuth`, `requireAdmin`, `requireCampusAccess`)
- Regles PocketBase par collection
- Campus-scoping : un staff ne voit que son campus

### Validation des entrees
- Schemas Zod cote serveur sur tous les formulaires
- Taille max sur tous les champs texte
- Normalisation des emails (lowercase + trim)
- Sanitisation des noms de fichiers

### Headers HTTP
- `X-Frame-Options: DENY` — empeche le clickjacking
- `X-Content-Type-Options: nosniff` — empeche le MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security` (en HTTPS)
- `Content-Security-Policy` (en production)

### Infrastructure
- Docker avec utilisateur non-root
- Health checks sur les containers
- .dockerignore pour exclure les secrets
- Pas de montage de credentials Docker host

### CI/CD
- Audit npm automatique (fail sur high+)
- Scan de secrets (TruffleHog + Gitleaks)
- SAST avec CodeQL
- Scan Docker avec Trivy
- Verification de licences
- Quality gate sur chaque PR

### Git hooks
- Pre-commit : scan secrets, no console.log, lint, format
- Commit-msg : Conventional Commits
- Pre-push : tests + build
