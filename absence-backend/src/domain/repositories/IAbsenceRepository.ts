import { Repository } from '@shared/interfaces/Repository';
import { Absence } from '@domain/entities/Absence';

/**
 * Interface spécifique pour le repository des absences
 * Étend l'interface générique avec des méthodes métier spécifiques
 */
export interface IAbsenceRepository extends Repository<Absence, number> {
  /**
   * Rechercher les absences par période
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<Absence[]>;

  /**
   * Rechercher les absences par informations personnelles
   */
  findByPersonalInfo(firstname: string, lastname: string): Promise<Absence[]>;

  /**
   * Rechercher les absences actives à une date donnée
   */
  findActiveAbsences(date?: Date): Promise<Absence[]>;

  /**
   * Vérifier les conflits de dates pour une personne
   */
  hasDateConflict(
    firstname: string, 
    lastname: string, 
    startDate: Date, 
    endDate: Date,
    excludeId?: number
  ): Promise<boolean>;
}