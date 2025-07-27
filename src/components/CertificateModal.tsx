import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCertificateStore } from '@/stores/certificateStore'
import useUserStore from '@/stores/userStore'

// Constants
const VALIDATION_RULES = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  NAME_PATTERN: /^[a-zA-Z\s\-'.]+$/
} as const

const VALIDATION_MESSAGES = {
  REQUIRED: 'Full name is required',
  TOO_SHORT: `Full name must be at least ${VALIDATION_RULES.MIN_NAME_LENGTH} characters`,
  TOO_LONG: `Full name must be less than ${VALIDATION_RULES.MAX_NAME_LENGTH} characters`,
  INVALID_FORMAT: 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods'
} as const

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (userData: { fullName: string }) => void
}

interface FormErrors {
  fullName?: string
}

interface UserDataForCertificate {
  effectiveName: string
  hasStoredName: boolean
  shouldShowNameInput: boolean
}

// Custom hook for user data management
const useUserDataForCertificate = (): UserDataForCertificate => {
  const { savedUserData } = useCertificateStore()
  const { getUserData } = useUserStore()
  
  const storedUserData = getUserData()
  const effectiveName = storedUserData?.fullName || savedUserData?.fullName || ''
  const hasStoredName = Boolean(effectiveName)
  
  return {
    effectiveName,
    hasStoredName,
    shouldShowNameInput: !hasStoredName
  }
}

export function CertificateModal({ isOpen, onClose, onGenerate }: CertificateModalProps) {
  const { isGenerating } = useCertificateStore()
  const { effectiveName, hasStoredName, shouldShowNameInput } = useUserDataForCertificate()
  const [fullName, setFullName] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  
  const nameInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Pre-populate with stored user data
  useEffect(() => {
    if (isOpen) {
      setFullName(effectiveName)
    }
  }, [isOpen, effectiveName])

  // Focus management and escape key handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isGenerating) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Focus the name input when modal opens (only if name input is shown)
      if (shouldShowNameInput) {
        setTimeout(() => {
          nameInputRef.current?.focus()
        }, 0)
      }
    }

    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, isGenerating, shouldShowNameInput])

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

  // Validation utility - could be extracted to a separate file if used elsewhere
  const validateFullName = useCallback((name: string): string | null => {
    const trimmedName = name.trim()
    
    if (!trimmedName) return VALIDATION_MESSAGES.REQUIRED
    if (trimmedName.length < VALIDATION_RULES.MIN_NAME_LENGTH) return VALIDATION_MESSAGES.TOO_SHORT
    if (trimmedName.length > VALIDATION_RULES.MAX_NAME_LENGTH) return VALIDATION_MESSAGES.TOO_LONG
    if (!VALIDATION_RULES.NAME_PATTERN.test(trimmedName)) return VALIDATION_MESSAGES.INVALID_FORMAT
    
    return null
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Only validate if name input is shown (no stored name available)
    if (shouldShowNameInput) {
      const nameError = validateFullName(fullName)
      if (nameError) {
        newErrors.fullName = nameError
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFullName(value)
    
    // Clear errors on change for real-time feedback
    if (errors.fullName && value.trim()) {
      setErrors(prev => ({ ...prev, fullName: undefined }))
    }
  }, [errors.fullName])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const userData = { fullName: fullName.trim() }
    onGenerate(userData)
  }, [fullName, shouldShowNameInput, onGenerate])



  // Check if we can proceed (either have stored name or valid manual input)
  const canProceed = useMemo(() => {
    return hasStoredName || (shouldShowNameInput && fullName.trim())
  }, [hasStoredName, shouldShowNameInput, fullName])



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
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transition-all"
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
            <p 
              className="text-gray-600 dark:text-gray-300"
              aria-live="polite"
              aria-atomic="true"
            >
              {hasStoredName 
                ? `Congratulations on completing all training modules! Your certificate will be generated for ${fullName}.`
                : 'Congratulations on completing all training modules! Enter your name to generate your certificate.'
              }
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {shouldShowNameInput && (
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
                )}

                {hasStoredName && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Certificate will be generated for: <strong>{fullName}</strong>
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                          Using your saved profile information
                        </p>
                      </div>
                    </div>
                  </div>
                )}



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
                    disabled={isGenerating || !canProceed}
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
        </div>
      </div>
    </div>
  )
}