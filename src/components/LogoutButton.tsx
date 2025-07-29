import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { useCertificateStore } from '@/stores/certificateStore'
import { useTrainingStore } from '@/stores/trainingStore'
import useUserStore from '@/stores/userStore'

export function LogoutButton() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const clearTrainingData = useTrainingStore((state) => state.clearAllData)
  const clearCertificateData = useCertificateStore((state) => state.clearData)
  const clearUserData = useUserStore((state) => state.resetOnboarding)

  const handleLogoutClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmLogout = async () => {
    // Clear all data from all stores
    await clearTrainingData()
    clearCertificateData()
    clearUserData()
    setShowConfirmDialog(false)
    // The app will automatically redirect to welcome screen since isOnboarded will be false
  }

  const handleCancelLogout = () => {
    setShowConfirmDialog(false)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogoutClick}
        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-300 hover:border-red-400 dark:border-red-600 dark:hover:border-red-500"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Logout Confirmation"
        message="Are you sure you want to logout? This will delete all your training progress and certificate data. This action cannot be undone."
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </>
  )
}