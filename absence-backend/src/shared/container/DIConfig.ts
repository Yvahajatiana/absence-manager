import { Sequelize } from 'sequelize';
import { container } from './Container';

// Domain Layer
import { AbsenceService } from '@domain/services/AbsenceService';

// Application Layer
import { CreateAbsenceUseCase } from '@application/usecases/CreateAbsenceUseCase';
import { GetAbsenceUseCase } from '@application/usecases/GetAbsenceUseCase';
import { UpdateAbsenceUseCase } from '@application/usecases/UpdateAbsenceUseCase';
import { ListAbsencesUseCase } from '@application/usecases/ListAbsencesUseCase';

// Infrastructure Layer
import { SequelizeAbsenceRepository } from '@infrastructure/database/repositories/SequelizeAbsenceRepository';
import { AbsenceModel, initializeAbsenceModel } from '@infrastructure/database/models/AbsenceModel';
import { AbsenceController } from '@infrastructure/web/controllers/AbsenceController';
import { ResponseFormatter } from '@infrastructure/web/responses/ResponseFormatter';

// Interfaces
import { IAbsenceRepository } from '@domain/repositories/IAbsenceRepository';

/**
 * Configuration de l'injection de dépendances
 * Centralise la création et l'assemblage des dépendances (DIP)
 */
export async function configureDependencyInjection(sequelize: Sequelize): Promise<void> {
  // === Infrastructure Layer ===
  
  // Base de données
  const AbsenceModelClass = initializeAbsenceModel(sequelize);
  container.register<typeof AbsenceModel>('AbsenceModel', AbsenceModelClass);

  // Repositories
  container.registerFactory<IAbsenceRepository>('IAbsenceRepository', () => {
    const absenceModel = container.get<typeof AbsenceModel>('AbsenceModel');
    return new SequelizeAbsenceRepository(absenceModel);
  });

  // Response Formatter
  container.register<ResponseFormatter>('ResponseFormatter', new ResponseFormatter());

  // === Domain Layer ===
  
  // Services métier
  container.registerFactory<AbsenceService>('AbsenceService', () => {
    const absenceRepository = container.get<IAbsenceRepository>('IAbsenceRepository');
    return new AbsenceService(absenceRepository);
  });

  // === Application Layer ===
  
  // Use Cases
  container.registerFactory<CreateAbsenceUseCase>('CreateAbsenceUseCase', () => {
    const absenceService = container.get<AbsenceService>('AbsenceService');
    return new CreateAbsenceUseCase(absenceService);
  });

  container.registerFactory<GetAbsenceUseCase>('GetAbsenceUseCase', () => {
    const absenceService = container.get<AbsenceService>('AbsenceService');
    return new GetAbsenceUseCase(absenceService);
  });

  container.registerFactory<UpdateAbsenceUseCase>('UpdateAbsenceUseCase', () => {
    const absenceService = container.get<AbsenceService>('AbsenceService');
    return new UpdateAbsenceUseCase(absenceService);
  });

  container.registerFactory<ListAbsencesUseCase>('ListAbsencesUseCase', () => {
    const absenceService = container.get<AbsenceService>('AbsenceService');
    return new ListAbsencesUseCase(absenceService);
  });

  // === Presentation Layer ===
  
  // Controllers
  container.registerFactory<AbsenceController>('AbsenceController', () => {
    const createAbsenceUseCase = container.get<CreateAbsenceUseCase>('CreateAbsenceUseCase');
    const getAbsenceUseCase = container.get<GetAbsenceUseCase>('GetAbsenceUseCase');
    const updateAbsenceUseCase = container.get<UpdateAbsenceUseCase>('UpdateAbsenceUseCase');
    const listAbsencesUseCase = container.get<ListAbsencesUseCase>('ListAbsencesUseCase');
    const responseFormatter = container.get<ResponseFormatter>('ResponseFormatter');

    return new AbsenceController(
      createAbsenceUseCase,
      getAbsenceUseCase,
      updateAbsenceUseCase,
      listAbsencesUseCase,
      responseFormatter
    );
  });

  console.log('✅ Dependency injection configured successfully');
  console.log(`📦 Registered services: ${container.getRegisteredKeys().join(', ')}`);
}

/**
 * Obtenir la liste des services enregistrés pour debug
 */
export function listRegisteredServices(): string[] {
  return container.getRegisteredKeys();
}

/**
 * Nettoyer le container (pour les tests)
 */
export function clearContainer(): void {
  container.clear();
}