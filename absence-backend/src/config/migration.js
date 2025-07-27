const fs = require('fs');
const path = require('path');
const sequelize = require('./database');

const migrationPath = path.join(__dirname, '../migrations');

const runMigrations = async () => {
  try {
    console.log('Vérification et exécution des migrations...');

    // Créer la table de suivi des migrations si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS SequelizeMeta (
        name VARCHAR(255) NOT NULL PRIMARY KEY
      )
    `);

    // Lire les migrations exécutées
    const [executedMigrations] = await sequelize.query(
      'SELECT name FROM SequelizeMeta ORDER BY name'
    );
    const executedNames = executedMigrations.map(m => m.name);

    // Lire les fichiers de migration disponibles
    const migrationFiles = fs.readdirSync(migrationPath)
      .filter(file => file.endsWith('.js'))
      .sort();

    console.log(`Migrations disponibles: ${migrationFiles.length}`);
    console.log(`Migrations déjà exécutées: ${executedNames.length}`);

    // Exécuter les migrations non encore appliquées
    for (const file of migrationFiles) {
      if (!executedNames.includes(file)) {
        console.log(`Exécution de la migration: ${file}`);
        
        const migration = require(path.join(migrationPath, file));
        
        // Exécuter la migration
        await migration.up(sequelize.getQueryInterface(), sequelize.constructor);
        
        // Marquer comme exécutée
        await sequelize.query(
          'INSERT INTO SequelizeMeta (name) VALUES (?)',
          { replacements: [file] }
        );
        
        console.log(`Migration ${file} exécutée avec succès`);
      } else {
        console.log(`Migration ${file} déjà exécutée`);
      }
    }

    console.log('Toutes les migrations ont été appliquées');
  } catch (error) {
    console.error('Erreur lors de l\'exécution des migrations:', error);
    throw error;
  }
};

const rollbackLastMigration = async () => {
  try {
    console.log('Annulation de la dernière migration...');

    // Récupérer la dernière migration exécutée
    const [lastMigration] = await sequelize.query(
      'SELECT name FROM SequelizeMeta ORDER BY name DESC LIMIT 1'
    );

    if (lastMigration.length === 0) {
      console.log('Aucune migration à annuler');
      return;
    }

    const migrationName = lastMigration[0].name;
    console.log(`Annulation de la migration: ${migrationName}`);

    const migration = require(path.join(migrationPath, migrationName));
    
    // Exécuter l'annulation
    await migration.down(sequelize.getQueryInterface(), sequelize.constructor);
    
    // Supprimer de la table de suivi
    await sequelize.query(
      'DELETE FROM SequelizeMeta WHERE name = ?',
      { replacements: [migrationName] }
    );
    
    console.log(`Migration ${migrationName} annulée avec succès`);
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la migration:', error);
    throw error;
  }
};

module.exports = {
  runMigrations,
  rollbackLastMigration
};