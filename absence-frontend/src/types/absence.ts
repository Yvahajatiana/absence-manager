export interface Absence {
  id: number
  dateDebut: string
  dateFin: string
  firstname: string
  lastname: string
  phone: string
  email?: string
  adresseDomicile: string
  dateCreation: string
  dateModification: string
}

export interface CreateAbsenceData {
  dateDebut: string
  dateFin: string
  firstname: string
  lastname: string
  phone: string
  email?: string
  adresseDomicile: string
}

export interface UpdateAbsenceData extends CreateAbsenceData {}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export interface ApiError {
  success: false
  error: string
  message: string
  details?: string[]
}