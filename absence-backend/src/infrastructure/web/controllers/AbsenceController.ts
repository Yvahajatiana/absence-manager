import { Request, Response, NextFunction } from 'express';
import { CreateAbsenceUseCase } from '@application/usecases/CreateAbsenceUseCase';
import { GetAbsenceUseCase } from '@application/usecases/GetAbsenceUseCase';
import { UpdateAbsenceUseCase, UpdateAbsenceRequest } from '@application/usecases/UpdateAbsenceUseCase';
import { ListAbsencesUseCase } from '@application/usecases/ListAbsencesUseCase';
import { CreateAbsenceDTO, UpdateAbsenceDTO, PaginationDTO } from '@application/dto/AbsenceDTO';
import { ResponseFormatter } from '@infrastructure/web/responses/ResponseFormatter';

/**
 * Contrôleur REST pour les absences (Infrastructure Layer)
 * Gère les requêtes HTTP et délègue aux Use Cases
 * Respecte le principe SRP - Une seule responsabilité : coordination HTTP
 */
export class AbsenceController {
  constructor(
    private readonly createAbsenceUseCase: CreateAbsenceUseCase,
    private readonly getAbsenceUseCase: GetAbsenceUseCase,
    private readonly updateAbsenceUseCase: UpdateAbsenceUseCase,
    private readonly listAbsencesUseCase: ListAbsencesUseCase,
    private readonly responseFormatter: ResponseFormatter
  ) {}

  /**
   * POST /api/absences - Créer une nouvelle absence
   */
  async createAbsence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extraction et validation des données de la requête
      const createData: CreateAbsenceDTO = {
        dateDebut: req.body.dateDebut,
        dateFin: req.body.dateFin,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        adresseDomicile: req.body.adresseDomicile
      };

      // Exécution du Use Case
      const result = await this.createAbsenceUseCase.execute(createData);

      // Formatage et envoi de la réponse
      if (result.success) {
        const response = this.responseFormatter.success(
          result.data!,
          'Déclaration d\'absence créée avec succès',
          201
        );
        res.status(201).json(response);
      } else {
        const errorResponse = this.responseFormatter.error(
          result.error!,
          result.errors,
          400
        );
        res.status(400).json(errorResponse);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/absences/:id - Récupérer une absence par ID
   */
  async getAbsenceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extraction et validation de l'ID
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        const errorResponse = this.responseFormatter.error(
          'L\'ID doit être un nombre valide',
          undefined,
          400
        );
        res.status(400).json(errorResponse);
        return;
      }

      // Exécution du Use Case
      const result = await this.getAbsenceUseCase.execute(id);

      // Formatage et envoi de la réponse
      if (result.success) {
        const response = this.responseFormatter.success(result.data!);
        res.json(response);
      } else {
        const statusCode = result.error?.includes('trouvée') ? 404 : 400;
        const errorResponse = this.responseFormatter.error(
          result.error!,
          undefined,
          statusCode
        );
        res.status(statusCode).json(errorResponse);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/absences/:id - Mettre à jour une absence
   */
  async updateAbsence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extraction et validation de l'ID
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        const errorResponse = this.responseFormatter.error(
          'L\'ID doit être un nombre valide',
          undefined,
          400
        );
        res.status(400).json(errorResponse);
        return;
      }

      // Extraction des données de mise à jour
      const updateData: UpdateAbsenceDTO = {};
      
      if (req.body.dateDebut !== undefined) {
        updateData.dateDebut = req.body.dateDebut;
      }
      if (req.body.dateFin !== undefined) {
        updateData.dateFin = req.body.dateFin;
      }
      if (req.body.firstname !== undefined) {
        updateData.firstname = req.body.firstname;
      }
      if (req.body.lastname !== undefined) {
        updateData.lastname = req.body.lastname;
      }
      if (req.body.phone !== undefined) {
        updateData.phone = req.body.phone;
      }
      if (req.body.email !== undefined) {
        updateData.email = req.body.email;
      }
      if (req.body.adresseDomicile !== undefined) {
        updateData.adresseDomicile = req.body.adresseDomicile;
      }

      // Préparation de la requête pour le Use Case
      const updateRequest: UpdateAbsenceRequest = {
        id,
        data: updateData
      };

      // Exécution du Use Case
      const result = await this.updateAbsenceUseCase.execute(updateRequest);

      // Formatage et envoi de la réponse
      if (result.success) {
        const response = this.responseFormatter.success(
          result.data!,
          'Déclaration d\'absence mise à jour avec succès'
        );
        res.json(response);
      } else {
        const statusCode = result.error?.includes('trouvée') ? 404 : 400;
        const errorResponse = this.responseFormatter.error(
          result.error!,
          result.errors,
          statusCode
        );
        res.status(statusCode).json(errorResponse);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/absences - Lister les absences avec pagination
   */
  async listAbsences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extraction des paramètres de pagination
      const paginationParams: PaginationDTO = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC'
      };

      // Exécution du Use Case
      const result = await this.listAbsencesUseCase.execute(paginationParams);

      // Formatage et envoi de la réponse
      if (result.success) {
        res.json(result.data);
      } else {
        const errorResponse = this.responseFormatter.error(
          result.error!,
          undefined,
          400
        );
        res.status(400).json(errorResponse);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/absences/:id - Supprimer une absence (si nécessaire)
   */
  async deleteAbsence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extraction et validation de l'ID
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        const errorResponse = this.responseFormatter.error(
          'L\'ID doit être un nombre valide',
          undefined,
          400
        );
        res.status(400).json(errorResponse);
        return;
      }

      // Note: Ajouter un DeleteAbsenceUseCase si cette fonctionnalité est requise
      const errorResponse = this.responseFormatter.error(
        'La suppression d\'absences n\'est pas encore implémentée',
        undefined,
        501
      );
      res.status(501).json(errorResponse);
    } catch (error) {
      next(error);
    }
  }
}