import { ThemeToggle } from '@/components/ThemeToggle'
import { useTrainingStore } from '@/stores/trainingStore'
import { useTrainingInit } from '@/hooks/useTrainingInit'
import { ModuleCard } from '@/components/ModuleCard'

function App() {
  const { modules, completedCount, totalCount, overallProgress } = useTrainingStore()
  const { initialized } = useTrainingInit()

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading training modules...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            ClearTriage FedRAMP Training LMS
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A light-weight browser-based LMS with ClearTriage&apos;s internal employee FedRAMP training materials.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <ModuleCard key={module.id} moduleId={module.id} />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Progress Overview</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg text-gray-600 dark:text-gray-400">Modules Completed:</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedCount} / {totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300">{overallProgress}% Complete</p>
        </div>
      </div>
    </div>
  )
}

export default App
