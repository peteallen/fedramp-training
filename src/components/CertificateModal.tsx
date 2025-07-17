import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useCertificateStore } from '@/stores/certificateStore'
import { extractCompletionData } from '@/stores/certificateStore'
import { CertificatePreview } from './CertificatePreview'
import { cn } from '@/lib/utils'

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (userData: { fullName: string }) => void
}

export function CertificateModal({ isOpen, onClose, onGenerate }: CertificateModalProps) {
  const { savedUserData, isGenerating } = useCertificateStore()
  const [fullName, setFullName] = useState('')
  const [errors, setErrors] = useState<{ fullName?: string }>({})
  const [showPreview, setShowPreview] = useState(false)
  
  const nameInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Pre-populate with saved user data
  useEffect(() => {
    if (isOpen && savedUserData?.fullName) {
      setFullName(savedUserData.fullName)
    }
  }, [isOpen, savedUserData])

  // Focus management and escape key handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isGenerating) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Focus the name input when modal opens
      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 0)
    }

    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, isGenerating])

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen) return

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const modal = modalRef.current
      if (!modal) return

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isOpen])

  const validateForm = (): boolean => {
    const newErrors: { fullName?: string } = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    } else if (fullName.trim().length > 100) {
      newErrors.fullName = 'Full name must be less than 100 characters'
    } else if (!/^[a-zA-Z\s\-'\.]+$/.test(fullName.trim())) {
      newErrors.fullName = 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFullName(value)
    
    // Clear errors on change for real-time feedback
    if (errors.fullName && value.trim()) {
      setErrors(prev => ({ ...prev, fullName: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const userData = { fullName: fullName.trim() }
    onGenerate(userData)
  }

  const handlePreviewToggle = () => {
    if (validateForm()) {
      setShowPreview(!showPreview)
    }
  }

  // Only extract completion data when showing preview
  const completionData = showPreview ? extractCompletionData() : null

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isGenerating ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className={cn(
          "relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full transition-all",
          showPreview ? "max-w-4xl" : "max-w-md"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-modal-title"
      >
        <div className="p-6">
          <div className="mb-6">
            <h2 
              id="certificate-modal-title"
              className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2"
            >
              Generate Certificate
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Congratulations on completing all training modules! Enter your name to generate your certificate.
            </p>
          </div>

          <div className={cn("grid gap-6", showPreview && "grid-cols-1 lg:grid-cols-2")}>
            {/* Form Section */}
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label 
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={handleNameChange}
                    disabled={isGenerating}
                    className={cn(
                      "w-full px-3 py-2 border rounded-md shadow-sm",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      errors.fullName 
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                        : "border-gray-300 dark:border-gray-600"
                    )}
                    placeholder="Enter your full name as it should appear on the certificate"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  />
                  {errors.fullName && (
                    <p 
                      id="fullName-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                      role="alert"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Preview Toggle Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviewToggle}
                  disabled={isGenerating || !fullName.trim()}
                  className="w-full"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={onClose}
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isGenerating || !fullName.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Generating...
                      </>
                    ) : (
                      'Generate Certificate'
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Preview Section */}
            {showPreview && completionData && (
              <div className="border-l border-gray-200 dark:border-gray-600 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Certificate Preview
                </h3>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <CertificatePreview
                    userData={{ fullName: fullName.trim() }}
                    completionData={completionData}
                    certificateId="PREVIEW-ID"
                    issueDate={new Date()}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}