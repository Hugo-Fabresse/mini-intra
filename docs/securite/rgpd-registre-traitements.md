# Registre des activites de traitement — RGPD

> Obligation legale (Article 30 du RGPD)
> Derniere mise a jour : 2026-04-06
> Responsable : Lead Qualite / DPO Epitech

---

## Traitement 1 : Gestion des inscriptions aux activites lyceens

| Champ | Valeur |
|---|---|
| **Responsable du traitement** | Epitech [ville/campus] |
| **Finalite** | Organiser et suivre la participation des lyceens aux activites proposees par Epitech |
| **Base legale** | Execution d'un contrat (inscription) / Obligation legale (mineurs) |
| **Personnes concernees** | Lyceens (mineurs), contacts lycees |
| **Categories de donnees** | Nom, prenom, email, etablissement, niveau scolaire |
| **Destinataires** | Personnel Epitech habilite (campus-scoped), referents lycee |
| **Transferts hors UE** | Aucun (hebergement auto-gere, donnees en France) |
| **Duree de conservation** | Duree de l'activite + 1 an apres la fin |
| **Mesures de securite** | Auth obligatoire, RBAC, chiffrement en transit (HTTPS), logs d'acces |

---

## Traitement 2 : Suivi pedagogique et progression

| Champ | Valeur |
|---|---|
| **Responsable du traitement** | Epitech [ville/campus] |
| **Finalite** | Evaluer et suivre la progression des lyceens dans les activites |
| **Base legale** | Interet legitime (suivi pedagogique) |
| **Personnes concernees** | Lyceens participants |
| **Categories de donnees** | Notes, XP, statut de participation, commentaires |
| **Destinataires** | Personnel Epitech (referent de l'activite) |
| **Transferts hors UE** | Aucun |
| **Duree de conservation** | Duree de l'activite + 1 an |
| **Mesures de securite** | Auth + campus-scoping |

---

## Traitement 3 : Authentification du personnel

| Champ | Valeur |
|---|---|
| **Responsable du traitement** | Epitech |
| **Finalite** | Gerer l'acces securise a l'application |
| **Base legale** | Interet legitime (securite) |
| **Personnes concernees** | Personnel Epitech (staff, admin) |
| **Categories de donnees** | Email, nom, campus, role, avatar |
| **Destinataires** | Systeme d'authentification interne |
| **Transferts hors UE** | Aucun |
| **Duree de conservation** | Duree du contrat de travail + 1 an |
| **Mesures de securite** | Bcrypt, cookies HTTPOnly, sessions avec expiration |

---

## Donnees collectees — Detail

| Donnee | Collection | Obligatoire | Sensible | Duree conservation |
|---|---|---|---|---|
| Nom | students | Oui | Non | Activite + 1 an |
| Prenom | students | Oui | Non | Activite + 1 an |
| Email | students | Oui | Oui (PII) | Activite + 1 an |
| Etablissement | students | Oui | Non | Activite + 1 an |
| Niveau scolaire | students | Oui | Non | Activite + 1 an |
| Campus | students | Oui | Non | Activite + 1 an |
| Notes d'evaluation | participations | Non | Oui | Activite + 1 an |
| XP | participations | Non | Non | Activite + 1 an |

## Droits des personnes

| Droit | Procedure | Delai |
|---|---|---|
| **Acces** | Demande par email a dpo@epitech.eu | 1 mois max |
| **Rectification** | Demande par email ou via le referent | 1 mois max |
| **Effacement** | Demande par email, suppression dans PocketBase | 1 mois max |
| **Portabilite** | Export JSON des donnees via l'admin | 1 mois max |
| **Opposition** | Demande par email a dpo@epitech.eu | 1 mois max |

## Consentement des mineurs

| Age | Reglement | Action requise |
|---|---|---|
| >= 15 ans | Consentement du mineur suffit | Formulaire de consentement |
| < 15 ans | Consentement parental obligatoire (Art. 8 RGPD + loi francaise) | Formulaire parental |

## Mesures de securite techniques

- [x] Authentification obligatoire pour acceder aux donnees
- [x] Controle d'acces par role (RBAC) et par campus
- [x] Chiffrement en transit (HTTPS)
- [x] Validation des entrees (Zod)
- [x] Headers HTTP securises
- [x] Pas de donnees personnelles dans les logs
- [x] Pas de donnees personnelles dans les URLs
- [x] Scan de secrets dans la CI
- [ ] Chiffrement au repos (a implementer si requis)
- [ ] Audit logging des acces aux donnees (a implementer)
