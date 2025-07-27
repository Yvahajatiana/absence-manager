import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateAbsenceDto {
  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  @IsString()
  @Length(2, 50, { message: 'Le prénom doit faire entre 2 et 50 caractères' })
  firstname: string;

  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsString()
  @Length(2, 50, { message: 'Le nom doit faire entre 2 et 50 caractères' })
  lastname: string;

  @IsNotEmpty({ message: 'Le téléphone est obligatoire' })
  @Matches(/^(\+33|0)[1-9](\d{8})$/, { 
    message: 'Format de téléphone invalide (ex: 0123456789)' 
  })
  phone: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email invalide' })
  email?: string;

  @IsNotEmpty({ message: 'L\'adresse est obligatoire' })
  @IsString()
  @Length(10, 500, { message: 'L\'adresse doit faire entre 10 et 500 caractères' })
  adresseDomicile: string;

  @IsNotEmpty({ message: 'La date de début est obligatoire' })
  @IsString()
  dateDebut: string;

  @IsNotEmpty({ message: 'La date de fin est obligatoire' })
  @IsString()
  dateFin: string;
}