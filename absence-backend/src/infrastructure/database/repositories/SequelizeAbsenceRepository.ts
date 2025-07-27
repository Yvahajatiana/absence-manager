import { Op } from 'sequelize';
import { IAbsenceRepository } from '@domain/repositories/IAbsenceRepository';
import { Absence, AbsenceCreateData, AbsenceData } from '@domain/entities/Absence';
import { PaginationOptions, PaginatedResult } from '@shared/interfaces/Repository';
import { AbsenceModel } from '@infrastructure/database/models/AbsenceModel';

/**
 * Implémentation Sequelize du repository d'absences (Infrastructure Layer)
 * Responsabilité : Persistance et requêtes de base de données
 * Implémente l'interface IAbsenceRepository (DIP)
 */
export class SequelizeAbsenceRepository implements IAbsenceRepository {
  constructor(private readonly absenceModel: typeof AbsenceModel) {}

  /**
   * Créer une nouvelle absence
   */
  async create(data: Omit<Absence, 'id'>): Promise<Absence> {
    const createData = {
      dateDebut: new Date(data.dateDebut),
      dateFin: new Date(data.dateFin),
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
      email: data.email || null,
      adresseDomicile: data.adresseDomicile
    };

    const absenceModel = await this.absenceModel.create(createData);
    return this.mapModelToEntity(absenceModel);
  }

  /**
   * Récupérer une absence par ID
   */
  async findById(id: number): Promise<Absence | null> {
    const absenceModel = await this.absenceModel.findByPk(id);
    
    if (!absenceModel) {
      return null;
    }

    return this.mapModelToEntity(absenceModel);
  }

  /**
   * Récupérer toutes les absences avec pagination
   */
  async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<Absence>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'dateCreation',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;

    const { count, rows } = await this.absenceModel.findAndCountAll({
      limit,
      offset,
      order: [[sortBy, sortOrder]]
    });

    const absences = rows.map(model => this.mapModelToEntity(model));

    return {
      data: absences,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    };
  }

  /**
   * Mettre à jour une absence
   */
  async update(id: number, updates: Partial<Absence>): Promise<Absence | null> {
    const absenceModel = await this.absenceModel.findByPk(id);
    
    if (!absenceModel) {
      return null;
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (updates.dateDebut !== undefined) {
      updateData.dateDebut = new Date(updates.dateDebut);
    }
    if (updates.dateFin !== undefined) {
      updateData.dateFin = new Date(updates.dateFin);
    }
    if (updates.firstname !== undefined) {
      updateData.firstname = updates.firstname;
    }
    if (updates.lastname !== undefined) {
      updateData.lastname = updates.lastname;
    }
    if (updates.phone !== undefined) {
      updateData.phone = updates.phone;
    }
    if (updates.email !== undefined) {
      updateData.email = updates.email || null;
    }
    if (updates.adresseDomicile !== undefined) {
      updateData.adresseDomicile = updates.adresseDomicile;
    }

    await absenceModel.update(updateData);
    await absenceModel.reload();

    return this.mapModelToEntity(absenceModel);
  }

  /**
   * Supprimer une absence
   */
  async delete(id: number): Promise<boolean> {
    const deletedCount = await this.absenceModel.destroy({
      where: { id }
    });

    return deletedCount > 0;
  }

  /**
   * Vérifier si une absence existe
   */
  async exists(id: number): Promise<boolean> {
    const count = await this.absenceModel.count({
      where: { id }
    });

    return count > 0;
  }

  /**
   * Rechercher les absences par période
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Absence[]> {
    const absenceModels = await this.absenceModel.findAll({
      where: {
        [Op.or]: [
          {
            dateDebut: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            dateFin: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            [Op.and]: [
              {
                dateDebut: {
                  [Op.lte]: startDate
                }
              },
              {
                dateFin: {
                  [Op.gte]: endDate
                }
              }
            ]
          }
        ]
      },
      order: [['dateDebut', 'ASC']]
    });

    return absenceModels.map(model => this.mapModelToEntity(model));
  }

  /**
   * Rechercher les absences par informations personnelles
   */
  async findByPersonalInfo(firstname: string, lastname: string): Promise<Absence[]> {
    const absenceModels = await this.absenceModel.findAll({
      where: {
        firstname: {
          [Op.iLike]: `%${firstname}%`
        },
        lastname: {
          [Op.iLike]: `%${lastname}%`
        }
      },
      order: [['dateCreation', 'DESC']]
    });

    return absenceModels.map(model => this.mapModelToEntity(model));
  }

  /**
   * Rechercher les absences actives à une date donnée
   */
  async findActiveAbsences(date: Date = new Date()): Promise<Absence[]> {
    const absenceModels = await this.absenceModel.findAll({
      where: {
        dateDebut: {
          [Op.lte]: date
        },
        dateFin: {
          [Op.gte]: date
        }
      },
      order: [['dateDebut', 'ASC']]
    });

    return absenceModels.map(model => this.mapModelToEntity(model));
  }

  /**
   * Vérifier les conflits de dates pour une personne
   */
  async hasDateConflict(
    firstname: string,
    lastname: string,
    startDate: Date,
    endDate: Date,
    excludeId?: number
  ): Promise<boolean> {
    const whereCondition: any = {
      firstname: {
        [Op.iLike]: firstname
      },
      lastname: {
        [Op.iLike]: lastname
      },
      [Op.or]: [
        {
          dateDebut: {
            [Op.between]: [startDate, endDate]
          }
        },
        {
          dateFin: {
            [Op.between]: [startDate, endDate]
          }
        },
        {
          [Op.and]: [
            {
              dateDebut: {
                [Op.lte]: startDate
              }
            },
            {
              dateFin: {
                [Op.gte]: endDate
              }
            }
          ]
        }
      ]
    };

    // Exclure une absence spécifique de la vérification (pour les mises à jour)
    if (excludeId !== undefined) {
      whereCondition.id = {
        [Op.ne]: excludeId
      };
    }

    const count = await this.absenceModel.count({
      where: whereCondition
    });

    return count > 0;
  }

  /**
   * Mapper un modèle Sequelize vers une entité métier
   */
  private mapModelToEntity(model: AbsenceModel): Absence {
    const data: AbsenceData = {
      id: model.id,
      dateDebut: model.dateDebut,
      dateFin: model.dateFin,
      firstname: model.firstname,
      lastname: model.lastname,
      phone: model.phone,
      email: model.email || undefined,
      adresseDomicile: model.adresseDomicile,
      dateCreation: model.dateCreation,
      dateModification: model.dateModification
    };

    return new Absence(data);
  }
}