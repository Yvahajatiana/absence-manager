import axios from 'axios'
import type { 
  Absence, 
  CreateAbsenceData, 
  UpdateAbsenceData, 
  ApiResponse, 
  PaginatedResponse 
} from '../types/absence'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const absenceApi = {
  // Créer une absence
  create: async (data: CreateAbsenceData): Promise<Absence> => {
    const response = await api.post<ApiResponse<Absence>>('/absences', data)
    return response.data.data
  },

  // Récupérer une absence par ID
  getById: async (id: number): Promise<Absence> => {
    const response = await api.get<ApiResponse<Absence>>(`/absences/${id}`)
    return response.data.data
  },

  // Mettre à jour une absence
  update: async (id: number, data: UpdateAbsenceData): Promise<Absence> => {
    const response = await api.put<ApiResponse<Absence>>(`/absences/${id}`, data)
    return response.data.data
  },

  // Lister les absences avec pagination
  list: async (page = 1, limit = 10): Promise<PaginatedResponse<Absence>> => {
    const response = await api.get<PaginatedResponse<Absence>>('/absences', {
      params: { page, limit }
    })
    return response.data
  },

  // Health check
  healthCheck: async (): Promise<{ message: string }> => {
    const response = await api.get('/health')
    return response.data
  }
}

export default api