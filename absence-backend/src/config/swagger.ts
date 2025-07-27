import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Absences Domiciliaires',
    version: '2.0.0',
    description: `
      API REST pour la déclaration d'absences domiciliaires destinées aux services de police.
      
      ## Architecture
      - **Hexagonal Architecture** : Séparation claire entre Domain, Application et Infrastructure
      - **Principes SOLID** : Code maintenable et extensible
      - **TypeScript** : Type safety et documentation vivante
      - **Injection de dépendances** : Découplage et testabilité
      
      ## Fonctionnalités
      - Création et gestion des déclarations d'absence
      - Validation métier complète
      - Pagination et tri
      - Recherche avancée
      - Documentation interactive
    `,
    contact: {
      name: 'Équipe de développement',
      email: 'dev@police-municipale.fr'
    },
    license: {
      name: 'ISC',
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Serveur de développement'
    },
    {
      url: 'https://api.absences.police.local',
      description: 'Serveur de production'
    }
  ],
  components: {
    schemas: {
      CreateAbsenceDTO: {
        type: 'object',
        required: ['dateDebut', 'dateFin', 'firstname', 'lastname', 'phone', 'adresseDomicile'],
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
          firstname: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            description: 'Prénom de la personne',
            example: 'Jean'
          },
          lastname: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            description: 'Nom de famille de la personne',
            example: 'Dupont'
          },
          phone: {
            type: 'string',
            pattern: '^(\\+33|0)[1-9](\\d{8})$',
            description: 'Numéro de téléphone français',
            example: '0123456789'
          },
          email: {
            type: 'string',
            format: 'email',
            maxLength: 100,
            description: 'Adresse email (optionnel)',
            example: 'jean.dupont@email.fr'
          },
          adresseDomicile: {
            type: 'string',
            minLength: 10,
            maxLength: 500,
            description: 'Adresse complète du domicile',
            example: '123 Rue de Rivoli, 75001 Paris, France'
          }
        }
      },
      UpdateAbsenceDTO: {
        type: 'object',
        properties: {
          dateDebut: {
            type: 'string',
            format: 'date',
            description: 'Nouvelle date de début',
            example: '2024-01-16'
          },
          dateFin: {
            type: 'string',
            format: 'date',
            description: 'Nouvelle date de fin',
            example: '2024-01-21'
          },
          firstname: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            description: 'Nouveau prénom',
            example: 'Jean-Pierre'
          },
          lastname: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            description: 'Nouveau nom de famille',
            example: 'Dupont-Martin'
          },
          phone: {
            type: 'string',
            pattern: '^(\\+33|0)[1-9](\\d{8})$',
            description: 'Nouveau numéro de téléphone',
            example: '0987654321'
          },
          email: {
            type: 'string',
            format: 'email',
            maxLength: 100,
            description: 'Nouvelle adresse email',
            example: 'jeanpierre.dupont@email.fr'
          },
          adresseDomicile: {
            type: 'string',
            minLength: 10,
            maxLength: 500,
            description: 'Nouvelle adresse du domicile',
            example: '456 Avenue des Champs, 75008 Paris, France'
          }
        }
      },
      AbsenceResponseDTO: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Identifiant unique de la déclaration',
            example: 1
          },
          dateDebut: {
            type: 'string',
            format: 'date',
            description: 'Date de début de l\'absence',
            example: '2024-01-15'
          },
          dateFin: {
            type: 'string',
            format: 'date',
            description: 'Date de fin de l\'absence',
            example: '2024-01-20'
          },
          firstname: {
            type: 'string',
            description: 'Prénom de la personne',
            example: 'Jean'
          },
          lastname: {
            type: 'string',
            description: 'Nom de famille de la personne',
            example: 'Dupont'
          },
          phone: {
            type: 'string',
            description: 'Numéro de téléphone',
            example: '0123456789'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Adresse email',
            example: 'jean.dupont@email.fr'
          },
          adresseDomicile: {
            type: 'string',
            description: 'Adresse du domicile',
            example: '123 Rue de Rivoli, 75001 Paris, France'
          },
          dateCreation: {
            type: 'string',
            format: 'date-time',
            description: 'Date de création de la déclaration',
            example: '2024-01-10T14:30:00.000Z'
          },
          dateModification: {
            type: 'string',
            format: 'date-time',
            description: 'Date de dernière modification',
            example: '2024-01-10T14:30:00.000Z'
          },
          durationInDays: {
            type: 'integer',
            description: 'Durée en jours',
            example: 6
          },
          fullName: {
            type: 'string',
            description: 'Nom complet',
            example: 'Jean Dupont'
          },
          isActive: {
            type: 'boolean',
            description: 'Absence actuellement active',
            example: false
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
            $ref: '#/components/schemas/AbsenceResponseDTO'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-10T14:30:00.000Z'
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
            example: 'Description de l\'erreur'
          },
          errors: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['Erreur de validation 1', 'Erreur de validation 2']
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-10T14:30:00.000Z'
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
              $ref: '#/components/schemas/AbsenceResponseDTO'
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
                example: 48
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
      description: 'Vérification de l\'état de l\'API'
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/infrastructure/web/routes/*.ts',
    './src/app.ts'
  ]
};

const specs = swaggerJsdoc(options);

export default specs;