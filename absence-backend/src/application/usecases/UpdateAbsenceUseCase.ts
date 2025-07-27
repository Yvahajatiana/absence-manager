import { UseCase, Result, success, failure } from '@shared/interfaces/UseCase';
import { AbsenceService } from '@domain/services/AbsenceService';
import { UpdateAbsenceDTO, AbsenceResponseDTO } from '@application/dto/AbsenceDTO';
import { Absence } from '@domain/entities/Absence';

/**
 * Use Case pour la mise à jour d'une absence
 */
export class UpdateAbsenceUseCase implements UseCase<UpdateAbsenceRequest, Result<AbsenceResponseDTO>> {
  constructor(
    private readonly absenceService: AbsenceService
  ) {}

  async execute(request: UpdateAbsenceRequest): Promise<Result<AbsenceResponseDTO>> {
    try {
      // Validation des données d'entrée
      const validationResult = this.validateRequest(request);
      if (!validationResult.isValid) {
        return failure(validationResult.error!, validationResult.errors);
      }

      // Préparation des données de mise à jour
      const updateData: any = {};
      
      if (request.data.dateDebut !== undefined) {
        updateData.dateDebut = request.data.dateDebut;
      }
      if (request.data.dateFin !== undefined) {
        updateData.dateFin = request.data.dateFin;
      }
      if (request.data.firstname !== undefined) {
        updateData.firstname = request.data.firstname.trim();
      }
      if (request.data.lastname !== undefined) {
        updateData.lastname = request.data.lastname.trim();
      }
      if (request.data.phone !== undefined) {
        updateData.phone = request.data.phone.trim();
      }
      if (request.data.email !== undefined) {
        updateData.email = request.data.email?.trim();
      }
      if (request.data.adresseDomicile !== undefined) {
        updateData.adresseDomicile = request.data.adresseDomicile.trim();
      }

      // Mise à jour via le service métier
      const updatedAbsence = await this.absenceService.updateAbsence(request.id, updateData);

      if (!updatedAbsence) {
        return failure(`Aucune absence trouvée avec l'ID ${request.id}`);
      }

      // Conversion en DTO de réponse
      const responseDTO = this.mapToResponseDTO(updatedAbsence);

      return success(responseDTO);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de la mise à jour de l\'absence';
      return failure(errorMessage);
    }
  }

  /**
   * Validation des données d'entrée du use case
   */
  private validateRequest(request: UpdateAbsenceRequest): ValidationResult {
    const errors: string[] = [];

    // Validation de l'ID
    if (!request.id || request.id <= 0) {
      errors.push('L\'ID doit être un nombre positif valide');
    }

    // Validation qu'au moins un champ est fourni pour la mise à jour
    const hasUpdates = Object.keys(request.data).length > 0;
    if (!hasUpdates) {
      errors.push('Au moins un champ doit être fourni pour la mise à jour');
    }

    // Validation du format des dates si elles sont fournies
    if (request.data.dateDebut !== undefined) {
      const dateDebut = new Date(request.data.dateDebut);
      if (isNaN(dateDebut.getTime())) {
        errors.push('La date de début doit être une date valide');
      }
    }

    if (request.data.dateFin !== undefined) {
      const dateFin = new Date(request.data.dateFin);
      if (isNaN(dateFin.getTime())) {
        errors.push('La date de fin doit être une date valide');
      }
    }

    // Validation logique des dates si les deux sont fournies
    if (request.data.dateDebut !== undefined && request.data.dateFin !== undefined) {
      const dateDebut = new Date(request.data.dateDebut);
      const dateFin = new Date(request.data.dateFin);
      
      if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
        if (dateFin <= dateDebut) {
          errors.push('La date de fin doit être postérieure à la date de début');
        }
      }
    }

    // Validation des champs texte (s'ils sont fournis, ils ne doivent pas être vides)
    if (request.data.firstname !== undefined && !request.data.firstname?.trim()) {
      errors.push('Le prénom ne peut pas être vide');
    }

    if (request.data.lastname !== undefined && !request.data.lastname?.trim()) {
      errors.push('Le nom de famille ne peut pas être vide');
    }

    if (request.data.phone !== undefined && !request.data.phone?.trim()) {
      errors.push('Le numéro de téléphone ne peut pas être vide');
    }

    if (request.data.adresseDomicile !== undefined && !request.data.adresseDomicile?.trim()) {
      errors.push('L\'adresse du domicile ne peut pas être vide');
    }

    return {
      isValid: errors.length === 0,
      error: errors.length > 0 ? 'Données de mise à jour invalides' : undefined,
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
 * Interface pour la requête de mise à jour
 */
export interface UpdateAbsenceRequest {
  id: number;
  data: UpdateAbsenceDTO;
}

/**
 * Interface pour le résultat de validation interne
 */
interface ValidationResult {
  isValid: boolean;
  error?: string;
  errors?: string[];
}