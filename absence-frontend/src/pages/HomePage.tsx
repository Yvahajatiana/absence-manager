import { Link } from 'react-router-dom'
import { PlusIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { useAbsences, useHealthCheck } from '../hooks/useAbsences'
import LoadingSpinner from '../components/LoadingSpinner'

const HomePage = () => {
  const { data: healthData } = useHealthCheck()
  const { data: absencesData, isLoading } = useAbsences(1, 5)

  const stats = [
    {
      name: 'Total des déclarations',
      value: absencesData?.pagination.totalItems || 0,
      icon: DocumentTextIcon,
      color: 'text-blue-600'
    },
    {
      name: 'Nouvelles cette semaine',
      value: '12', // Mock data - à implémenter avec une vraie API
      icon: ChartBarIcon,
      color: 'text-green-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestionnaire d'Absences Domiciliaires
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez facilement les déclarations d'absence domiciliaire destinées aux services de police.
          </p>
          {healthData && (
            <div className="mt-4 flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              API connectée
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/absences/new"
          className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 hover:bg-gray-50 rounded-lg shadow transition-all"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-primary-500 text-white">
              <PlusIcon className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              Nouvelle déclaration
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Créer une nouvelle déclaration d'absence domiciliaire
            </p>
          </div>
        </Link>

        <Link
          to="/absences"
          className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 hover:bg-gray-50 rounded-lg shadow transition-all"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-green-500 text-white">
              <DocumentTextIcon className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              Voir les déclarations
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Consulter et gérer les déclarations existantes
            </p>
          </div>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        stat.value
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Absences */}
      {absencesData && absencesData.data.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Déclarations récentes
            </h3>
            <div className="space-y-3">
              {absencesData.data.slice(0, 3).map((absence) => (
                <div key={absence.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {absence.firstname} {absence.lastname}
                    </p>
                    <p className="text-sm text-gray-500">
                      Du {absence.dateDebut} au {absence.dateFin}
                    </p>
                  </div>
                  <Link
                    to={`/absences/${absence.id}`}
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    Voir →
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/absences"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Voir toutes les déclarations →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage