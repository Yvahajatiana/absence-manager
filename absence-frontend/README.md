# Absence Frontend

Interface web React pour la gestion des déclarations d'absence domiciliaire.

## 🚀 Technologies

- **React 18** + TypeScript
- **Vite** pour le build
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **React Query** pour la gestion d'état API
- **React Hook Form** pour les formulaires
- **Heroicons** pour les icônes

## 📋 Fonctionnalités

- ✅ **Tableau de bord** avec statistiques
- ✅ **Liste paginée** des déclarations
- ✅ **Formulaire de création/modification**
- ✅ **Détail des déclarations**
- ✅ **Validation en temps réel**
- ✅ **Interface responsive**
- ✅ **Gestion d'erreurs**
- ✅ **Loading states**

## 🛠️ Développement

### Installation

```bash
npm install
```

### Scripts

```bash
npm run dev      # Serveur de développement (port 5173)
npm run build    # Build de production
npm run preview  # Aperçu du build
npm run lint     # Linting ESLint
```

### Variables d'environnement

Créer un fichier `.env` :

```env
VITE_API_URL=http://localhost:3000/api
```

## 🎨 Structure des composants

### Pages principales

- **HomePage** : Tableau de bord avec actions rapides
- **AbsenceListPage** : Liste paginée avec filtres
- **CreateAbsencePage** : Formulaire de création/modification
- **AbsenceDetailPage** : Affichage détaillé

### Composants communs

- **Layout** : Structure principale avec navigation
- **LoadingSpinner** : Indicateur de chargement
- **ErrorMessage** : Affichage d'erreurs avec retry

### Services

- **api.ts** : Client Axios configuré
- **useAbsences.ts** : Hooks React Query

## 🔗 API Integration

Le frontend communique avec le backend via des hooks React Query :

```typescript
// Lister les absences
const { data, isLoading } = useAbsences(page, limit)

// Créer une absence
const createMutation = useCreateAbsence()

// Récupérer une absence
const { data: absence } = useAbsence(id)
```

## 🎨 Styling

Utilise Tailwind CSS avec une configuration personnalisée :

- **Couleurs** : Palette primary blue
- **Responsive** : Mobile-first design
- **Composants** : Classes utilitaires Tailwind

## 📱 Interface responsive

- **Mobile** : Navigation hamburger, layout adaptatif
- **Tablet** : Layout 2 colonnes
- **Desktop** : Layout complet avec sidebar

## 🚀 Build et déploiement

### Build local

```bash
npm run build
# Les fichiers sont générés dans ./dist/
```

### Docker

```bash
# Build de l'image
docker build -t absence-frontend .

# Run du container
docker run -p 8080:80 absence-frontend
```

### Nginx

Le container utilise Nginx avec :
- Compression gzip
- Cache des assets statiques
- Proxy API vers le backend
- Support SPA routing

## 🧪 Tests

Pour tester l'interface :

1. Démarrer le backend sur port 3000
2. Démarrer le frontend : `npm run dev`
3. Ouvrir http://localhost:5173

## 📊 Performance

- **Bundle size** optimisé avec Vite
- **Code splitting** automatique
- **Lazy loading** des routes
- **Cache API** avec React Query
- **Compression** assets en production