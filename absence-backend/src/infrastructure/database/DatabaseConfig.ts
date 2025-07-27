import { Sequelize } from 'sequelize';
import path from 'path';

/**
 * Configuration de la base de données Sequelize
 * Centralise la configuration de la connexion (SRP)
 */
export class DatabaseConfig {
  private sequelize: Sequelize | null = null;

  /**
   * Initialiser la connexion à la base de données
   */
  async initialize(): Promise<Sequelize> {
    if (this.sequelize) {
      return this.sequelize;
    }

    const dbPath = this.getDatabasePath();
    
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
      logging: this.getLoggingConfig(),
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      retry: {
        match: [
          /SQLITE_BUSY/,
        ],
        name: 'query',
        max: 5
      },
      // Options SQLite spécifiques
      dialectOptions: {
        // Activer les clés étrangères
        options: {
          enableForeignKeyConstraints: true
        }
      }
    });

    // Test de la connexion
    await this.testConnection();
    
    console.log('✅ Database connection established successfully');
    return this.sequelize;
  }

  /**
   * Tester la connexion à la base de données
   */
  private async testConnection(): Promise<void> {
    if (!this.sequelize) {
      throw new Error('Sequelize not initialized');
    }

    try {
      await this.sequelize.authenticate();
      console.log('🔗 Database connection has been established successfully');
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error);
      throw error;
    }
  }

  /**
   * Synchroniser les modèles avec la base de données
   */
  async synchronize(force: boolean = false): Promise<void> {
    if (!this.sequelize) {
      throw new Error('Database not initialized');
    }

    try {
      await this.sequelize.sync({ 
        force,
        alter: !force // Alter tables en mode non-destructif si pas de force
      });
      
      if (force) {
        console.log('🔄 Database synchronized with force (all tables recreated)');
      } else {
        console.log('🔄 Database synchronized (tables altered if needed)');
      }
    } catch (error) {
      console.error('❌ Failed to synchronize database:', error);
      throw error;
    }
  }

  /**
   * Fermer la connexion à la base de données
   */
  async close(): Promise<void> {
    if (this.sequelize) {
      await this.sequelize.close();
      this.sequelize = null;
      console.log('🔌 Database connection closed');
    }
  }

  /**
   * Obtenir l'instance Sequelize
   */
  getSequelize(): Sequelize {
    if (!this.sequelize) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.sequelize;
  }

  /**
   * Obtenir le chemin de la base de données
   */
  private getDatabasePath(): string {
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    // En test, utiliser une base en mémoire
    if (nodeEnv === 'test') {
      return ':memory:';
    }

    // Utiliser le chemin configuré ou par défaut
    if (process.env.DB_STORAGE) {
      return process.env.DB_STORAGE;
    }

    // Chemin par défaut
    const dataDir = path.join(process.cwd(), 'data');
    return path.join(dataDir, 'database.sqlite');
  }

  /**
   * Configuration du logging selon l'environnement
   */
  private getLoggingConfig(): boolean | ((sql: string) => void) {
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    switch (nodeEnv) {
      case 'test':
        return false;
      case 'production':
        return false;
      case 'development':
      default:
        return (sql: string) => {
          if (process.env.DEBUG_SQL === 'true') {
            console.log('🗃️  SQL:', sql);
          }
        };
    }
  }

  /**
   * Vérifier l'état de la connexion
   */
  isConnected(): boolean {
    return this.sequelize !== null;
  }

  /**
   * Obtenir les informations de configuration
   */
  getConnectionInfo(): DatabaseConnectionInfo {
    return {
      dialect: 'sqlite',
      storage: this.getDatabasePath(),
      isConnected: this.isConnected(),
      environment: process.env.NODE_ENV || 'development'
    };
  }
}

/**
 * Interface pour les informations de connexion
 */
export interface DatabaseConnectionInfo {
  dialect: string;
  storage: string;
  isConnected: boolean;
  environment: string;
}

// Instance singleton
export const databaseConfig = new DatabaseConfig();