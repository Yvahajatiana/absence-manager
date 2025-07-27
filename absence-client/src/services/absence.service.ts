import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateAbsenceDto } from '../dto/create-absence.dto';

export interface Absence {
  id: number;
  dateDebut: string;
  dateFin: string;
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  adresseDomicile: string;
  dateCreation: string;
  dateModification: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable()
export class AbsenceService {
  private readonly apiBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiBaseUrl = this.configService.get<string>('API_BASE_URL', 'http://localhost:3000/api');
  }

  async createAbsence(createAbsenceDto: CreateAbsenceDto): Promise<ApiResponse<Absence>> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<ApiResponse<Absence>>(`${this.apiBaseUrl}/absences`, createAbsenceDto)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAbsence(id: number): Promise<ApiResponse<Absence>> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<Absence>>(`${this.apiBaseUrl}/absences/${id}`)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}