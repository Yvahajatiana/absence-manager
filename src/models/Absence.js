const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Absence = sequelize.define('Absence', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dateDebut: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'La date de début est obligatoire'
      },
      isDate: {
        msg: 'La date de début doit être une date valide'
      }
    }
  },
  dateFin: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'La date de fin est obligatoire'
      },
      isDate: {
        msg: 'La date de fin doit être une date valide'
      },
      isAfterStartDate(value) {
        if (value <= this.dateDebut) {
          throw new Error('La date de fin doit être postérieure à la date de début');
        }
      }
    }
  },
  coordonneesPers: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Les coordonnées de la personne sont obligatoires'
      },
      isValidCoordinates(value) {
        if (!value || typeof value !== 'object') {
          throw new Error('Les coordonnées doivent être un objet');
        }
        if (!value.latitude || !value.longitude) {
          throw new Error('Les coordonnées doivent contenir latitude et longitude');
        }
        if (typeof value.latitude !== 'number' || typeof value.longitude !== 'number') {
          throw new Error('Latitude et longitude doivent être des nombres');
        }
        if (value.latitude < -90 || value.latitude > 90) {
          throw new Error('La latitude doit être comprise entre -90 et 90');
        }
        if (value.longitude < -180 || value.longitude > 180) {
          throw new Error('La longitude doit être comprise entre -180 et 180');
        }
      }
    }
  },
  adresseDomicile: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'L\'adresse du domicile est obligatoire'
      },
      notEmpty: {
        msg: 'L\'adresse du domicile ne peut pas être vide'
      },
      len: {
        args: [10, 500],
        msg: 'L\'adresse doit contenir entre 10 et 500 caractères'
      }
    }
  }
}, {
  tableName: 'absences',
  timestamps: true,
  createdAt: 'dateCreation',
  updatedAt: 'dateModification'
});

module.exports = Absence;