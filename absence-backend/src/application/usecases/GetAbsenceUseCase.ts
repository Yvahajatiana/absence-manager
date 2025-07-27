import { UseCase, Result, success, failure } from '@shared/interfaces/UseCase';
import { AbsenceService } from '@domain/services/AbsenceService';
import { AbsenceResponseDTO } from '@application/dto/AbsenceDTO';
import { Absence } from '@domain/entities/Absence';

/**
 * Use Case pour récupérer une absence par ID
 */
export class GetAbsenceUseCase implements UseCase<number, Result<AbsenceResponseDTO>> {
  constructor(
    private readonly absenceService: AbsenceService
  ) {}

  async execute(id: number): Promise<Result<AbsenceResponseDTO>> {
    try {
      // Validation de l'ID
      if (!id || id <= 0) {
        return failure('L\'ID doit être un nombre positif valide');
      }

      // Récupération via le service métier
      const absence = await this.absenceService.getAbsenceById(id);

      if (!absence) {
        return failure(`Aucune absence trouvée avec l'ID ${id}`);
      }

      // Conversion en DTO de réponse
      const responseDTO = this.mapToResponseDTO(absence);

      return success(responseDTO);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de la récupération de l\'absence';
      return failure(errorMessage);
    }
  }

  /**
   * Mapper une entité Absence vers un DTO de réponse
   */
  private mapToResponseDTO(absence: Absence): AbsenceResponseDTO {
    const now = new Date();
    
    return {
      id: absence.id,
      dateDebut: absence.dateDebut.toISOString().split('T')[0],
      dateFin: absence.dateFin.toISOString().split('T')[0],
      firstname: absence.firstname,
      lastname: absence.lastname,
      phone: absence.phone,
      email: absence.email,
      adresseDomicile: absence.adresseDomicile,
      dateCreation: absence.dateCreation.toISOString(),
      dateModification: absence.dateModification.toISOString(),
      durationInDays: absence.getDurationInDays(),
      fullName: absence.getFullName(),
      isActive: absence.isActiveOn(now)
    };
  }
}