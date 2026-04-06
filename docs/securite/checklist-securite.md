# Checklist Securite

> A verifier a chaque release et audit periodique.
> Derniere verification : 2026-04-06

## Authentification & Autorisation

- [x] Mots de passe hashes (bcrypt via PocketBase)
- [x] Sessions avec expiration configuree (14 jours)
- [x] Cookies HTTPOnly, Secure, SameSite=Strict
- [x] Pas de tokens dans les URLs
- [x] Verification des droits cote serveur sur chaque route
- [x] Roles definis et appliques : admin / staff
- [x] Campus-scoping : un staff ne voit que ses donnees
- [x] Redirection vers login si non authentifie
- [x] Messages d'erreur generiques (ne revele pas si email existe)

## Entrees utilisateur

- [x] Validation de tous les champs cote serveur (Zod)
- [x] Sanitisation des entrees (escapeHtml, escapePbFilter)
- [x] Types corrects verifies (email, date, select)
- [x] Taille maximale des champs definie (100, 200, 2000 chars)
- [x] Longueur de recherche limitee (min 2, max 100)
- [ ] Upload de fichiers : types acceptes restreints, taille limitee

## Exposition des donnees

- [x] Variables d'environnement : aucun secret dans `PUBLIC_`
- [x] Reponses API ne renvoient que les champs necessaires
- [x] Erreurs API ne revelent pas de details internes
- [x] Headers HTTP securises (CSP, HSTS, X-Frame-Options, etc.)
- [x] Pas de donnees personnelles dans les URLs
- [x] Pas de donnees personnelles dans les logs

## Injection

- [x] Filtres PocketBase echappes (escapePbFilter)
- [x] XSS prevenu par Svelte (echappement natif)
- [x] escapeHtml() disponible pour les templates non-Svelte
- [x] CSRF verifie par SvelteKit (Origin header)
- [x] Pas d'eval() ni new Function() (interdit par ESLint)

## Dependances

- [x] npm audit integre dans la CI (fail sur high+)
- [x] Scan de vulnerabilites Docker (Trivy)
- [x] Verification des licences (pas de GPL dans les deps)
- [x] Scan hebdomadaire automatique (cron CI)

## Infrastructure

- [x] Docker avec utilisateur non-root
- [x] .dockerignore exclut node_modules, .env, .git
- [x] Health checks sur les containers
- [x] Pas de montage de credentials Docker host
- [ ] HTTPS en production (a configurer selon l'hebergeur)
- [ ] Backups automatises SQLite

## CI/CD

- [x] Pipeline lint + tests + build obligatoire
- [x] Audit npm dans la CI
- [x] Scan de secrets (TruffleHog + Gitleaks)
- [x] SAST (CodeQL)
- [x] Scan Docker (Trivy)
- [x] Quality gate sur chaque PR
- [x] Pre-commit hook : lint + format + secrets
- [x] Pre-push hook : tests + build

## RGPD

- [x] Registre des traitements redige
- [x] Politique de confidentialite redigee
- [x] Droits des personnes documentes
- [x] Consentement mineurs documente
- [ ] Mentions RGPD sur les formulaires (a integrer dans l'UI)
- [ ] Workflow de consentement parental (a implementer)
- [ ] Procedure de purge automatique (a implementer)
