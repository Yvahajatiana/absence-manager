import 'reflect-metadata';
import dotenv from 'dotenv';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger';

// Infrastructure
import { databaseConfig } from '@infrastructure/database/DatabaseConfig';
import { configureDependencyInjection } from '@shared/container/DIConfig';
import { createAbsenceRoutes } from '@infrastructure/web/routes/absences';
import { ResponseFormatter } from '@infrastructure/web/responses/ResponseFormatter';

// Charger les variables d'environnement
dotenv.config();

/**
 * Application Express avec architecture SOLID
 * Responsabilité : Configuration et orchestration de l'application
 */
export class App {
  private app: Application;
  private responseFormatter: ResponseFormatter;

  constructor() {
    this.app = express();
    this.responseFormatter = new ResponseFormatter();
  }

  /**
   * Initialiser l'application
   */
  async initialize(): Promise<Application> {
    try {
      // Configuration de la base de données
      await this.initializeDatabase();

      // Configuration de l'injection de dépendances
      await this.configureDependencyInjection();

      // Configuration des middlewares
      this.configureMiddlewares();

      // Configuration des routes
      this.configureRoutes();

      // Configuration de la gestion d'erreurs
      this.configureErrorHandling();

      console.log('✅ Application initialized successfully');
      return this.app;

    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      throw error;
    }
  }

  /**
   * Initialiser la base de données
   */
  private async initializeDatabase(): Promise<void> {
    console.log('🗃️  Initializing database...');
    
    // Créer le dossier data s'il n'existe pas
    const fs = await import('fs');
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('📁 Created data directory');
    }

    // Initialiser la connexion
    const sequelize = await databaseConfig.initialize();
    
    // Synchroniser les modèles
    await databaseConfig.synchronize();
    
    console.log('✅ Database initialized successfully');
  }

  /**
   * Configurer l'injection de dépendances
   */
  private async configureDependencyInjection(): Promise<void> {
    console.log('🔧 Configuring dependency injection...');
    
    const sequelize = databaseConfig.getSequelize();
    await configureDependencyInjection(sequelize);
    
    console.log('✅ Dependency injection configured');
  }

  /**
   * Configurer les middlewares
   */
  private configureMiddlewares(): void {
    console.log('🔧 Configuring middlewares...');

    // Sécurité
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": ["'self'", "'unsafe-inline'"],
          "style-src": ["'self'", "'unsafe-inline'"],
          "img-src": ["'self'", "data:", "https:"]
        }
      }
    }));

    // CORS
    this.app.use(cors());

    // Parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Logging en développement
    if (process.env.NODE_ENV === 'development') {
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      });
    }

    console.log('✅ Middlewares configured');
  }

  /**
   * Configurer les routes
   */
  private configureRoutes(): void {
    console.log('🛣️  Configuring routes...');

    // Documentation Swagger
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API Absences Domiciliaires - Documentation',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true
      }
    }));

    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      const healthInfo = {
        success: true,
        message: 'API d\'absences domiciliaires opérationnelle',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: databaseConfig.getConnectionInfo()
      };

      res.json(healthInfo);
    });

    // Documentation des endpoints
    this.app.get('/api', (req: Request, res: Response) => {
      const apiInfo = {
        success: true,
        message: 'API REST pour la déclaration d\'absences domiciliaires',
        version: '2.0.0',
        architecture: 'Hexagonal Architecture + SOLID Principles',
        documentation: `${req.protocol}://${req.get('host')}/api-docs`,
        endpoints: {
          'POST /api/absences': 'Créer une déclaration d\'absence',
          'GET /api/absences/:id': 'Récupérer une déclaration par ID',
          'PUT /api/absences/:id': 'Modifier une déclaration existante',
          'GET /api/absences': 'Lister toutes les déclarations (avec pagination)',
          'GET /health': 'Vérifier l\'état de l\'API',
          'GET /api-docs': 'Documentation Swagger interactive'
        },
        features: [
          'Architecture hexagonale',
          'Principes SOLID',
          'TypeScript strict',
          'Injection de dépendances',
          'Validation métier',
          'Pagination',
          'Documentation OpenAPI'
        ]
      };

      res.json(apiInfo);
    });

    // Routes API
    this.app.use('/api/absences', createAbsenceRoutes());

    console.log('✅ Routes configured');
  }

  /**
   * Configurer la gestion d'erreurs
   */
  private configureErrorHandling(): void {
    console.log('🔧 Configuring error handling...');

    // 404 - Route non trouvée
    this.app.use('*', (req: Request, res: Response) => {
      const errorResponse = this.responseFormatter.notFound('Route', req.originalUrl);
      res.status(404).json(errorResponse);
    });

    // Gestionnaire d'erreurs global
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction): void => {
      console.error('❌ Unhandled error:', error);

      // Erreur de validation Sequelize
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = (error as any).errors?.map((err: any) => err.message) || [];
        const errorResponse = this.responseFormatter.validationError(validationErrors);
        res.status(400).json(errorResponse);
        return;
      }

      // Erreur de contrainte unique Sequelize
      if (error.name === 'SequelizeUniqueConstraintError') {
        const errorResponse = this.responseFormatter.conflict('Une ressource avec ces données existe déjà');
        res.status(409).json(errorResponse);
        return;
      }

      // Erreur générique
      const errorResponse = this.responseFormatter.internalError(
        process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur'
      );
      
      res.status(500).json(errorResponse);
    });

    console.log('✅ Error handling configured');
  }

  /**
   * Obtenir l'instance Express
   */
  getApp(): Application {
    return this.app;
  }

  /**
   * Fermer l'application proprement
   */
  async shutdown(): Promise<void> {
    console.log('🔌 Shutting down application...');
    
    try {
      await databaseConfig.close();
      console.log('✅ Application shutdown completed');
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      throw error;
    }
  }
}

/**
 * Fonction de démarrage du serveur
 */
export async function startServer(): Promise<void> {
  const app = new App();
  
  try {
    const expressApp = await app.initialize();
    const PORT = parseInt(process.env.PORT || '3000', 10);

    const server = expressApp.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 ========================================');
      console.log(`🎯 Serveur démarré sur le port ${PORT}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 Documentation: http://localhost:${PORT}/api`);
      console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`);
      console.log('🚀 ========================================');
    });

    // Gestion gracieuse de l'arrêt
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n📡 Signal ${signal} reçu, arrêt gracieux...`);
      
      server.close(async () => {
        try {
          await app.shutdown();
          console.log('👋 Arrêt terminé proprement');
          process.exit(0);
        } catch (error) {
          console.error('❌ Erreur lors de l\'arrêt:', error);
          process.exit(1);
        }
      });

      // Force l'arrêt après 10 secondes
      setTimeout(() => {
        console.error('⚠️  Arrêt forcé après timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Erreur fatale lors du démarrage:', error);
    process.exit(1);
  }
}

// Démarrer le serveur si ce fichier est exécuté directement
if (require.main === module) {
  startServer();
}

export default App;