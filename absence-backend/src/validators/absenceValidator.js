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
  
  firstname: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Le prénom doit être une chaîne de caractères',
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères',
      'any.required': 'Le prénom est obligatoire'
    }),
  
  lastname: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Le nom de famille doit être une chaîne de caractères',
      'string.min': 'Le nom de famille doit contenir au moins 2 caractères',
      'string.max': 'Le nom de famille ne peut pas dépasser 50 caractères',
      'any.required': 'Le nom de famille est obligatoire'
    }),
  
  phone: Joi.string()
    .pattern(/^(\+33|0)[1-9](\d{8})$/)
    .required()
    .messages({
      'string.base': 'Le numéro de téléphone doit être une chaîne de caractères',
      'string.pattern.base': 'Le numéro de téléphone doit être au format français valide (ex: 0123456789 ou +33123456789)',
      'any.required': 'Le numéro de téléphone est obligatoire'
    }),
  
  email: Joi.string()
    .email()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.base': 'L\'adresse email doit être une chaîne de caractères',
      'string.email': 'L\'adresse email doit être valide',
      'string.max': 'L\'adresse email ne peut pas dépasser 100 caractères'
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
    ['dateDebut', 'dateFin', 'firstname', 'lastname', 'phone', 'email', 'adresseDomicile'],
    (schema) => schema.optional()
  );
  
  return partialSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateAbsence,
  validatePartialAbsence
};