/**
 * Interface générique de repository (DIP - Dependency Inversion Principle)
 * Définit le contrat pour toutes les opérations de persistance
 */
export interface Repository<T, ID> {
  /**
   * Créer une nouvelle entité
   */
  create(entity: Omit<T, 'id'>): Promise<T>;

  /**
   * Récupérer une entité par ID
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Récupérer toutes les entités avec pagination
   */
  findAll(options?: PaginationOptions): Promise<PaginatedResult<T>>;

  /**
   * Mettre à jour une entité
   */
  update(id: ID, updates: Partial<T>): Promise<T | null>;

  /**
   * Supprimer une entité
   */
  delete(id: ID): Promise<boolean>;

  /**
   * Vérifier si une entité existe
   */
  exists(id: ID): Promise<boolean>;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}