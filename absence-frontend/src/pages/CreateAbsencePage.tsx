import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCreateAbsence, useUpdateAbsence, useAbsence } from '../hooks/useAbsences'
import { CreateAbsenceData } from '../types/absence'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const CreateAbsencePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const { data: existingAbsence } = useAbsence(Number(id))
  const createMutation = useCreateAbsence()
  const updateMutation = useUpdateAbsence()
  
  const { register, handleSubmit, formState: { errors } } = useForm<CreateAbsenceData>({
    defaultValues: existingAbsence || {}
  })

  const [submitError, setSubmitError] = useState<string | null>(null)

  const onSubmit = async (data: CreateAbsenceData) => {
    try {
      setSubmitError(null)
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id: Number(id), data })
        navigate(`/absences/${id}`)
      } else {
        const result = await createMutation.mutateAsync(data)
        navigate(`/absences/${result.id}`)
      }
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Une erreur est survenue')
    }
  }

  const isLoading = createMutation.isLoading || updateMutation.isLoading

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEdit ? 'Modifier la déclaration' : 'Nouvelle déclaration d\'absence'}
          </h1>

          {submitError && (
            <div className="mb-6">
              <ErrorMessage message={submitError} />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prénom *
                </label>
                <input
                  type="text"
                  {...register('firstname', { 
                    required: 'Le prénom est obligatoire',
                    minLength: { value: 2, message: 'Minimum 2 caractères' },
                    maxLength: { value: 50, message: 'Maximum 50 caractères' }
                  })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.firstname && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstname.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom *
                </label>
                <input
                  type="text"
                  {...register('lastname', { 
                    required: 'Le nom est obligatoire',
                    minLength: { value: 2, message: 'Minimum 2 caractères' },
                    maxLength: { value: 50, message: 'Maximum 50 caractères' }
                  })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.lastname && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastname.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de début *
                </label>
                <input
                  type="date"
                  {...register('dateDebut', { 
                    required: 'La date de début est obligatoire'
                  })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.dateDebut && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateDebut.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de fin *
                </label>
                <input
                  type="date"
                  {...register('dateFin', { 
                    required: 'La date de fin est obligatoire'
                  })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.dateFin && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateFin.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  placeholder="0123456789"
                  {...register('phone', { 
                    required: 'Le téléphone est obligatoire',
                    pattern: {
                      value: /^(\+33|0)[1-9](\d{8})$/,
                      message: 'Format invalide (ex: 0123456789)'
                    }
                  })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email (optionnel)
                </label>
                <input
                  type="email"
                  {...register('email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Format email invalide'
                    }
                  })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adresse du domicile *
              </label>
              <textarea
                rows={3}
                {...register('adresseDomicile', { 
                  required: 'L\'adresse est obligatoire',
                  minLength: { value: 10, message: 'Minimum 10 caractères' },
                  maxLength: { value: 500, message: 'Maximum 500 caractères' }
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.adresseDomicile && (
                <p className="mt-1 text-sm text-red-600">{errors.adresseDomicile.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/absences')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center"
              >
                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                {isEdit ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateAbsencePage