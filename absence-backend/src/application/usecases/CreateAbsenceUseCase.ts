import { UseCase, Result, success, failure } from '@shared/interfaces/UseCase';
import { AbsenceService } from '@domain/services/AbsenceService';
import { CreateAbsenceDTO, AbsenceResponseDTO } from '@application/dto/AbsenceDTO';
import { Absence } from '@domain/entities/Absence';

/**
 * Use Case pour la création d'une absence
 * Implémente la logique applicative (Application Layer)
 */
export class CreateAbsenceUseCase implements UseCase<CreateAbsenceDTO, Result<AbsenceResponseDTO>> {
  constructor(
    private readonly absenceService: AbsenceService
  ) {}

  async execute(request: CreateAbsenceDTO): Promise<Result<AbsenceResponseDTO>> {
    try {
      // Validation des données d'entrée
      const validationResult = this.validateRequest(request);
      if (!validationResult.isValid) {
        return failure(validationResult.error!, validationResult.errors);
      }

      // Conversion des dates
      const createData = {
        dateDebut: request.dateDebut,
        dateFin: request.dateFin,
        firstname: request.firstname.trim(),
        lastname: request.lastname.trim(),
        phone: request.phone.trim(),
        email: request.email?.trim(),
        adresseDomicile: request.adresseDomicile.trim()
      };

      // Création via le service métier
      const absence = await this.absenceService.createAbsence(createData);

      // Conversion en DTO de réponse
      const responseDTO = this.mapToResponseDTO(absence);

      return success(responseDTO);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de la création de l\'absence';
      return failure(errorMessage);
    }
  }

  /**
   * Validation des données d'entrée du use case
   */
  private validateRequest(request: CreateAbsenceDTO): ValidationResult {
    const errors: string[] = [];

    // Validation des champs requis
    if (!request.dateDebut?.trim()) {
      errors.push('La date de début est obligatoire');
    }

    if (!request.dateFin?.trim()) {
      errors.push('La date de fin est obligatoire');
    }

    if (!request.firstname?.trim()) {
      errors.push('Le prénom est obligatoire');
    }

    if (!request.lastname?.trim()) {
      errors.push('Le nom de famille est obligatoire');
    }

    if (!request.phone?.trim()) {
      errors.push('Le numéro de téléphone est obligatoire');
    }

    if (!request.adresseDomicile?.trim()) {
      errors.push('L\'adresse du domicile est obligatoire');
    }

    // Validation du format des dates
    if (request.dateDebut) {
      const dateDebut = new Date(request.dateDebut);
      if (isNaN(dateDebut.getTime())) {
        errors.push('La date de début doit être une date valide');
      }
    }

    if (request.dateFin) {
      const dateFin = new Date(request.dateFin);
      if (isNaN(dateFin.getTime())) {
        errors.push('La date de fin doit être une date valide');
      }
    }

    // Validation logique des dates
    if (request.dateDebut && request.dateFin) {
      const dateDebut = new Date(request.dateDebut);
      const dateFin = new Date(request.dateFin);
      
      if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
        if (dateFin <= dateDebut) {
          errors.push('La date de fin doit être postérieure à la date de début');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      error: errors.length > 0 ? 'Données d\'entrée invalides' : undefined,
      errors: errors.length > 0 ? errors : undefined
    };
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

/**
 * Interface pour le résultat de validation interne
 */
interface ValidationResult {
  isValid: boolean;
  error?: string;
  errors?: string[];
}