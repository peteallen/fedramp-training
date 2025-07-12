import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTrainingStore } from '@/stores/trainingStore'
import { useTrainingInit } from '@/hooks/useTrainingInit'
import { ModuleCard } from '@/components/ModuleCard'
import { ModuleViewer } from '@/components/ModuleViewer'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'

function App() {
  const { modules, completedCount, totalCount, overallProgress, clearAllData } = useTrainingStore()
  const { initialized } = useTrainingInit()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [currentModuleId, setCurrentModuleId] = useState<number | null>(null)

  const handleResetClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmReset = () => {
    clearAllData()
    setShowConfirmDialog(false)
  }

  const handleCancelReset = () => {
    setShowConfirmDialog(false)
  }

  const handleStartModule = (moduleId: number) => {
    setCurrentModuleId(moduleId)
  }

  const handleBackToModules = () => {
    setCurrentModuleId(null)
  }

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

  // If a module is selected, show the module viewer
  if (currentModuleId !== null) {
    return (
      <ModuleViewer 
        moduleId={currentModuleId} 
        onBack={handleBackToModules}
      />
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
            🛡️ ClearTriage Security & Privacy Training
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            FedRAMP Low Impact SaaS Awareness Training for ClearTriage Team
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Complete these three modules to meet our FedRAMP Awareness and Training (AT) requirements
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <ModuleCard 
              key={module.id} 
              moduleId={module.id} 
              onStartModule={handleStartModule}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Training Progress</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetClick}
              disabled={overallProgress === 0}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-300 hover:border-red-400 dark:border-red-600 dark:hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset All Progress
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {completedCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Modules Completed</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                {totalCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Modules</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {overallProgress}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
            {overallProgress === 100 ? 'All training completed! 🎉' : `${overallProgress}% Complete`}
          </p>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            💡 About This Training
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <strong>Scope:</strong> FedRAMP Low Impact SaaS requirements for ClearTriage app and Google Drive usage
            </div>
            <div>
              <strong>Customer:</strong> Department of Veterans Affairs (VA)
            </div>
            <div>
              <strong>Team Size:</strong> 6 ClearTriage team members
            </div>
            <div>
              <strong>Compliance:</strong> FedRAMP AT-1, AT-2, AT-3 controls
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Reset All Progress"
        message="Are you sure you want to reset all training progress? This action cannot be undone and will clear all module progress, completion status, and quiz scores."
        confirmText="Reset All"
        cancelText="Cancel"
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
    </div>
  )
}

export default App
