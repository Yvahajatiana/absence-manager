import { Router } from 'express';
import { AbsenceController } from '@infrastructure/web/controllers/AbsenceController';
import { container } from '@shared/container/Container';

/**
 * Définition des routes pour les absences
 * Délègue toute la logique au contrôleur injecté
 */
export function createAbsenceRoutes(): Router {
  const router = Router();
  
  // Récupération du contrôleur depuis le container DI
  const absenceController = container.get<AbsenceController>('AbsenceController');

  /**
   * @swagger
   * /api/absences:
   *   post:
   *     summary: Créer une déclaration d'absence
   *     description: Créer une nouvelle déclaration d'absence domiciliaire avec validation complète des données
   *     tags: [Absences]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateAbsenceDTO'
   *           examples:
   *             exemple_parisien:
   *               summary: Exemple d'absence à Paris
   *               value:
   *                 dateDebut: "2024-01-15"
   *                 dateFin: "2024-01-20"
   *                 firstname: "Jean"
   *                 lastname: "Dupont"
   *                 phone: "0123456789"
   *                 email: "jean.dupont@email.fr"
   *                 adresseDomicile: "123 Rue de Rivoli, 75001 Paris, France"
   *     responses:
   *       201:
   *         description: Déclaration créée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       400:
   *         description: Erreur de validation des données
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Erreur interne du serveur
   */
  router.post('/', (req, res, next) => absenceController.createAbsence(req, res, next));

  /**
   * @swagger
   * /api/absences/{id}:
   *   get:
   *     summary: Récupérer une déclaration par ID
   *     description: Récupère les détails complets d'une déclaration d'absence par son identifiant
   *     tags: [Absences]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Identifiant unique de la déclaration
   *         example: 1
   *     responses:
   *       200:
   *         description: Déclaration trouvée
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       400:
   *         description: ID invalide
   *       404:
   *         description: Déclaration non trouvée
   *       500:
   *         description: Erreur interne du serveur
   */
  router.get('/:id', (req, res, next) => absenceController.getAbsenceById(req, res, next));

  /**
   * @swagger
   * /api/absences/{id}:
   *   put:
   *     summary: Modifier une déclaration existante
   *     description: Met à jour une déclaration d'absence existante avec validation complète
   *     tags: [Absences]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Identifiant unique de la déclaration à modifier
   *         example: 1
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateAbsenceDTO'
   *     responses:
   *       200:
   *         description: Déclaration mise à jour avec succès
   *       400:
   *         description: Erreur de validation ou ID invalide
   *       404:
   *         description: Déclaration non trouvée
   *       500:
   *         description: Erreur interne du serveur
   */
  router.put('/:id', (req, res, next) => absenceController.updateAbsence(req, res, next));

  /**
   * @swagger
   * /api/absences:
   *   get:
   *     summary: Lister toutes les déclarations
   *     description: Récupère la liste paginée de toutes les déclarations d'absence, triées par date de création (plus récentes en premier)
   *     tags: [Absences]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Numéro de la page à récupérer
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Nombre d'éléments par page
   *         example: 10
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [dateCreation, dateModification, dateDebut, dateFin, firstname, lastname]
   *           default: dateCreation
   *         description: Champ de tri
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [ASC, DESC]
   *           default: DESC
   *         description: Ordre de tri
   *     responses:
   *       200:
   *         description: Liste des déclarations récupérée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedResponse'
   *       400:
   *         description: Paramètres de pagination invalides
   *       500:
   *         description: Erreur interne du serveur
   */
  router.get('/', (req, res, next) => absenceController.listAbsences(req, res, next));

  /**
   * @swagger
   * /api/absences/{id}:
   *   delete:
   *     summary: Supprimer une déclaration
   *     description: Supprime une déclaration d'absence (si implémenté)
   *     tags: [Absences]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Identifiant unique de la déclaration à supprimer
   *     responses:
   *       200:
   *         description: Déclaration supprimée avec succès
   *       400:
   *         description: ID invalide
   *       404:
   *         description: Déclaration non trouvée
   *       501:
   *         description: Fonctionnalité non implémentée
   */
  router.delete('/:id', (req, res, next) => absenceController.deleteAbsence(req, res, next));

  return router;
}