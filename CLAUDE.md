# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

API REST Node.js dockerisée pour la déclaration d'absences domiciliaires destinées aux services de police. Application complète avec base de données SQLite, validation robuste et déploiement Docker.

## Development Commands

```bash
# Installation des dépendances
npm install

# Développement local
npm run dev

# Production locale
npm start

# Docker - Construction et démarrage
npm run docker:build
npm run docker:run
npm run docker:dev

# Docker Compose (recommandé)
docker-compose up --build
```

## Project Structure

```
src/
├── config/
│   └── database.js          # Configuration Sequelize SQLite
├── models/
│   ├── Absence.js           # Modèle avec validations Sequelize
│   └── index.js             # Initialisation base de données
├── routes/
│   └── absences.js          # Endpoints API REST
├── middleware/
│   └── errorHandler.js      # Gestion d'erreurs centralisée
├── validators/
│   └── absenceValidator.js  # Validation Joi
└── app.js                   # Application Express principale
```

## API Endpoints

- `POST /api/absences` - Créer une déclaration
- `GET /api/absences/:id` - Récupérer une déclaration
- `PUT /api/absences/:id` - Modifier une déclaration
- `GET /api/absences` - Lister avec pagination
- `GET /health` - Health check
- `GET /api` - Documentation
- `GET /api-docs` - Documentation Swagger interactive

## Data Model

Modèle Absence avec champs : id, dateDebut, dateFin, coordonneesPers (lat/lng), adresseDomicile, dateCreation, dateModification.

## Tech Stack

- **Framework**: Express.js
- **Base de données**: SQLite avec Sequelize ORM
- **Validation**: Joi pour requêtes + Sequelize pour modèles
- **Documentation**: Swagger/OpenAPI 3.0 avec swagger-ui-express
- **Sécurité**: Helmet, CORS
- **Docker**: Multi-stage build optimisé
- **Persistance**: Volume Docker pour SQLite

## Testing API

Documentation complète disponible :
- **Swagger UI interactif** : `/api-docs` - Test des endpoints en direct
- **Documentation JSON** : `/api` - Résumé des endpoints
- **Health check** : `/health` - Statut de l'API

Base de données automatiquement initialisée au démarrage dans `./data/database.sqlite`.

## Docker Setup

- Dockerfile multi-stage pour optimisation
- docker-compose.yml avec volumes persistants
- Health checks intégrés
- Utilisateur non-root pour sécurité