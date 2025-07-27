import { useQuery, useMutation, useQueryClient } from 'react-query'
import { absenceApi } from '../services/api'
import type { CreateAbsenceData, UpdateAbsenceData } from '../types/absence'

// Hook pour lister les absences
export const useAbsences = (page = 1, limit = 10) => {
  return useQuery(
    ['absences', page, limit],
    () => absenceApi.list(page, limit),
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 secondes
    }
  )
}

// Hook pour récupérer une absence par ID
export const useAbsence = (id: number) => {
  return useQuery(
    ['absence', id],
    () => absenceApi.getById(id),
    {
      enabled: !!id,
    }
  )
}

// Hook pour créer une absence
export const useCreateAbsence = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (data: CreateAbsenceData) => absenceApi.create(data),
    {
      onSuccess: () => {
        // Invalider la liste des absences pour rafraîchir
        queryClient.invalidateQueries(['absences'])
      },
    }
  )
}

// Hook pour mettre à jour une absence
export const useUpdateAbsence = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ id, data }: { id: number; data: UpdateAbsenceData }) => 
      absenceApi.update(id, data),
    {
      onSuccess: (updatedAbsence) => {
        // Mettre à jour le cache
        queryClient.setQueryData(['absence', updatedAbsence.id], updatedAbsence)
        queryClient.invalidateQueries(['absences'])
      },
    }
  )
}

// Hook pour le health check
export const useHealthCheck = () => {
  return useQuery(
    ['health'],
    () => absenceApi.healthCheck(),
    {
      refetchInterval: 60000, // Vérifier toutes les minutes
      retry: 3,
    }
  )
}