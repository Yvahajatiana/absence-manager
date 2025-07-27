import { AbsenceResponseDTO, ErrorResponseDTO } from '@application/dto/AbsenceDTO';

/**
 * Service de formatage des réponses HTTP (SRP)
 * Centralise le formatage des réponses pour maintenir la cohérence
 */
export class ResponseFormatter {
  
  /**
   * Formater une réponse de succès
   */
  success<T>(data: T, message?: string, statusCode: number = 200): SuccessResponse<T> {
    return {
      success: true,
      message: message || 'Opération réussie',
      data,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formater une réponse d'erreur
   */
  error(
    error: string, 
    errors?: string[], 
    statusCode: number = 400
  ): ErrorResponseDTO {
    return {
      success: false,
      error,
      errors,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formater une réponse de validation d'erreur
   */
  validationError(errors: string[]): ErrorResponseDTO {
    return {
      success: false,
      error: 'Erreur de validation',
      errors,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formater une réponse pour une ressource non trouvée
   */
  notFound(resource: string, id?: string | number): ErrorResponseDTO {
    const message = id 
      ? `${resource} avec l'ID ${id} introuvable`
      : `${resource} introuvable`;
      
    return {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formater une réponse pour une erreur interne
   */
  internalError(message: string = 'Erreur interne du serveur'): ErrorResponseDTO {
    return {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formater une réponse de conflit
   */
  conflict(message: string): ErrorResponseDTO {
    return {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formater une réponse d'autorisation refusée
   */
  unauthorized(message: string = 'Accès non autorisé'): ErrorResponseDTO {
    return {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formater une réponse pour une méthode non autorisée
   */
  methodNotAllowed(method: string, allowedMethods: string[]): ErrorResponseDTO {
    return {
      success: false,
      error: `Méthode ${method} non autorisée. Méthodes autorisées: ${allowedMethods.join(', ')}`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formater une réponse de données paginées
   */
  paginated<T>(
    data: T[], 
    pagination: PaginationInfo,
    message?: string
  ): PaginatedResponse<T> {
    return {
      success: true,
      message: message || 'Données récupérées avec succès',
      data,
      pagination,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formater une réponse de health check
   */
  health(status: 'healthy' | 'unhealthy', details?: Record<string, any>): HealthResponse {
    return {
      success: status === 'healthy',
      status,
      timestamp: new Date().toISOString(),
      details
    };
  }
}

/**
 * Interfaces pour les différents types de réponses
 */
export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  pagination: PaginationInfo;
  timestamp: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface HealthResponse {
  success: boolean;
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  details?: Record<string, any>;
}