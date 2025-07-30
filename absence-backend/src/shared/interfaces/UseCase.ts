/**
 * Interface générique pour les Use Cases (Application Layer)
 * Implémente le pattern Command avec support pour les résultats et erreurs
 */
export interface UseCase<TRequest, TResponse> {
  /**
   * Exécuter le use case
   * @param request - Les données d'entrée du use case
   * @returns Promise<TResponse> - Le résultat de l'exécution
   */
  execute(request: TRequest): Promise<TResponse>;
}

/**
 * Interface pour les Use Cases sans paramètres d'entrée
 */
export interface QueryUseCase<TResponse> {
  execute(): Promise<TResponse>;
}

/**
 * Résultat standard pour les opérations
 */
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
}

/**
 * Helper pour créer un résultat de succès
 */
export const success = <T>(data: T): Result<T> => ({
  success: true,
  data
});

/**
 * Helper pour créer un résultat d'erreur
 */
export const failure = <T>(error: string, errors?: string[]): Result<T> => ({
  success: false,
  error,
  errors
});