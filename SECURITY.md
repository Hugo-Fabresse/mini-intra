# Politique de securite

## Versions supportees

| Version | Support securite |
|---|---|
| main | Supportee |
| develop | Supportee |
| branches de feature | Non supportee |

## Signaler une vulnerabilite

Si vous decouvrez une vulnerabilite de securite, **ne pas ouvrir une issue publique**.

Contactez directement : security@epitech.eu

Informations a inclure :
- Description de la vulnerabilite
- Etapes pour la reproduire
- Impact potentiel estime
- Version / environnement concerne

## Delai de reponse

- Accuse de reception : sous 48h
- Evaluation initiale : sous 7 jours
- Correctif pour vulnerabilite critique : sous 30 jours

## Donnees concernees

Ce projet traite des donnees personnelles de mineurs.
Toute faille impliquant ces donnees sera traitee en **priorite absolue**.

## Bonnes pratiques appliquees

- Authentification OAuth2 avec PKCE
- Cookies HTTPOnly, Secure, SameSite=Strict
- Validation des entrees cote serveur (Zod)
- Pas de secrets dans le code source
- Headers HTTP securises (CSP, HSTS, X-Frame-Options)
- Rate limiting sur les endpoints sensibles
- Audit npm integre dans la CI
