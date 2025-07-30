/**
 * Entité métier Absence (Domain Layer)
 * Contient la logique métier pure, sans dépendances externes
 */
export class Absence {
  public readonly id: number;
  public readonly dateDebut: Date;
  public readonly dateFin: Date;
  public readonly firstname: string;
  public readonly lastname: string;
  public readonly phone: string;
  public readonly email?: string;
  public readonly adresseDomicile: string;
  public readonly dateCreation: Date;
  public readonly dateModification: Date;

  constructor(data: AbsenceData) {
    this.id = data.id;
    this.dateDebut = new Date(data.dateDebut);
    this.dateFin = new Date(data.dateFin);
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.phone = data.phone;
    this.email = data.email;
    this.adresseDomicile = data.adresseDomicile;
    this.dateCreation = new Date(data.dateCreation);
    this.dateModification = new Date(data.dateModification);

    // Validation des règles métier
    this.validateBusinessRules();
  }

  /**
   * Validation des règles métier (encapsulation de la logique)
   */
  private validateBusinessRules(): void {
    if (this.dateFin <= this.dateDebut) {
      throw new Error('La date de fin doit être postérieure à la date de début');
    }

    const durationInDays = this.getDurationInDays();
    if (durationInDays > 30) {
      throw new Error('La durée maximale d\'absence est de 30 jours');
    }

    if (durationInDays < 1) {
      throw new Error('La durée minimale d\'absence est de 1 jour');
    }
  }

  /**
   * Calculer la durée en jours
   */
  public getDurationInDays(): number {
    const diffTime = this.dateFin.getTime() - this.dateDebut.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Vérifier si l'absence est active à une date donnée
   */
  public isActiveOn(date: Date): boolean {
    return date >= this.dateDebut && date <= this.dateFin;
  }

  /**
   * Vérifier si l'absence chevauche avec une autre période
   */
  public overlapsWith(startDate: Date, endDate: Date): boolean {
    return !(endDate < this.dateDebut || startDate > this.dateFin);
  }

  /**
   * Obtenir le nom complet
   */
  public getFullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  /**
   * Vérifier si l'absence est récente (créée dans les 7 derniers jours)
   */
  public isRecent(): boolean {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.dateCreation >= sevenDaysAgo;
  }

  /**
   * Créer une nouvelle instance avec des données mises à jour
   */
  public update(updates: Partial<AbsenceUpdateData>): Absence {
    return new Absence({
      ...this.toData(),
      ...updates,
      id: this.id,
      dateCreation: this.dateCreation,
      dateModification: new Date()
    });
  }

  /**
   * Convertir en format de données brutes
   */
  public toData(): AbsenceData {
    return {
      id: this.id,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
      email: this.email,
      adresseDomicile: this.adresseDomicile,
      dateCreation: this.dateCreation,
      dateModification: this.dateModification
    };
  }
}

/**
 * Interface pour les données d'absence complètes
 */
export interface AbsenceData {
  id: number;
  dateDebut: Date | string;
  dateFin: Date | string;
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  adresseDomicile: string;
  dateCreation: Date | string;
  dateModification: Date | string;
}

/**
 * Interface pour la création d'une absence
 */
export interface AbsenceCreateData {
  dateDebut: Date | string;
  dateFin: Date | string;
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  adresseDomicile: string;
}

/**
 * Interface pour la mise à jour d'une absence
 */
export interface AbsenceUpdateData {
  dateDebut?: Date | string;
  dateFin?: Date | string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  adresseDomicile?: string;
}