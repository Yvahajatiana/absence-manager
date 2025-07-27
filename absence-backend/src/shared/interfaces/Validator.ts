/**
 * Interface pour les validateurs (SRP - Single Responsibility Principle)
 * Sépare la logique de validation du reste de l'application
 */
export interface Validator<T> {
  /**
   * Valider les données
   * @param data - Les données à valider
   * @returns ValidationResult - Le résultat de la validation
   */
  validate(data: unknown): ValidationResult<T>;
}

/**
 * Résultat de validation
 */
export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors: ValidationError[];
}

/**
 * Erreur de validation
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Helper pour créer un résultat de validation réussie
 */
export const validationSuccess = <T>(data: T): ValidationResult<T> => ({
  isValid: true,
  data,
  errors: []
});

/**
 * Helper pour créer un résultat de validation échouée
 */
export const validationFailure = <T>(errors: ValidationError[]): ValidationResult<T> => ({
  isValid: false,
  errors
});