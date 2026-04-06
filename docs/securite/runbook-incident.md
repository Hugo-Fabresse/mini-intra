# Runbook — Gestion des incidents de securite

> Procedure a suivre en cas d'incident de securite.
> Contact securite : security@epitech.eu

## Niveaux de severite

| Niveau | Definition | Exemples | Delai de reponse |
|---|---|---|---|
| **P0 — Critique** | Donnees de mineurs exposees ou compromises | Fuite de BDD, acces non autorise aux donnees | Immediat (< 1h) |
| **P1 — Haute** | Vulnerabilite exploitable sans acces aux donnees | XSS, injection, bypass auth | < 4h |
| **P2 — Moyenne** | Vulnerabilite potentielle, non exploitee | Dependance vulnerable, config faible | < 24h |
| **P3 — Basse** | Amelioration de securite, pas de risque immediat | Header manquant, mise a jour preventive | Sprint suivant |

## Procedure P0 — Donnees compromises

### 1. Confinement immediat (< 15 min)
- [ ] Identifier la source de la compromission
- [ ] Couper l'acces si necessaire (docker compose down)
- [ ] Revoquer les tokens/sessions compromis
- [ ] Changer les credentials admin PocketBase

### 2. Evaluation (< 1h)
- [ ] Quelles donnees sont impactees ?
- [ ] Combien de personnes concernees ?
- [ ] L'attaque est-elle toujours en cours ?
- [ ] Collecter les logs et preuves

### 3. Notification (< 24h si donnees personnelles)
- [ ] Informer le DPO Epitech
- [ ] Notifier la CNIL sous 72h (obligation RGPD Art. 33)
- [ ] Si risque eleve pour les personnes : notifier les personnes concernees (Art. 34)
- [ ] Documenter dans le registre des violations

### 4. Remediation
- [ ] Corriger la vulnerabilite
- [ ] Deployer le correctif
- [ ] Verifier que la faille est corrigee
- [ ] Mettre a jour les credentials/tokens

### 5. Post-mortem
- [ ] Rediger le post-mortem (voir template ci-dessous)
- [ ] Identifier les actions preventives
- [ ] Mettre a jour la checklist securite
- [ ] Partager avec l'equipe

## Template post-mortem

```markdown
# Post-mortem : [titre de l'incident]

**Date** :
**Severite** : P0 / P1 / P2 / P3
**Duree de l'impact** :
**Donnees impactees** : Oui / Non
**Personnes impactees** : [nombre]

## Resume
[2-3 phrases]

## Chronologie
| Heure | Evenement |
|---|---|
| HH:MM | Detection |
| HH:MM | Confinement |
| HH:MM | Resolution |

## Cause racine
[Pas "qui" mais "quelle condition a permis que ca arrive"]

## Actions correctives
| Action | Responsable | Date limite | Statut |
|---|---|---|---|
| | | | |

## Lecons apprises
-
```

## Contacts

| Role | Contact |
|---|---|
| Lead Qualite | [email] |
| DPO Epitech | dpo@epitech.eu |
| Securite | security@epitech.eu |
| CNIL (notification violation) | https://notifications.cnil.fr/ |
