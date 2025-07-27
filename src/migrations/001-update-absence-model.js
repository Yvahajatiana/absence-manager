const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('Migration: Mise à jour du modèle Absence - suppression coordonneesPers et ajout champs personnels');
    
    // Vérifier si la table existe
    const tableExists = await queryInterface.tableExists('absences');
    if (!tableExists) {
      console.log('Table absences n\'existe pas encore, elle sera créée avec le nouveau modèle');
      return;
    }

    // Vérifier les colonnes existantes
    const tableDescription = await queryInterface.describeTable('absences');
    console.log('Colonnes existantes:', Object.keys(tableDescription));

    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Ajouter les nouvelles colonnes si elles n'existent pas
      if (!tableDescription.firstname) {
        await queryInterface.addColumn('absences', 'firstname', {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'Prénom' // Valeur temporaire pour les enregistrements existants
        }, { transaction });
        console.log('Colonne firstname ajoutée');
      }

      if (!tableDescription.lastname) {
        await queryInterface.addColumn('absences', 'lastname', {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'Nom' // Valeur temporaire pour les enregistrements existants
        }, { transaction });
        console.log('Colonne lastname ajoutée');
      }

      if (!tableDescription.phone) {
        await queryInterface.addColumn('absences', 'phone', {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '0123456789' // Valeur temporaire pour les enregistrements existants
        }, { transaction });
        console.log('Colonne phone ajoutée');
      }

      if (!tableDescription.email) {
        await queryInterface.addColumn('absences', 'email', {
          type: DataTypes.STRING,
          allowNull: true
        }, { transaction });
        console.log('Colonne email ajoutée');
      }

      // Supprimer l'ancienne colonne coordonneesPers si elle existe
      if (tableDescription.coordonneesPers) {
        await queryInterface.removeColumn('absences', 'coordonneesPers', { transaction });
        console.log('Colonne coordonneesPers supprimée');
      }

      await transaction.commit();
      console.log('Migration terminée avec succès');
    } catch (error) {
      await transaction.rollback();
      console.error('Erreur lors de la migration:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('Migration inverse: Restauration de l\'ancien modèle Absence');
    
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remettre la colonne coordonneesPers
      await queryInterface.addColumn('absences', 'coordonneesPers', {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: { latitude: 0, longitude: 0 }
      }, { transaction });

      // Supprimer les nouvelles colonnes
      await queryInterface.removeColumn('absences', 'firstname', { transaction });
      await queryInterface.removeColumn('absences', 'lastname', { transaction });
      await queryInterface.removeColumn('absences', 'phone', { transaction });
      await queryInterface.removeColumn('absences', 'email', { transaction });

      await transaction.commit();
      console.log('Migration inverse terminée avec succès');
    } catch (error) {
      await transaction.rollback();
      console.error('Erreur lors de la migration inverse:', error);
      throw error;
    }
  }
};