import { Absence, AbsenceCreateData, AbsenceUpdateData } from '@domain/entities/Absence';
import { IAbsenceRepository } from '@domain/repositories/IAbsenceRepository';
import { AbsenceValidation } from '@domain/valueObjects/AbsenceValidation';
import { PaginationOptions, PaginatedResult } from '@shared/interfaces/Repository';

/**
 * Service métier pour la gestion des absences (Domain Layer)
 * Contient la logique métier complexe et orchestration des opérations
 */
export class AbsenceService {
  constructor(
    private readonly absenceRepository: IAbsenceRepository
  ) {}

  /**
   * Créer une nouvelle absence avec validation métier
   */
  async createAbsence(data: AbsenceCreateData): Promise<Absence> {
    // Validation des données métier
    const validationResult = AbsenceValidation.validateComplete({
      dateDebut: new Date(data.dateDebut),
      dateFin: new Date(data.dateFin),
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
      email: data.email,
      adresseDomicile: data.adresseDomicile
    });

    if (!validationResult.isValid) {
      throw new Error(`Validation échouée: ${validationResult.errors.join(', ')}`);
    }

    // Vérification des conflits de dates
    const hasConflict = await this.absenceRepository.hasDateConflict(
      data.firstname,
      data.lastname,
      new Date(data.dateDebut),
      new Date(data.dateFin)
    );

    if (hasConflict) {
      throw new Error('Une absence existe déjà pour cette personne sur cette période');
    }

    // Création de l'absence
    const createPayload = {
      ...data,
      dateCreation: new Date(),
      dateModification: new Date()
    };
    const createdAbsence = await this.absenceRepository.create(createPayload as any);
    return createdAbsence;
  }

  /**
   * Récupérer une absence par ID
   */
  async getAbsenceById(id: number): Promise<Absence | null> {
    if (!id || id <= 0) {
      throw new Error('L\'ID doit être un nombre positif valide');
    }

    return await this.absenceRepository.findById(id);
  }

  /**
   * Mettre à jour une absence
   */
  async updateAbsence(id: number, updates: AbsenceUpdateData): Promise<Absence | null> {
    if (!id || id <= 0) {
      throw new Error('L\'ID doit être un nombre positif valide');
    }

    // Vérifier que l'absence existe
    const existingAbsence = await this.absenceRepository.findById(id);
    if (!existingAbsence) {
      throw new Error(`Aucune absence trouvée avec l'ID ${id}`);
    }

    // Préparer les données fusionnées pour validation
    const mergedData = {
      dateDebut: updates.dateDebut ? new Date(updates.dateDebut) : existingAbsence.dateDebut,
      dateFin: updates.dateFin ? new Date(updates.dateFin) : existingAbsence.dateFin,
      firstname: updates.firstname ?? existingAbsence.firstname,
      lastname: updates.lastname ?? existingAbsence.lastname,
      phone: updates.phone ?? existingAbsence.phone,
      email: updates.email ?? existingAbsence.email,
      adresseDomicile: updates.adresseDomicile ?? existingAbsence.adresseDomicile
    };

    // Validation des données fusionnées
    const validationResult = AbsenceValidation.validateComplete(mergedData);
    if (!validationResult.isValid) {
      throw new Error(`Validation échouée: ${validationResult.errors.join(', ')}`);
    }

    // Vérification des conflits de dates (si les dates ou la personne changent)
    if (updates.dateDebut || updates.dateFin || updates.firstname || updates.lastname) {
      const hasConflict = await this.absenceRepository.hasDateConflict(
        mergedData.firstname,
        mergedData.lastname,
        mergedData.dateDebut,
        mergedData.dateFin,
        id // Exclure l'absence actuelle de la vérification
      );

      if (hasConflict) {
        throw new Error('Une absence existe déjà pour cette personne sur cette période');
      }
    }

    // Mise à jour
    return await this.absenceRepository.update(id, updates as any);
  }

  /**
   * Lister les absences avec pagination
   */
  async listAbsences(options?: PaginationOptions): Promise<PaginatedResult<Absence>> {
    return await this.absenceRepository.findAll(options);
  }

  /**
   * Supprimer une absence
   */
  async deleteAbsence(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('L\'ID doit être un nombre positif valide');
    }

    const exists = await this.absenceRepository.exists(id);
    if (!exists) {
      throw new Error(`Aucune absence trouvée avec l'ID ${id}`);
    }

    return await this.absenceRepository.delete(id);
  }

  /**
   * Rechercher les absences par période
   */
  async findAbsencesByDateRange(startDate: Date, endDate: Date): Promise<Absence[]> {
    if (endDate <= startDate) {
      throw new Error('La date de fin doit être postérieure à la date de début');
    }

    return await this.absenceRepository.findByDateRange(startDate, endDate);
  }

  /**
   * Rechercher les absences par informations personnelles
   */
  async findAbsencesByPersonalInfo(firstname: string, lastname: string): Promise<Absence[]> {
    if (!firstname?.trim() || !lastname?.trim()) {
      throw new Error('Le prénom et le nom sont requis');
    }

    return await this.absenceRepository.findByPersonalInfo(firstname.trim(), lastname.trim());
  }

  /**
   * Obtenir les absences actives à une date donnée
   */
  async getActiveAbsences(date?: Date): Promise<Absence[]> {
    return await this.absenceRepository.findActiveAbsences(date);
  }

  /**
   * Vérifier si une personne a une absence active
   */
  async hasActiveAbsence(firstname: string, lastname: string, date?: Date): Promise<boolean> {
    const activeAbsences = await this.getActiveAbsences(date);
    return activeAbsences.some(absence => 
      absence.firstname.toLowerCase() === firstname.toLowerCase() &&
      absence.lastname.toLowerCase() === lastname.toLowerCase()
    );
  }

  /**
   * Obtenir les statistiques des absences
   */
  async getAbsenceStats(): Promise<AbsenceStats> {
    const allAbsences = await this.absenceRepository.findAll();
    const activeAbsences = await this.getActiveAbsences();

    const totalAbsences = allAbsences.data.length;
    const activeCount = activeAbsences.length;
    
    // Calculer la durée moyenne
    const totalDuration = allAbsences.data.reduce((sum, absence) => 
      sum + absence.getDurationInDays(), 0
    );
    const averageDuration = totalAbsences > 0 ? totalDuration / totalAbsences : 0;

    // Absences récentes (7 derniers jours)
    const recentAbsences = allAbsences.data.filter(absence => absence.isRecent());

    return {
      totalAbsences,
      activeAbsences: activeCount,
      recentAbsences: recentAbsences.length,
      averageDuration: Math.round(averageDuration * 100) / 100
    };
  }
}

/**
 * Interface pour les statistiques des absences
 */
export interface AbsenceStats {
  totalAbsences: number;
  activeAbsences: number;
  recentAbsences: number;
  averageDuration: number;
}