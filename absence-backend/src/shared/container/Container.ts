/**
 * Container d'injection de dépendances simple (DIP)
 * Implémente le pattern Service Locator pour l'inversion de contrôle
 */
export class Container {
  private services = new Map<string, any>();
  private factories = new Map<string, () => any>();

  /**
   * Enregistrer un service singleton
   */
  register<T>(key: string, instance: T): void {
    this.services.set(key, instance);
  }

  /**
   * Enregistrer une factory pour création à la demande
   */
  registerFactory<T>(key: string, factory: () => T): void {
    this.factories.set(key, factory);
  }

  /**
   * Récupérer un service
   */
  get<T>(key: string): T {
    // Vérifier d'abord les services singletons
    if (this.services.has(key)) {
      return this.services.get(key) as T;
    }

    // Ensuite vérifier les factories
    if (this.factories.has(key)) {
      const factory = this.factories.get(key)!;
      const instance = factory();
      
      // Enregistrer comme singleton après création
      this.services.set(key, instance);
      return instance as T;
    }

    throw new Error(`Service '${key}' not found in container`);
  }

  /**
   * Vérifier si un service est enregistré
   */
  has(key: string): boolean {
    return this.services.has(key) || this.factories.has(key);
  }

  /**
   * Supprimer un service du container
   */
  remove(key: string): boolean {
    const fromServices = this.services.delete(key);
    const fromFactories = this.factories.delete(key);
    return fromServices || fromFactories;
  }

  /**
   * Nettoyer tous les services
   */
  clear(): void {
    this.services.clear();
    this.factories.clear();
  }

  /**
   * Obtenir la liste des clés de services enregistrés
   */
  getRegisteredKeys(): string[] {
    const serviceKeys = Array.from(this.services.keys());
    const factoryKeys = Array.from(this.factories.keys());
    return [...new Set([...serviceKeys, ...factoryKeys])];
  }
}

// Instance globale du container
export const container = new Container();