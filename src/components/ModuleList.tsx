import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CertificateButton } from '@/components/CertificateButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { LogoutButton } from '@/components/LogoutButton'
import { ModuleCard } from '@/components/ModuleCard'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useTrainingStore } from '@/stores/trainingStore'
import useUserStore from '@/stores/userStore'

export function ModuleList() {
  const navigate = useNavigate()
  const modules = useTrainingStore((state) => state.modules)
  const clearAllData = useTrainingStore((state) => state.clearAllData)
  const isContentRelevantForUser = useUserStore((state) => state.isContentRelevantForUser)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  
  // Filter modules based on user's name
  const filteredModules = useMemo(() => {
    return modules.filter((module) => 
      isContentRelevantForUser(module.requiredForMembers || [])
    )
  }, [modules, isContentRelevantForUser])
  
  // Calculate progress for filtered modules only
  const filteredCompletedCount = useMemo(() => {
    return filteredModules.filter((module) => module.completed).length
  }, [filteredModules])
  
  const filteredTotalCount = filteredModules.length
  
  const filteredOverallProgress = useMemo(() => {
    if (filteredTotalCount === 0) return 0
    return Math.round((filteredCompletedCount / filteredTotalCount) * 100)
  }, [filteredCompletedCount, filteredTotalCount])

  const handleResetClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmReset = async () => {
    await clearAllData()
    setShowConfirmDialog(false)
  }

  const handleCancelReset = () => {
    setShowConfirmDialog(false)
  }

  const handleStartModule = (moduleId: number) => {
    navigate(`/modules/${moduleId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 relative">
          <div className="absolute top-0 right-0 flex gap-2">
            <LogoutButton />
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
          {filteredModules.map((module) => (
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
              disabled={filteredOverallProgress === 0}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-300 hover:border-red-400 dark:border-red-600 dark:hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset All Progress
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {filteredCompletedCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Modules Completed</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                {filteredTotalCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Modules</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {filteredOverallProgress}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${filteredOverallProgress}%` }}
            ></div>
          </div>
          <p className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {filteredOverallProgress === 100 ? 'All training completed! 🎉' : `${filteredOverallProgress}% Complete`}
          </p>
          
          {/* Certificate Button - only shown when training is complete */}
          <div className="flex justify-center">
            <CertificateButton overallProgress={filteredOverallProgress} />
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