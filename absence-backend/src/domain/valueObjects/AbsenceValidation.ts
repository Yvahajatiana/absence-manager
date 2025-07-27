/**
 * Value Object pour la validation des absences
 * Encapsule les règles de validation métier (SRP)
 */
export class AbsenceValidation {
  public static readonly MIN_FIRSTNAME_LENGTH = 2;
  public static readonly MAX_FIRSTNAME_LENGTH = 50;
  public static readonly MIN_LASTNAME_LENGTH = 2;
  public static readonly MAX_LASTNAME_LENGTH = 50;
  public static readonly MIN_ADDRESS_LENGTH = 10;
  public static readonly MAX_ADDRESS_LENGTH = 500;
  public static readonly MAX_EMAIL_LENGTH = 100;
  public static readonly MAX_DURATION_DAYS = 30;
  public static readonly MIN_DURATION_DAYS = 1;
  public static readonly MIN_ADVANCE_HOURS = 48;

  /**
   * Valider les dates d'absence
   */
  public static validateDates(dateDebut: Date, dateFin: Date): ValidationResult {
    const errors: string[] = [];

    // Vérifier que la date de fin est après la date de début
    if (dateFin <= dateDebut) {
      errors.push('La date de fin doit être postérieure à la date de début');
    }

    // Vérifier la durée maximale
    const durationInDays = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
    if (durationInDays > this.MAX_DURATION_DAYS) {
      errors.push(`La durée maximale d'absence est de ${this.MAX_DURATION_DAYS} jours`);
    }

    if (durationInDays < this.MIN_DURATION_DAYS) {
      errors.push(`La durée minimale d'absence est de ${this.MIN_DURATION_DAYS} jour`);
    }

    // Vérifier le délai d'anticipation (48h)
    const now = new Date();
    const hoursUntilStart = (dateDebut.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilStart < this.MIN_ADVANCE_HOURS) {
      errors.push(`La déclaration doit être faite au moins ${this.MIN_ADVANCE_HOURS}h à l'avance`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valider le prénom
   */
  public static validateFirstname(firstname: string): ValidationResult {
    const errors: string[] = [];

    if (!firstname || firstname.trim().length === 0) {
      errors.push('Le prénom est obligatoire');
    } else {
      const trimmed = firstname.trim();
      if (trimmed.length < this.MIN_FIRSTNAME_LENGTH) {
        errors.push(`Le prénom doit contenir au moins ${this.MIN_FIRSTNAME_LENGTH} caractères`);
      }
      if (trimmed.length > this.MAX_FIRSTNAME_LENGTH) {
        errors.push(`Le prénom ne peut pas dépasser ${this.MAX_FIRSTNAME_LENGTH} caractères`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valider le nom de famille
   */
  public static validateLastname(lastname: string): ValidationResult {
    const errors: string[] = [];

    if (!lastname || lastname.trim().length === 0) {
      errors.push('Le nom de famille est obligatoire');
    } else {
      const trimmed = lastname.trim();
      if (trimmed.length < this.MIN_LASTNAME_LENGTH) {
        errors.push(`Le nom de famille doit contenir au moins ${this.MIN_LASTNAME_LENGTH} caractères`);
      }
      if (trimmed.length > this.MAX_LASTNAME_LENGTH) {
        errors.push(`Le nom de famille ne peut pas dépasser ${this.MAX_LASTNAME_LENGTH} caractères`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valider le numéro de téléphone français
   */
  public static validatePhone(phone: string): ValidationResult {
    const errors: string[] = [];
    const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;

    if (!phone || phone.trim().length === 0) {
      errors.push('Le numéro de téléphone est obligatoire');
    } else if (!phoneRegex.test(phone.trim())) {
      errors.push('Le numéro de téléphone doit être au format français valide (ex: 0123456789 ou +33123456789)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valider l'adresse email (optionnelle)
   */
  public static validateEmail(email?: string): ValidationResult {
    const errors: string[] = [];
    
    if (email && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmed = email.trim();
      
      if (!emailRegex.test(trimmed)) {
        errors.push('L\'adresse email doit être valide');
      }
      
      if (trimmed.length > this.MAX_EMAIL_LENGTH) {
        errors.push(`L'adresse email ne peut pas dépasser ${this.MAX_EMAIL_LENGTH} caractères`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valider l'adresse du domicile
   */
  public static validateAddress(address: string): ValidationResult {
    const errors: string[] = [];

    if (!address || address.trim().length === 0) {
      errors.push('L\'adresse du domicile est obligatoire');
    } else {
      const trimmed = address.trim();
      if (trimmed.length < this.MIN_ADDRESS_LENGTH) {
        errors.push(`L'adresse doit contenir au moins ${this.MIN_ADDRESS_LENGTH} caractères`);
      }
      if (trimmed.length > this.MAX_ADDRESS_LENGTH) {
        errors.push(`L'adresse ne peut pas dépasser ${this.MAX_ADDRESS_LENGTH} caractères`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validation complète d'une absence
   */
  public static validateComplete(data: {
    dateDebut: Date;
    dateFin: Date;
    firstname: string;
    lastname: string;
    phone: string;
    email?: string;
    adresseDomicile: string;
  }): ValidationResult {
    const allErrors: string[] = [];

    // Validation des dates
    const dateValidation = this.validateDates(data.dateDebut, data.dateFin);
    allErrors.push(...dateValidation.errors);

    // Validation du prénom
    const firstnameValidation = this.validateFirstname(data.firstname);
    allErrors.push(...firstnameValidation.errors);

    // Validation du nom
    const lastnameValidation = this.validateLastname(data.lastname);
    allErrors.push(...lastnameValidation.errors);

    // Validation du téléphone
    const phoneValidation = this.validatePhone(data.phone);
    allErrors.push(...phoneValidation.errors);

    // Validation de l'email (optionnel)
    const emailValidation = this.validateEmail(data.email);
    allErrors.push(...emailValidation.errors);

    // Validation de l'adresse
    const addressValidation = this.validateAddress(data.adresseDomicile);
    allErrors.push(...addressValidation.errors);

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }
}

/**
 * Interface pour le résultat de validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}