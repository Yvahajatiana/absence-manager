const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  // Erreur de validation Joi
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Erreur de validation',
      details: err.details.map(detail => detail.message)
    });
  }

  // Erreur de validation Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Erreur de validation',
      details: err.errors.map(error => error.message)
    });
  }

  // Erreur de contrainte unique Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: 'Conflit de données',
      message: 'Cette ressource existe déjà'
    });
  }

  // Erreur de base de données Sequelize
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      error: 'Erreur de base de données',
      message: 'Une erreur est survenue lors de l\'accès aux données'
    });
  }

  // Erreur de syntaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Format JSON invalide',
      message: 'Le corps de la requête contient du JSON mal formé'
    });
  }

  // Erreur 404 personnalisée
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      error: 'Ressource non trouvée',
      message: err.message || 'La ressource demandée n\'existe pas'
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    success: false,
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'production' 
      ? 'Une erreur inattendue s\'est produite' 
      : err.message
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
    message: `La route ${req.method} ${req.path} n'existe pas`
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};