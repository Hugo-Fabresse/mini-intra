# Guide de contribution

## Prerequis

Avoir lu et compris :
- La norme d'ecriture de code (`docs/norme-code.md`)
- Les conventions de commits (Conventional Commits)
- Ce guide

## Workflow

1. Creer une issue avant toute modification significative
2. Creer une branche depuis `develop` : `type/description-courte`
3. Developper en respectant la norme de code
4. Tester : `pnpm test` doit etre au vert
5. Lint : `pnpm lint` doit etre sans erreur
6. Commit en respectant les Conventional Commits
7. Ouvrir une PR avec le template fourni
8. Repondre aux commentaires de review dans les 24h
9. Merger une fois approuve (squash merge)

## Conventions de commits

Format : `type(scope): description courte`

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalite |
| `fix` | Correction de bug |
| `refactor` | Refactoring sans changement fonctionnel |
| `test` | Ajout ou modification de tests |
| `docs` | Documentation uniquement |
| `chore` | Maintenance (dependances, config) |
| `ci` | Pipeline CI/CD |

## Conventions de branches

Format : `type/description-courte` (kebab-case, 3-5 mots max)

Exemples : `feature/formulaire-inscription`, `fix/validation-email`

## Ce qui sera refuse en PR

- Code sans tests sur des fonctionnalites critiques
- `any` TypeScript sans justification
- Secrets ou donnees personnelles dans le code
- PR qui ne respecte pas le template
- `console.log` oublie

## Code review

- Minimum 1 approbation avant merge
- Delai max de review : 24h (jours ouvres)
- `BLOCKER` : bug, faille secu, violation norme = bloque le merge
- `SUGGESTION` : amelioration non bloquante
- `NOTE` : observation sans action requise
