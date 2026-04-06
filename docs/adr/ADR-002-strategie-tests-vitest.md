# ADR-002 : Strategie de tests avec Vitest + Playwright

**Date** : 2026-04-06
**Statut** : [x] Accepte
**Decideurs** : Lead Qualite

## Contexte

Le repo principal n'a aucun test. Il faut definir une strategie de tests pour le projet.

## Options considerees

### Option 1 : Jest + Cypress
- Avantages : Ecosysteme mature, grande communaute
- Inconvenients : Lent, configuration complexe avec SvelteKit, Cypress lourd

### Option 2 : Vitest + Playwright
- Avantages : Integration native Vite, rapide, Playwright leger et fiable
- Inconvenients : Ecosysteme plus jeune

## Decision

**Choix retenu** : Option 2 — Vitest + Playwright

**Justification** :
- Vitest est le test runner recommande pour les projets Vite/SvelteKit
- Partage la config Vite (aliases, transforms)
- Playwright est plus stable et rapide que Cypress pour les tests E2E

## Pyramide de tests

```
        /\
       / E2E \        — Playwright : parcours critiques (10%)
      /--------\
     / Integration\   — Vitest : services + DB (20%)
    /--------------\
   /  Unitaires     \ — Vitest : utils, schemas, erreurs (70%)
  /------------------\
```

## Priorites de tests

1. **Critique** : Auth, guards, validation, wrapper DB
2. **Haute** : Services metier, transformations
3. **Normale** : Composants, utilitaires
