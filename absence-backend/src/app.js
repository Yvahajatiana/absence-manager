require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const { initializeDatabase } = require('./models');
const absenceRoutes = require('./routes/absences');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "https:"]
    }
  }
}));
app.use(cors());

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging en développement
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Absences Domiciliaires - Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true
  }
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Vérifier l'état de l'API
 *     description: Endpoint de health check pour vérifier que l'API fonctionne correctement
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API opérationnelle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "API d'absences domiciliaires opérationnelle"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *                 environment:
 *                   type: string
 *                   example: "production"
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API d\'absences domiciliaires opérationnelle',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes API
app.use('/api/absences', absenceRoutes);

// Documentation des endpoints (redirige vers Swagger)
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API REST pour la déclaration d\'absences domiciliaires',
    documentation: 'http://localhost:3000/api-docs',
    endpoints: {
      'POST /api/absences': 'Créer une déclaration d\'absence',
      'GET /api/absences/:id': 'Récupérer une déclaration par ID',
      'PUT /api/absences/:id': 'Modifier une déclaration existante',
      'GET /api/absences': 'Lister toutes les déclarations (avec pagination)',
      'GET /health': 'Vérifier l\'état de l\'API',
      'GET /api-docs': 'Documentation Swagger interactive'
    },
    note: 'Consultez /api-docs pour une documentation interactive complète'
  });
});

// Gestionnaires d'erreurs
app.use(notFoundHandler);
app.use(errorHandler);

// Fonction de démarrage du serveur
const startServer = async () => {
  try {
    // Créer le dossier data s'il n'existe pas
    const fs = require('fs');
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Initialiser la base de données
    await initializeDatabase();

    // Démarrer le serveur
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`URL de santé: http://localhost:${PORT}/health`);
      console.log(`Documentation API: http://localhost:${PORT}/api`);
      console.log(`Documentation Swagger: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('Signal SIGTERM reçu, arrêt gracieux...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Signal SIGINT reçu, arrêt gracieux...');
  process.exit(0);
});

// Démarrer le serveur si ce fichier est exécuté directement
if (require.main === module) {
  startServer();
}

module.exports = app;