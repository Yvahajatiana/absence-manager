import { 
  Controller, 
  Get, 
  Post, 
  Render, 
  Body, 
  Param, 
  Res, 
  ValidationPipe,
  UsePipes,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { AbsenceService } from '../services/absence.service';
import { CreateAbsenceDto } from '../dto/create-absence.dto';

@Controller('declaration')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Get()
  @Render('declaration')
  getDeclarationForm() {
    return {
      title: 'Déclaration d\'Absence - Police Municipale',
      currentPage: 'declaration',
      errors: null,
      formData: {}
    };
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createDeclaration(@Body() createAbsenceDto: CreateAbsenceDto, @Res() res: Response) {
    try {
      // Validation des dates
      const dateDebut = new Date(createAbsenceDto.dateDebut);
      const dateFin = new Date(createAbsenceDto.dateFin);
      const now = new Date();
      
      // Validation : date de début doit être dans au moins 48h
      const minDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      if (dateDebut < minDate) {
        throw new HttpException('La déclaration doit être faite au moins 48h avant le départ', HttpStatus.BAD_REQUEST);
      }
      
      // Validation : date de fin après date de début
      if (dateFin <= dateDebut) {
        throw new HttpException('La date de fin doit être après la date de début', HttpStatus.BAD_REQUEST);
      }
      
      // Validation : durée maximale de 30 jours
      const diffTime = Math.abs(dateFin.getTime() - dateDebut.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 30) {
        throw new HttpException('La durée maximale est de 30 jours', HttpStatus.BAD_REQUEST);
      }

      const result = await this.absenceService.createAbsence(createAbsenceDto);
      
      return res.render('success', {
        title: 'Déclaration Enregistrée - Police Municipale',
        currentPage: 'success',
        absence: result.data
      });
    } catch (error: any) {
      let errors: string[] = [];
      
      if (error.response?.data?.details) {
        errors = error.response.data.details;
      } else if (error.response?.data?.message) {
        errors = [error.response.data.message];
      } else if (error.message) {
        errors = [error.message];
      } else {
        errors = ['Une erreur est survenue'];
      }
      
      return res.render('declaration', {
        title: 'Déclaration d\'Absence - Police Municipale',
        currentPage: 'declaration',
        errors: errors,
        formData: createAbsenceDto
      });
    }
  }
}

@Controller('confirmation')
export class ConfirmationController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Get(':id')
  async getConfirmation(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.absenceService.getAbsence(Number(id));
      
      return res.render('confirmation', {
        title: 'Confirmation de Déclaration - Police Municipale',
        currentPage: 'confirmation',
        absence: result.data
      });
    } catch (error: any) {
      return res.status(404).render('error', {
        title: 'Déclaration Non Trouvée - Police Municipale',
        currentPage: 'error',
        error: 'Déclaration d\'absence non trouvée'
      });
    }
  }
}