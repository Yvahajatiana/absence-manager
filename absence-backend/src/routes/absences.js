const express = require('express');
const { Absence } = require('../models');
const { validateAbsence, validatePartialAbsence } = require('../validators/absenceValidator');

const router = express.Router();

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
 *             $ref: '#/components/schemas/AbsenceInput'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', async (req, res, next) => {
  try {
    // Validation des données
    const { error, value } = validateAbsence(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Création de la déclaration
    const absence = await Absence.create(value);

    res.status(201).json({
      success: true,
      message: 'Déclaration d\'absence créée avec succès',
      data: {
        id: absence.id,
        dateDebut: absence.dateDebut,
        dateFin: absence.dateFin,
        firstname: absence.firstname,
        lastname: absence.lastname,
        phone: absence.phone,
        email: absence.email,
        adresseDomicile: absence.adresseDomicile,
        dateCreation: absence.dateCreation,
        dateModification: absence.dateModification
      }
    });
  } catch (error) {
    next(error);
  }
});

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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Absence'
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Déclaration non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérification que l'ID est un nombre
    if (isNaN(parseInt(id))) {
      const error = new Error('L\'ID doit être un nombre valide');
      error.status = 400;
      return next(error);
    }

    const absence = await Absence.findByPk(id);

    if (!absence) {
      const error = new Error(`Aucune déclaration d'absence trouvée avec l'ID ${id}`);
      error.status = 404;
      return next(error);
    }

    res.json({
      success: true,
      data: {
        id: absence.id,
        dateDebut: absence.dateDebut,
        dateFin: absence.dateFin,
        firstname: absence.firstname,
        lastname: absence.lastname,
        phone: absence.phone,
        email: absence.email,
        adresseDomicile: absence.adresseDomicile,
        dateCreation: absence.dateCreation,
        dateModification: absence.dateModification
      }
    });
  } catch (error) {
    next(error);
  }
});

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
 *             $ref: '#/components/schemas/AbsenceInput'
 *           examples:
 *             modification_dates:
 *               summary: Modification des dates
 *               value:
 *                 dateDebut: "2024-01-16"
 *                 dateFin: "2024-01-25"
 *                 firstname: "Jean"
 *                 lastname: "Dupont"
 *                 phone: "0123456789"
 *                 email: "jean.dupont@email.fr"
 *                 adresseDomicile: "123 Rue de Rivoli, 75001 Paris, France"
 *     responses:
 *       200:
 *         description: Déclaration mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Erreur de validation ou ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Déclaration non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérification que l'ID est un nombre
    if (isNaN(parseInt(id))) {
      const error = new Error('L\'ID doit être un nombre valide');
      error.status = 400;
      return next(error);
    }

    // Vérification de l'existence de la déclaration
    const absence = await Absence.findByPk(id);
    if (!absence) {
      const error = new Error(`Aucune déclaration d'absence trouvée avec l'ID ${id}`);
      error.status = 404;
      return next(error);
    }

    // Validation des données (validation partielle pour permettre les mises à jour partielles)
    const { error, value } = validateAbsence(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Mise à jour de la déclaration
    await absence.update(value);

    res.json({
      success: true,
      message: 'Déclaration d\'absence mise à jour avec succès',
      data: {
        id: absence.id,
        dateDebut: absence.dateDebut,
        dateFin: absence.dateFin,
        firstname: absence.firstname,
        lastname: absence.lastname,
        phone: absence.phone,
        email: absence.email,
        adresseDomicile: absence.adresseDomicile,
        dateCreation: absence.dateCreation,
        dateModification: absence.dateModification
      }
    });
  } catch (error) {
    next(error);
  }
});

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
 *     responses:
 *       200:
 *         description: Liste des déclarations récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       400:
 *         description: Paramètres de pagination invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: absences } = await Absence.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['dateCreation', 'DESC']]
    });

    res.json({
      success: true,
      data: absences.map(absence => ({
        id: absence.id,
        dateDebut: absence.dateDebut,
        dateFin: absence.dateFin,
        firstname: absence.firstname,
        lastname: absence.lastname,
        phone: absence.phone,
        email: absence.email,
        adresseDomicile: absence.adresseDomicile,
        dateCreation: absence.dateCreation,
        dateModification: absence.dateModification
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;