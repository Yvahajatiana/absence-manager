import { DataTypes, Model, Sequelize } from 'sequelize';

/**
 * Modèle Sequelize pour l'entité Absence (Infrastructure Layer)
 * Responsabilité : Mapping ORM et persistance en base de données
 */
export class AbsenceModel extends Model {
  public id!: number;
  public dateDebut!: Date;
  public dateFin!: Date;
  public firstname!: string;
  public lastname!: string;
  public phone!: string;
  public email?: string;
  public adresseDomicile!: string;
  public dateCreation!: Date;
  public dateModification!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Initialiser le modèle Sequelize
 */
export function initializeAbsenceModel(sequelize: Sequelize): typeof AbsenceModel {
  AbsenceModel.init({
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
        isDate: true
      }
    },
    dateFin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La date de fin est obligatoire'
        },
        isDate: true,
        isAfterStartDate(value: any) {
          if (new Date(value) <= new Date((this as any).dateDebut)) {
            throw new Error('La date de fin doit être postérieure à la date de début');
          }
        }
      }
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Le prénom est obligatoire'
        },
        notEmpty: {
          msg: 'Le prénom ne peut pas être vide'
        },
        len: {
          args: [2, 50],
          msg: 'Le prénom doit contenir entre 2 et 50 caractères'
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Le nom de famille est obligatoire'
        },
        notEmpty: {
          msg: 'Le nom de famille ne peut pas être vide'
        },
        len: {
          args: [2, 50],
          msg: 'Le nom de famille doit contenir entre 2 et 50 caractères'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Le numéro de téléphone est obligatoire'
        },
        notEmpty: {
          msg: 'Le numéro de téléphone ne peut pas être vide'
        },
        is: {
          args: /^(\+33|0)[1-9](\d{8})$/,
          msg: 'Le numéro de téléphone doit être au format français valide'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'L\'adresse email doit être valide'
        },
        len: {
          args: [0, 100],
          msg: 'L\'adresse email ne peut pas dépasser 100 caractères'
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
    sequelize,
    tableName: 'absences',
    timestamps: true,
    createdAt: 'dateCreation',
    updatedAt: 'dateModification',
    indexes: [
      {
        fields: ['dateDebut', 'dateFin']
      },
      {
        fields: ['firstname', 'lastname']
      },
      {
        fields: ['dateCreation']
      }
    ]
  });

  return AbsenceModel;
}

/**
 * Interface pour les données brutes du modèle
 */
export interface AbsenceModelData {
  id: number;
  dateDebut: Date;
  dateFin: Date;
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  adresseDomicile: string;
  dateCreation: Date;
  dateModification: Date;
}