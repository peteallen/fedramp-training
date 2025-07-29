import { useState } from 'react'
import { CertificateButton } from '@/components/CertificateButton'
import { CertificateModal } from '@/components/CertificateModal'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { LogoutButton } from '@/components/LogoutButton'
import { ModuleCard } from '@/components/ModuleCard'
import { ModuleViewer } from '@/components/ModuleViewer'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { useTrainingInit } from '@/hooks/useTrainingInit'
import { useCertificateStore } from '@/stores/certificateStore'
import { useTrainingStore } from '@/stores/trainingStore'
import useUserStore from '@/stores/userStore'
import type { UserOnboardingData } from '@/types/user'

function App() {
  const modules = useTrainingStore((state) => state.modules)
  const completedCount = useTrainingStore((state) => state.completedCount)
  const totalCount = useTrainingStore((state) => state.totalCount)
  const overallProgress = useTrainingStore((state) => state.overallProgress)
  const clearAllData = useTrainingStore((state) => state.clearAllData)
  
  const showModal = useCertificateStore((state) => state.showModal)
  const setShowModal = useCertificateStore((state) => state.setShowModal)
  const saveUserData = useCertificateStore((state) => state.saveUserData)
  const setGenerating = useCertificateStore((state) => state.setGenerating)
  const addGeneratedCertificate = useCertificateStore((state) => state.addGeneratedCertificate)
  
  const isOnboarded = useUserStore((state) => state.isOnboarded)
  const completeOnboarding = useUserStore((state) => state.completeOnboarding)
  const { initialized } = useTrainingInit()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [currentModuleId, setCurrentModuleId] = useState<number | null>(null)

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
    setCurrentModuleId(moduleId)
  }

  const handleBackToModules = () => {
    setCurrentModuleId(null)
  }

  const handleCloseCertificateModal = () => {
    setShowModal(false)
  }

  const handleOnboardingComplete = (userData: UserOnboardingData) => {
    completeOnboarding(userData)
  }

  const handleGenerateCertificate = async (userData: { fullName: string }) => {
    try {
      setGenerating(true)
      
      // Save user data for future use
      saveUserData(userData)
      
      // Import certificate service and template dynamically to reduce bundle size
      const [{ CertificateService }, { CertificateTemplate }] = await Promise.all([
        import('@/services/certificateService'),
        import('@/components/CertificateTemplate')
      ])
      
      // Extract completion data
      const { extractCompletionData } = await import('@/stores/certificateStore')
      const completionData = extractCompletionData()
      
      if (!completionData) {
        throw new Error('Training not completed. Please complete all modules first.')
      }
      
      // Generate certificate ID and create certificate data
      const certificateId = CertificateService.generateCertificateId()
      const issueDate = new Date()
      
      // Create a temporary container for the certificate template
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.top = '-9999px'
      tempContainer.style.width = '11in'
      tempContainer.style.height = '8.5in'
      document.body.appendChild(tempContainer)
      
      // Render the certificate template
      const { createRoot } = await import('react-dom/client')
      const root = createRoot(tempContainer)
      
      await new Promise<void>((resolve) => {
        root.render(
          CertificateTemplate({
            userData,
            completionData,
            certificateId,
            issueDate
          })
        )
        // Wait for rendering to complete
        setTimeout(resolve, 100)
      })
      
      // Generate filename and PDF
      const filename = CertificateService.generateFilename(userData.fullName, issueDate)
      await CertificateService.generatePDF(tempContainer.firstElementChild as HTMLElement, filename)
      
      // Save certificate to history
      addGeneratedCertificate({
        id: certificateId,
        issueDate,
        userData,
        completionSnapshot: completionData
      })
      
      // Clean up
      root.unmount()
      document.body.removeChild(tempContainer)
      
      // Close modal
      setShowModal(false)
      
      // Show success message
      alert('Certificate generated successfully! Your certificate has been downloaded.')
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate certificate. Please try again.'
      alert(`Certificate generation failed: ${errorMessage}`)
    } finally {
      setGenerating(false)
    }
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

  // Show welcome screen if user hasn't completed onboarding
  if (!isOnboarded) {
    return <WelcomeScreen onComplete={handleOnboardingComplete} />
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
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {modules.map((module: any) => (
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
          <p className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {overallProgress === 100 ? 'All training completed! 🎉' : `${overallProgress}% Complete`}
          </p>
          
          {/* Certificate Button - only shown when training is complete */}
          <div className="flex justify-center">
            <CertificateButton />
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

      <CertificateModal
        isOpen={showModal}
        onClose={handleCloseCertificateModal}
        onGenerate={handleGenerateCertificate}
      />
    </div>
  )
}

export default App
