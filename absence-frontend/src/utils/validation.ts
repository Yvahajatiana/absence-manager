// Validation du numéro de téléphone français
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+33|0)[1-9](\d{8})$/
  return phoneRegex.test(phone)
}

// Validation de l'email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validation des dates
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return start <= end
}

// Formatage du numéro de téléphone pour l'affichage
export const formatPhoneNumber = (phone: string): string => {
  if (phone.startsWith('+33')) {
    return phone.replace(/(\+33)(\d)(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6')
  }
  return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
}

// Validation de la longueur du texte
export const isValidLength = (text: string, min: number, max: number): boolean => {
  return text.length >= min && text.length <= max
}