# API REST Absences Domiciliaires

API Node.js dockerisée pour la gestion des déclarations d'absence domiciliaire destinées aux services de police.

## 🚀 Fonctionnalités

- ✅ Création de déclarations d'absence
- ✅ Consultation de déclarations par ID
- ✅ Modification de déclarations existantes
- ✅ Listing paginé des déclarations
- ✅ Validation complète des données (Joi + Sequelize)
- ✅ Gestion d'erreurs robuste
- ✅ Base de données SQLite avec persistance
- ✅ Application entièrement dockerisée
- ✅ API REST documentée

## 📋 Modèle de données

```json
{
  "id": "integer (auto-généré)",
  "dateDebut": "string (YYYY-MM-DD)",
  "dateFin": "string (YYYY-MM-DD)",
  "firstname": "string (2-50 caractères)",
  "lastname": "string (2-50 caractères)",
  "phone": "string (format français: 0123456789 ou +33123456789)",
  "email": "string (optionnel, format email valide)",
  "adresseDomicile": "string (10-500 caractères)",
  "dateCreation": "timestamp (auto-généré)",
  "dateModification": "timestamp (auto-géré)"
}
```

## 🔗 Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/absences` | Créer une déclaration |
| `GET` | `/api/absences/:id` | Récupérer une déclaration |
| `PUT` | `/api/absences/:id` | Modifier une déclaration |
| `GET` | `/api/absences` | Lister avec pagination |
| `GET` | `/health` | État de l'API |
| `GET` | `/api` | Documentation |
| `GET` | `/api-docs` | Documentation Swagger interactive |

## 🐳 Installation et utilisation Docker

### Prérequis
- Docker
- Docker Compose

### 1. Construction et démarrage

```bash
# Démarrage avec docker-compose (recommandé)
docker-compose up --build

# Ou construction manuelle
docker build -t absence-backend .
docker run -p 3000:3000 absence-backend
```

### 2. Variables d'environnement

Copiez `.env.example` vers `.env` et ajustez les valeurs :

```bash
cp .env.example .env
```

### 3. Scripts npm disponibles

```bash
# Développement local (nécessite Node.js)
npm install
npm run dev

# Docker
npm run docker:build
npm run docker:run
npm run docker:dev
```

## 📝 Exemples d'utilisation

### Créer une déclaration

```bash
curl -X POST http://localhost:3000/api/absences \
  -H "Content-Type: application/json" \
  -d '{
    "dateDebut": "2024-01-15",
    "dateFin": "2024-01-20",
    "firstname": "Jean",
    "lastname": "Dupont",
    "phone": "0123456789",
    "email": "jean.dupont@email.fr",
    "adresseDomicile": "123 Rue de la Paix, 75001 Paris, France"
  }'
```

### Récupérer une déclaration

```bash
curl http://localhost:3000/api/absences/1
```

### Modifier une déclaration

```bash
curl -X PUT http://localhost:3000/api/absences/1 \
  -H "Content-Type: application/json" \
  -d '{
    "dateFin": "2024-01-25"
  }'
```

### Lister les déclarations

```bash
curl "http://localhost:3000/api/absences?page=1&limit=10"
```

## 🏗️ Architecture du projet

```
absence-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuration Sequelize
│   ├── models/
│   │   ├── Absence.js           # Modèle Absence
│   │   └── index.js             # Export et initialisation
│   ├── routes/
│   │   └── absences.js          # Routes API REST
│   ├── middleware/
│   │   └── errorHandler.js      # Gestion d'erreurs
│   ├── validators/
│   │   └── absenceValidator.js  # Validation Joi
│   └── app.js                   # Application Express
├── data/                        # Base SQLite (persistée)
├── Dockerfile                   # Image Docker multi-stage
├── docker-compose.yml           # Orchestration
├── .env.example                 # Variables d'environnement
└── package.json                 # Dépendances et scripts
```

## 🔧 Développement local

### Prérequis
- Node.js 18+
- npm

### Installation

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev
```

L'API sera accessible sur `http://localhost:3000`

### 📖 Documentation Swagger

Une fois l'application démarrée, accédez à la documentation interactive Swagger :
- **URL** : `http://localhost:3000/api-docs`
- **Fonctionnalités** : Tests d'endpoints en direct, schémas de données, exemples de requêtes

## 🛡️ Sécurité

- ✅ Validation stricte des entrées (Joi + Sequelize)
- ✅ Helmet.js pour les headers de sécurité
- ✅ CORS configuré
- ✅ Container Docker non-root
- ✅ Gestion d'erreurs sécurisée (pas d'exposition de stack traces en production)

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3000/health
```

### Docker Health Check

Le container inclut un health check automatique qui vérifie l'état de l'API toutes les 30 secondes.

## 📂 Persistance des données

La base de données SQLite est persistée via un volume Docker dans le dossier `./data/`. 

⚠️ **Important** : Assurez-vous de sauvegarder ce dossier en production.

## 🐛 Debugging

### Logs Docker

```bash
# Voir les logs du container
docker-compose logs -f absence-api

# Logs en temps réel
docker logs -f absence-backend
```

### Inspection de la base

La base SQLite est accessible dans `./data/database.sqlite` et peut être inspectée avec des outils comme SQLite Browser.

## 🤝 Support

- **Documentation Swagger interactive** : `GET /api-docs`
- **Documentation API** : `GET /api`
- **Health check** : `GET /health`
- **Logs détaillés** en mode développement

## 📊 Nouvelle fonctionnalité : Documentation Swagger

✅ **Documentation OpenAPI 3.0 complète** avec :
- Interface Swagger UI interactive
- Test des endpoints en direct
- Schémas de données détaillés avec exemples
- Validation des paramètres en temps réel
- Exemples de requêtes/réponses pour tous les endpoints