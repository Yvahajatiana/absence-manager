const Joi = require('joi');

const absenceSchema = Joi.object({
  dateDebut: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'La date de début doit être une date valide',
      'date.iso': 'La date de début doit être au format ISO (YYYY-MM-DD)',
      'any.required': 'La date de début est obligatoire'
    }),
  
  dateFin: Joi.date()
    .iso()
    .greater(Joi.ref('dateDebut'))
    .required()
    .messages({
      'date.base': 'La date de fin doit être une date valide',
      'date.iso': 'La date de fin doit être au format ISO (YYYY-MM-DD)',
      'date.greater': 'La date de fin doit être postérieure à la date de début',
      'any.required': 'La date de fin est obligatoire'
    }),
  
  coordonneesPers: Joi.object({
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .required()
      .messages({
        'number.base': 'La latitude doit être un nombre',
        'number.min': 'La latitude doit être comprise entre -90 et 90',
        'number.max': 'La latitude doit être comprise entre -90 et 90',
        'any.required': 'La latitude est obligatoire'
      }),
    
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .required()
      .messages({
        'number.base': 'La longitude doit être un nombre',
        'number.min': 'La longitude doit être comprise entre -180 et 180',
        'number.max': 'La longitude doit être comprise entre -180 et 180',
        'any.required': 'La longitude est obligatoire'
      })
  })
    .required()
    .messages({
      'object.base': 'Les coordonnées doivent être un objet',
      'any.required': 'Les coordonnées de la personne sont obligatoires'
    }),
  
  adresseDomicile: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.base': 'L\'adresse doit être une chaîne de caractères',
      'string.min': 'L\'adresse doit contenir au moins 10 caractères',
      'string.max': 'L\'adresse ne peut pas dépasser 500 caractères',
      'any.required': 'L\'adresse du domicile est obligatoire'
    })
});

const validateAbsence = (data) => {
  return absenceSchema.validate(data, { abortEarly: false });
};

const validatePartialAbsence = (data) => {
  const partialSchema = absenceSchema.fork(
    ['dateDebut', 'dateFin', 'coordonneesPers', 'adresseDomicile'],
    (schema) => schema.optional()
  );
  
  return partialSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateAbsence,
  validatePartialAbsence
};