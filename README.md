# Absence Manager - Monorepo

Système complet de gestion des déclarations d'absence domiciliaire avec backend API et interface web React.

## 🏗️ Structure du projet

```
absence-manager/
├── absence-backend/     # API REST Node.js + SQLite
├── absence-frontend/    # Interface React + Tailwind CSS
├── package.json         # Configuration monorepo
├── docker-compose.yml   # Orchestration complète
└── README.md           # Documentation
```

## 🚀 Démarrage rapide

### Avec Docker (recommandé)

```bash
# Démarrer tout l'environnement
docker-compose up --build

# Applications accessibles :
# - Frontend: http://localhost:8080
# - Backend API: http://localhost:3000
# - Documentation Swagger: http://localhost:3000/api-docs
```

### Développement local

```bash
# Installation des dépendances pour tous les projets
npm install

# Démarrage en mode développement (backend + frontend)
npm run dev

# Ou démarrer individuellement :
npm run dev:backend   # Port 3000
npm run dev:frontend  # Port 5173
```

## 📋 Scripts disponibles

```bash
# Développement
npm run dev              # Backend + Frontend en parallèle
npm run dev:backend      # Backend uniquement
npm run dev:frontend     # Frontend uniquement

# Build
npm run build            # Build des deux projets
npm run build:backend    # Build backend
npm run build:frontend   # Build frontend

# Docker
npm run docker:up        # docker-compose up --build
npm run docker:down      # docker-compose down

# Base de données
npm run migrate          # Exécuter les migrations
npm run migrate:rollback # Annuler la dernière migration

# Tests et qualité
npm run test            # Tests pour tous les projets
npm run lint            # Linting pour tous les projets
```

## 🛠️ Technologies

### Backend (`absence-backend/`)
- **Framework** : Express.js
- **Base de données** : SQLite + Sequelize ORM
- **Validation** : Joi + Sequelize validators
- **Documentation** : Swagger/OpenAPI 3.0
- **Container** : Node.js Alpine

### Frontend (`absence-frontend/`)
- **Framework** : React 18 + Vite
- **UI** : Tailwind CSS + Heroicons
- **Routing** : React Router
- **State** : React Query pour API calls
- **Forms** : React Hook Form
- **Container** : Nginx Alpine

## 🔗 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/absences` | Créer une déclaration |
| `GET` | `/api/absences/:id` | Récupérer une déclaration |
| `PUT` | `/api/absences/:id` | Modifier une déclaration |
| `GET` | `/api/absences` | Lister avec pagination |
| `GET` | `/health` | Health check |
| `GET` | `/api-docs` | Documentation Swagger |

## 📊 Modèle de données

```typescript
interface Absence {
  id: number
  dateDebut: string        // YYYY-MM-DD
  dateFin: string          // YYYY-MM-DD
  firstname: string        // 2-50 caractères
  lastname: string         // 2-50 caractères
  phone: string           // Format français
  email?: string          // Optionnel
  adresseDomicile: string // 10-500 caractères
  dateCreation: string    // Auto-généré
  dateModification: string // Auto-géré
}
```

## 🐳 Configuration Docker

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=8080
VITE_API_URL=http://localhost:3000/api
```

### Services Docker

- **backend** : API sur port 3000
- **frontend** : Interface sur port 8080
- **Volumes** : Persistance SQLite dans `./data/`
- **Network** : Réseau bridge interne
- **Health checks** : Surveillance automatique

## 📁 Structure détaillée

### Backend (`absence-backend/`)
```
src/
├── config/
│   ├── database.js      # Configuration SQLite
│   ├── migration.js     # Système de migration
│   └── swagger.js       # Documentation OpenAPI
├── models/
│   └── Absence.js       # Modèle Sequelize
├── routes/
│   └── absences.js      # Endpoints API
├── validators/
│   └── absenceValidator.js # Validation Joi
├── middleware/
│   └── errorHandler.js  # Gestion d'erreurs
└── migrations/
    └── 001-update-absence-model.js
```

### Frontend (`absence-frontend/`)
```
src/
├── components/
│   ├── Layout.tsx       # Layout principal
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── pages/
│   ├── HomePage.tsx     # Tableau de bord
│   ├── AbsenceListPage.tsx # Liste paginée
│   ├── CreateAbsencePage.tsx # Formulaire
│   └── AbsenceDetailPage.tsx # Détail
├── services/
│   └── api.ts          # Client API Axios
├── hooks/
│   └── useAbsences.ts  # Hooks React Query
├── types/
│   └── absence.ts      # Types TypeScript
└── utils/
    ├── date.ts         # Utilitaires dates
    └── validation.ts   # Validation frontend
```

## 🔧 Développement

### Prérequis
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation initiale

```bash
git clone <repo>
cd absence-manager
npm install
```

### Base de données

La base SQLite est automatiquement créée au premier démarrage. Les migrations se lancent automatiquement.

### Tests API

```bash
# Test avec curl
curl -X POST http://localhost:3000/api/absences \
  -H "Content-Type: application/json" \
  -d '{
    "dateDebut": "2024-02-15",
    "dateFin": "2024-02-20",
    "firstname": "Marie",
    "lastname": "Martin",
    "phone": "0145678901",
    "email": "marie.martin@email.fr",
    "adresseDomicile": "456 Avenue des Champs-Élysées, 75008 Paris"
  }'
```

## 🚨 Production

### Déploiement Docker

```bash
# Build et démarrage
docker-compose -f docker-compose.yml up -d

# Vérification des services
docker-compose ps
docker-compose logs -f
```

### Sauvegardes

Important : Sauvegarder régulièrement le dossier `./data/` qui contient la base SQLite.

## 📖 Documentation

- **API** : http://localhost:3000/api-docs (Swagger)
- **Backend** : `absence-backend/README.md`
- **Frontend** : `absence-frontend/README.md`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request