# Norme d'ecriture de code

> Ce document est la reference pour tout le code du projet.
> Il est applique automatiquement par ESLint, Prettier et les git hooks.

## Nommage

| Element | Convention | Exemple |
|---|---|---|
| Composants Svelte | PascalCase | `StudentForm.svelte` |
| Fichiers utilitaires | kebab-case | `date-formatter.ts` |
| Fonctions | camelCase | `getStudentById()` |
| Variables | camelCase | `studentList` |
| Constantes | UPPER_SNAKE_CASE | `MAX_REGISTRATION_PER_EVENT` |
| Types / Interfaces | PascalCase | `StudentRegistration` |
| Stores Svelte | camelCase + suffixe Store | `studentStore` |
| Schemas Zod | camelCase + suffixe Schema | `studentSchema` |
| Fichiers de test | `nom.test.ts` | `sanitize.test.ts` |
| Fichiers de test E2E | `nom.spec.ts` | `auth-flow.spec.ts` |

## TypeScript

### Obligatoire
- `strict: true` dans `tsconfig.json`
- `noUncheckedIndexedAccess: true`
- Typer tous les parametres et retours de fonctions
- Utiliser des interfaces pour toutes les entites metier
- Exports nommes (pas de `export default` pour les utils)

### Interdit (applique par ESLint)
- `any` → utiliser `unknown` et affiner avec des type guards
- `@ts-ignore` → utiliser `@ts-expect-error` avec commentaire
- `as Type` sans verification prealable
- `!` (non-null assertion) sans commentaire justificatif
- `eval()` et `new Function()`
- `var` → toujours `const` ou `let`

### Exemples

```typescript
// INTERDIT
async function getStudent(id: any): any {
  const result = await db.getOne('students', id) as Student
  return result
}

// CORRECT
async function getStudent(id: string): Promise<Student | null> {
  return db.getOne<Student>('students', id)
}
```

## Gestion des erreurs

```
API / DB          → erreur brute (code HTTP, message PocketBase)
      ↓ transformation
Service layer     → ServiceError avec code metier
      ↓ transformation
Store Svelte      → etat d'erreur (error: string | null)
      ↓ transformation
Composant UI      → message adapte a l'utilisateur
```

### Regles strictes
- **Ne jamais** afficher un message d'erreur brut a l'utilisateur
- **Ne jamais** avoir un `catch` vide
- **Ne jamais** logger de donnees personnelles (nom, email, tel) dans les erreurs
- **Toujours** utiliser `ServiceError` dans la couche service
- **Toujours** retourner des messages generiques aux utilisateurs

## Limites de complexite (applique par ESLint)

| Metrique | Seuil | Justification |
|---|---|---|
| Complexite cyclomatique | max 15 | Fonction trop complexe = bug cache |
| Profondeur d'imbrication | max 4 | Code illisible au-dela |
| Lignes par fonction | max 100 | Extraire en sous-fonctions |
| Parametres de fonction | max 5 | Utiliser un objet si plus |

## Structure des composants Svelte

```svelte
<script lang="ts">
  // 1. Imports
  // 2. Props (interface Props)
  // 3. Etat local
  // 4. Fonctions handlers
</script>

<!-- Template HTML minimal, pas de logique complexe -->

<style>
  /* Styles scopes si necessaire (preferrer Tailwind) */
</style>
```

### Regles Svelte
- Pas de logique metier dans les `.svelte` (deleguer aux services)
- Props typees obligatoires
- Pas de `$effect` complexes (extraire dans des fonctions)
- Composant > 200 lignes = a decouper

## CSS / Tailwind

- Tailwind CSS pour le styling principal
- Pas de styles inline (sauf valeurs dynamiques calculees)
- Pas de `!important`
- Mobile-first pour les media queries
- Composants UI reutilisables dans `lib/components/ui/`

## Imports

```typescript
// Ordre des imports (applique par ESLint) :
// 1. Modules Node.js natifs
// 2. Packages externes
// 3. Modules internes ($lib/...)
// 4. Types

import { json } from '@sveltejs/kit';        // framework
import { z } from 'zod';                      // externe
import { StudentService } from '$lib/server/services/student.service'; // interne
import type { Student } from '$lib/types/entities'; // types
```

## Commits & Branches

### Conventional Commits (applique par hook commit-msg)

Format : `type(scope): description courte en minuscules`

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalite |
| `fix` | Correction de bug |
| `refactor` | Refactoring sans changement fonctionnel |
| `test` | Ajout ou modification de tests |
| `docs` | Documentation uniquement |
| `chore` | Maintenance (dependances, config) |
| `ci` | Pipeline CI/CD |
| `style` | Formatage uniquement |
| `perf` | Amelioration de performance |

### Branches

Format : `type/description-courte` (kebab-case, 3-5 mots max)

- `feature/formulaire-inscription`
- `fix/validation-email-lyceen`
- **Jamais de commit direct sur `main`**

## Definition of Done

Une feature est DONE quand :

- [ ] Tests ecrits et passants
- [ ] ESLint sans erreur
- [ ] Prettier applique
- [ ] Svelte-check sans erreur
- [ ] PR reviewee et approuvee (min 1)
- [ ] Checklist securite PR completee
- [ ] Pas de regression sur les tests existants
- [ ] Documentation mise a jour si necessaire
