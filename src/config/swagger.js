const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Absences Domiciliaires',
      version: '1.0.0',
      description: 'API REST Node.js pour la déclaration d\'absences domiciliaires destinées aux services de police',
      contact: {
        name: 'Support API',
        email: 'support@absences-api.fr'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      },
      {
        url: 'https://api.absences-domiciliaires.fr',
        description: 'Serveur de production'
      }
    ],
    components: {
      schemas: {
        Absence: {
          type: 'object',
          required: ['dateDebut', 'dateFin', 'coordonneesPers', 'adresseDomicile'],
          properties: {
            id: {
              type: 'integer',
              description: 'Identifiant unique de la déclaration (auto-généré)',
              example: 1
            },
            dateDebut: {
              type: 'string',
              format: 'date',
              description: 'Date de début de l\'absence (YYYY-MM-DD)',
              example: '2024-01-15'
            },
            dateFin: {
              type: 'string',
              format: 'date',
              description: 'Date de fin de l\'absence (YYYY-MM-DD). Doit être postérieure à la date de début.',
              example: '2024-01-20'
            },
            coordonneesPers: {
              type: 'object',
              description: 'Coordonnées GPS de la personne au moment de la déclaration',
              required: ['latitude', 'longitude'],
              properties: {
                latitude: {
                  type: 'number',
                  minimum: -90,
                  maximum: 90,
                  description: 'Latitude en degrés décimaux',
                  example: 48.8566
                },
                longitude: {
                  type: 'number',
                  minimum: -180,
                  maximum: 180,
                  description: 'Longitude en degrés décimaux',
                  example: 2.3522
                }
              }
            },
            adresseDomicile: {
              type: 'string',
              minLength: 10,
              maxLength: 500,
              description: 'Adresse complète du domicile',
              example: '123 Rue de la Paix, 75001 Paris, France'
            },
            dateCreation: {
              type: 'string',
              format: 'date-time',
              description: 'Date et heure de création de la déclaration (auto-généré)',
              example: '2024-01-15T10:30:00.000Z'
            },
            dateModification: {
              type: 'string',
              format: 'date-time',
              description: 'Date et heure de dernière modification (auto-géré)',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        AbsenceInput: {
          type: 'object',
          required: ['dateDebut', 'dateFin', 'coordonneesPers', 'adresseDomicile'],
          properties: {
            dateDebut: {
              type: 'string',
              format: 'date',
              description: 'Date de début de l\'absence (YYYY-MM-DD)',
              example: '2024-01-15'
            },
            dateFin: {
              type: 'string',
              format: 'date',
              description: 'Date de fin de l\'absence (YYYY-MM-DD)',
              example: '2024-01-20'
            },
            coordonneesPers: {
              type: 'object',
              required: ['latitude', 'longitude'],
              properties: {
                latitude: {
                  type: 'number',
                  minimum: -90,
                  maximum: 90,
                  example: 48.8566
                },
                longitude: {
                  type: 'number',
                  minimum: -180,
                  maximum: 180,
                  example: 2.3522
                }
              }
            },
            adresseDomicile: {
              type: 'string',
              minLength: 10,
              maxLength: 500,
              example: '123 Rue de la Paix, 75001 Paris, France'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Opération réussie'
            },
            data: {
              $ref: '#/components/schemas/Absence'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Erreur de validation'
            },
            message: {
              type: 'string',
              example: 'Description de l\'erreur'
            },
            details: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['La date de début est obligatoire']
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Absence'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                currentPage: {
                  type: 'integer',
                  example: 1
                },
                totalPages: {
                  type: 'integer',
                  example: 5
                },
                totalItems: {
                  type: 'integer',
                  example: 42
                },
                itemsPerPage: {
                  type: 'integer',
                  example: 10
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Absences',
        description: 'Gestion des déclarations d\'absence domiciliaire'
      },
      {
        name: 'Health',
        description: 'Endpoints de santé et monitoring'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/app.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;