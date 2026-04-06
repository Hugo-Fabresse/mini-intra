# Glossaire metier

> Definitions des entites metier du projet. Utiliser ces noms dans le code (anglais) et la documentation (francais).

| Nom code | Nom metier FR | Definition |
|---|---|---|
| `Student` | Lyceen | Eleve de lycee participant a une activite Epitech |
| `School` | Etablissement | Lycee partenaire ou ayant des eleves inscrits |
| `Event` | Evenement | Terme generique : stage, journee portes ouvertes, hackathon, coding club |
| `Internship` | Stage | Periode de stage d'un lyceen au sein d'Epitech |
| `CodingClub` | Coding Club | Atelier recurrent de programmation pour lyceens |
| `Registration` | Inscription | Participation d'un lyceen a une activite |
| `Participation` | Participation | Lien entre un etudiant et un evenement avec statut et notes |
| `Supervisor` | Referent | Personne Epitech responsable d'une activite |
| `Contact` | Contact lycee | Enseignant ou CPE referent cote lycee |
| `User` | Utilisateur | Personnel Epitech utilisant l'intranet (staff ou admin) |
| `Campus` | Campus | Site Epitech (Paris, Lyon, Marseille, etc.) |

## Relations principales

```
Student ──N:M──▶ Event       (via Participation)
User    ──1:N──▶ Event       (createur)
Student ──N:1──▶ School      (etablissement)
User    ──N:1──▶ Campus      (affectation)
Event   ──N:1──▶ Campus      (lieu)
```
