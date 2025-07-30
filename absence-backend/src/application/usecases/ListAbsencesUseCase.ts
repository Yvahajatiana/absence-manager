import { UseCase, Result, success, failure } from '@shared/interfaces/UseCase';
import { AbsenceService } from '@domain/services/AbsenceService';
import { AbsenceListResponseDTO, PaginationDTO } from '@application/dto/AbsenceDTO';
import { Absence } from '@domain/entities/Absence';
import { PaginationOptions } from '@shared/interfaces/Repository';

/**
 * Use Case pour lister les absences avec pagination
 */
export class ListAbsencesUseCase implements UseCase<PaginationDTO, Result<AbsenceListResponseDTO>> {
  constructor(
    private readonly absenceService: AbsenceService
  ) {}

  async execute(request: PaginationDTO = {}): Promise<Result<AbsenceListResponseDTO>> {
    try {
      // Validation et normalisation des paramètres de pagination
      const paginationOptions = this.normalizePaginationOptions(request);

      // Récupération via le service métier
      const result = await this.absenceService.listAbsences(paginationOptions);

      // Conversion en DTO de réponse
      const response: AbsenceListResponseDTO = {
        success: true,
        data: result.data.map(absence => this.mapToResponseDTO(absence)),
        pagination: result.pagination
      };

      return success(response);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de la récupération des absences';
      return failure(errorMessage);
    }
  }

  /**
   * Normaliser et valider les options de pagination
   */
  private normalizePaginationOptions(request: PaginationDTO): PaginationOptions {
    // Valeurs par défaut
    const defaultPage = 1;
    const defaultLimit = 10;
    const maxLimit = 100;
    const defaultSortBy = 'dateCreation';
    const defaultSortOrder = 'DESC';

    // Normalisation
    let page = request.page || defaultPage;
    let limit = request.limit || defaultLimit;
    const sortBy = request.sortBy || defaultSortBy;
    const sortOrder = request.sortOrder || defaultSortOrder;

    // Validation et correction
    if (page < 1) {
      page = defaultPage;
    }

    if (limit < 1) {
      limit = defaultLimit;
    } else if (limit > maxLimit) {
      limit = maxLimit;
    }

    // Validation des champs de tri autorisés
    const allowedSortFields = [
      'dateCreation',
      'dateModification',
      'dateDebut',
      'dateFin',
      'firstname',
      'lastname'
    ];

    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : defaultSortBy;

    // Validation de l'ordre de tri
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder) ? sortOrder : defaultSortOrder;

    return {
      page,
      limit,
      sortBy: validSortBy,
      sortOrder: validSortOrder as 'ASC' | 'DESC'
    };
  }

  /**
   * Mapper une entité Absence vers un DTO de réponse
   */
  private mapToResponseDTO(absence: Absence) {
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