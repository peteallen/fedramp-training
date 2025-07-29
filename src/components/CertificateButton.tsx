import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCertificateStore } from '@/stores/certificateStore'
import { useTrainingStore } from '@/stores/trainingStore'

interface CertificateButtonProps {
  className?: string
  onGenerateCertificate?: () => void
  overallProgress?: number
}

export function CertificateButton({ className, onGenerateCertificate, overallProgress: overallProgressProp }: CertificateButtonProps) {
  const storeProgress = useTrainingStore((state) => state.overallProgress)
  const { isGenerating, setShowModal } = useCertificateStore()
  
  // Use prop if provided, otherwise fall back to store value
  const overallProgress = overallProgressProp ?? storeProgress
  
  // Only show button when all training is completed
  const isTrainingComplete = overallProgress >= 100
  
  const handleClick = () => {
    if (onGenerateCertificate) {
      onGenerateCertificate()
    } else {
      // Default behavior: open certificate modal
      setShowModal(true)
    }
  }

  // Don't render if training is not complete
  if (!isTrainingComplete) {
    return null
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isGenerating}
      className={cn(
        "bg-green-600 hover:bg-green-700 text-white shadow-lg",
        "dark:bg-green-500 dark:hover:bg-green-600",
        "transition-all duration-200",
        "focus-visible:ring-green-500/20 dark:focus-visible:ring-green-400/40",
        isGenerating && "opacity-75 cursor-not-allowed",
        className
      )}
      size="lg"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Generating Certificate...
        </>
      ) : (
        <>
          🏆 Generate Certificate
        </>
      )}
    </Button>
  )
}