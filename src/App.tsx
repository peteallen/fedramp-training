import { Routes, Route, Navigate } from 'react-router-dom'
import { CertificateModal } from '@/components/CertificateModal'
import { ModuleList } from '@/components/ModuleList'
import { ModuleViewer } from '@/components/ModuleViewer'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { useTrainingInit } from '@/hooks/useTrainingInit'
import { useCertificateStore } from '@/stores/certificateStore'
import useUserStore from '@/stores/userStore'
import type { UserOnboardingData } from '@/types/user'

function App() {
  const showModal = useCertificateStore((state) => state.showModal)
  const setShowModal = useCertificateStore((state) => state.setShowModal)
  const saveUserData = useCertificateStore((state) => state.saveUserData)
  const setGenerating = useCertificateStore((state) => state.setGenerating)
  const addGeneratedCertificate = useCertificateStore((state) => state.addGeneratedCertificate)
  
  const isOnboarded = useUserStore((state) => state.isOnboarded)
  const completeOnboarding = useUserStore((state) => state.completeOnboarding)
  const { initialized } = useTrainingInit()

  const handleCloseCertificateModal = () => {
    setShowModal(false)
  }

  const handleOnboardingComplete = (userData: UserOnboardingData) => {
    completeOnboarding(userData)
  }

  const handleGenerateCertificate = async (userData: { fullName: string }) => {
    try {
      console.log('[Certificate] Starting certificate generation for:', userData)
      setGenerating(true)
      
      // Save user data for future use
      saveUserData(userData)
      
      // Import certificate service and template dynamically to reduce bundle size
      console.log('[Certificate] Loading certificate dependencies...')
      const [{ CertificateService }, { CertificateTemplate }] = await Promise.all([
        import('@/services/certificateService'),
        import('@/components/CertificateTemplate')
      ])
      console.log('[Certificate] Dependencies loaded successfully')
      
      // Extract completion data
      const { extractCompletionData } = await import('@/stores/certificateStore')
      const completionData = extractCompletionData()
      console.log('[Certificate] Completion data:', completionData)
      
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
      tempContainer.style.backgroundColor = '#ffffff'
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
      console.log('[Certificate] Generating PDF with filename:', filename)
      console.log('[Certificate] Template element:', tempContainer.firstElementChild)
      await CertificateService.generatePDF(tempContainer.firstElementChild as HTMLElement, filename)
      console.log('[Certificate] PDF generated successfully')
      
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

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            isOnboarded ? <Navigate to="/modules" replace /> : <WelcomeScreen onComplete={handleOnboardingComplete} />
          } 
        />
        <Route 
          path="/modules" 
          element={
            !isOnboarded ? <Navigate to="/" replace /> : <ModuleList />
          } 
        />
        <Route 
          path="/modules/:moduleId" 
          element={
            !isOnboarded ? <Navigate to="/" replace /> : <ModuleViewer />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CertificateModal
        isOpen={showModal}
        onClose={handleCloseCertificateModal}
        onGenerate={handleGenerateCertificate}
      />
    </>
  )
}

export default App