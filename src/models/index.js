const sequelize = require('../config/database');
const Absence = require('./Absence');

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
    
    await sequelize.sync({ force: false });
    console.log('Synchronisation des modèles terminée.');
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  Absence,
  initializeDatabase
};