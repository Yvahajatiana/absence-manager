import { format, parseISO, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return dateString
    return format(date, 'dd/MM/yyyy', { locale: fr })
  } catch {
    return dateString
  }
}

export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return dateString
    return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr })
  } catch {
    return dateString
  }
}

export const formatDateForInput = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return ''
    return format(date, 'yyyy-MM-dd')
  } catch {
    return ''
  }
}

export const calculateDuration = (startDate: string, endDate: string): number => {
  try {
    const start = parseISO(startDate)
    const end = parseISO(endDate)
    if (!isValid(start) || !isValid(end)) return 0
    
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1 // Inclure le jour de début
  } catch {
    return 0
  }
}