/**
 * Data Transfer Objects pour l'API Absences
 * Définit les contrats d'entrée et de sortie de l'API
 */

/**
 * DTO pour la création d'une absence
 */
export interface CreateAbsenceDTO {
  dateDebut: string; // Format ISO (YYYY-MM-DD)
  dateFin: string;   // Format ISO (YYYY-MM-DD)
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  adresseDomicile: string;
}

/**
 * DTO pour la mise à jour d'une absence
 */
export interface UpdateAbsenceDTO {
  dateDebut?: string;
  dateFin?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  adresseDomicile?: string;
}

/**
 * DTO pour la réponse d'une absence
 */
export interface AbsenceResponseDTO {
  id: number;
  dateDebut: string;
  dateFin: string;
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  adresseDomicile: string;
  dateCreation: string;
  dateModification: string;
  durationInDays: number;
  fullName: string;
  isActive: boolean;
}

/**
 * DTO pour la liste paginée d'absences
 */
export interface AbsenceListResponseDTO {
  success: boolean;
  data: AbsenceResponseDTO[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/**
 * DTO pour une réponse simple d'absence
 */
export interface AbsenceSimpleResponseDTO {
  success: boolean;
  message: string;
  data: AbsenceResponseDTO;
}

/**
 * DTO pour les erreurs
 */
export interface ErrorResponseDTO {
  success: false;
  error: string;
  errors?: string[];
  timestamp: string;
}

/**
 * DTO pour les statistiques d'absences
 */
export interface AbsenceStatsResponseDTO {
  success: boolean;
  data: {
    totalAbsences: number;
    activeAbsences: number;
    recentAbsences: number;
    averageDuration: number;
  };
}

/**
 * DTO pour les paramètres de recherche
 */
export interface AbsenceSearchDTO {
  firstname?: string;
  lastname?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

/**
 * DTO pour les paramètres de pagination
 */
export interface PaginationDTO {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}