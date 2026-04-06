# ADR-001 : Wrapper DB avec interface abstraite

**Date** : 2026-04-06
**Statut** : [x] Accepte
**Decideurs** : Lead Qualite

## Contexte

Le projet utilise PocketBase comme backend. Une migration vers Supabase est prevue.
Le code actuel (repo principal) fait des appels directs au SDK PocketBase partout, ce qui rend la migration couteuse.

## Options considerees

### Option 1 : Appels directs au SDK PocketBase
- Avantages : Simple, rapide a ecrire, pas d'abstraction
- Inconvenients : Migration = reecriture de tout le code, impossible de tester sans PocketBase

### Option 2 : Interface IDatabase avec adaptateurs
- Avantages : Migration transparente, testable avec mock, separation des responsabilites
- Inconvenients : Abstraction supplementaire, overhead initial

## Decision

**Choix retenu** : Option 2 — Interface IDatabase avec adaptateurs

**Justification** :
- La migration Supabase est confirmee, l'investissement est justifie
- L'adaptateur memoire permet des tests unitaires rapides et fiables
- Le code metier ne depend plus d'une implementation specifique

## Consequences

**Positives** :
- Tests unitaires sans PocketBase
- Migration Supabase sans toucher au code metier
- Possibilite de faire coexister les deux pendant la migration

**Negatives / risques** :
- Overhead d'abstraction pour les cas simples
- L'interface doit couvrir tous les besoins (risque de fuites d'abstraction)

**Actions a prevoir** :
- Implementer `PocketBaseAdapter` et `MemoryAdapter`
- Ecrire les tests de l'interface (validant les deux adaptateurs)
- Migrer progressivement le code existant vers l'interface
