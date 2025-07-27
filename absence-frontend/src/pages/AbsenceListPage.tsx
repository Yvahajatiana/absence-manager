import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { useAbsences } from '../hooks/useAbsences'
import { formatDate, calculateDuration } from '../utils/date'
import { formatPhoneNumber } from '../utils/validation'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const AbsenceListPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isLoading, error, refetch } = useAbsences(currentPage, 10)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erreur de chargement"
        message="Impossible de charger les déclarations d'absence"
        onRetry={() => refetch()}
      />
    )
  }

  const absences = data?.data || []
  const pagination = data?.pagination

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Déclarations d'absence
          </h1>
          <p className="text-gray-600">
            {pagination ? `${pagination.totalItems} déclaration(s) au total` : ''}
          </p>
        </div>
        <Link
          to="/absences/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouvelle déclaration
        </Link>
      </div>

      {/* Table */}
      {absences.length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Aucune déclaration
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par créer une nouvelle déclaration d'absence.
          </p>
          <div className="mt-6">
            <Link
              to="/absences/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle déclaration
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {absences.map((absence) => (
              <li key={absence.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {absence.firstname} {absence.lastname}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {calculateDuration(absence.dateDebut, absence.dateFin)} jour(s)
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <p>
                            Du {formatDate(absence.dateDebut)} au {formatDate(absence.dateFin)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <p>{formatPhoneNumber(absence.phone)}</p>
                        {absence.email && (
                          <>
                            <span className="mx-2">•</span>
                            <p>{absence.email}</p>
                          </>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <p className="truncate">{absence.adresseDomicile}</p>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <Link
                        to={`/absences/${absence.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Voir
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> sur{' '}
                <span className="font-medium">{pagination.totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AbsenceListPage