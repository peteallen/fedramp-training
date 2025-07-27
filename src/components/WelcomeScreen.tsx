import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { RoleSelector } from '@/components/RoleSelector'
import { NameInput } from '@/components/NameInput'
import type { UserOnboardingData, UserRole } from '@/types/user'

interface WelcomeScreenProps {
  onComplete: (userData: UserOnboardingData) => void
}

interface FormErrors {
  role?: string
  fullName?: string
}

interface FormValidation {
  isRoleValid: boolean
  isNameValid: boolean
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [role, setRole] = useState<UserRole | null>(null)
  const [fullName, setFullName] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [validation, setValidation] = useState<FormValidation>({
    isRoleValid: false,
    isNameValid: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const newValidation: FormValidation = {
      isRoleValid: !!role,
      isNameValid: !!fullName.trim()
    }

    if (!role) {
      newErrors.role = 'Please select your role'
    }

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name'
    }

    setErrors(newErrors)
    setValidation(newValidation)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300))
      
      onComplete({
        role: role!,
        fullName: fullName.trim()
      })
    } catch (error) {
      console.error('Error completing onboarding:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRoleChange = useCallback((selectedRole: UserRole) => {
    setRole(selectedRole)
    setValidation(prev => ({ ...prev, isRoleValid: true }))
    // Clear role error when user makes a selection
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: undefined }))
    }
  }, [errors.role])

  const handleNameChange = useCallback((name: string) => {
    setFullName(name)
    setValidation(prev => ({ ...prev, isNameValid: !!name.trim() }))
    // Clear name error when user starts typing
    if (errors.fullName) {
      setErrors(prev => ({ ...prev, fullName: undefined }))
    }
  }, [errors.fullName])

  const handleNameValidationChange = useCallback((isValid: boolean, error?: string) => {
    setValidation(prev => ({ ...prev, isNameValid: isValid }))
    if (error) {
      setErrors(prev => ({ ...prev, fullName: error }))
    } else if (errors.fullName) {
      setErrors(prev => ({ ...prev, fullName: undefined }))
    }
  }, [errors.fullName])

  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300"
      role="main"
      aria-labelledby="welcome-heading"
    >
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 transition-colors duration-300">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-4xl sm:text-6xl mb-4" role="img" aria-label="Security shield">🛡️</div>
            <h1 
              id="welcome-heading"
              className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 leading-tight"
            >
              Welcome to ClearTriage Security Training
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
              FedRAMP Low Impact SaaS Awareness Training for ClearTriage Team
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 sm:p-4 text-left">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
                About This Training
              </h2>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Purpose:</strong> Meet FedRAMP compliance requirements for our Department of Veterans Affairs (VA) customer engagement
                </p>
                <p>
                  <strong>Scope:</strong> FedRAMP Low Impact SaaS requirements covering security awareness, privacy protection, and compliance controls
                </p>
                <p>
                  <strong>Compliance:</strong> Satisfies FedRAMP AT-1, AT-2, and AT-3 controls for our 6-person team
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" role="form" aria-labelledby="welcome-heading">
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What is your primary role at ClearTriage?
              </legend>
              <RoleSelector
                selectedRole={role}
                onRoleChange={handleRoleChange}
                error={errors.role}
              />
            </fieldset>

            <div>
              <NameInput
                value={fullName}
                onChange={handleNameChange}
                error={errors.fullName}
                onValidationChange={handleNameValidationChange}
              />
            </div>

            <div className="pt-2 sm:pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full min-h-[44px] text-base font-medium"
                aria-describedby={isSubmitting ? "submit-status" : undefined}
              >
                {isSubmitting ? (
                  <>
                    <div 
                      className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                      aria-hidden="true"
                    ></div>
                    <span id="submit-status">Starting Training...</span>
                  </>
                ) : (
                  'Begin Training'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-4 sm:mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            <p role="note">
              Your information will be stored locally and used to personalize your training experience and generate your completion certificate.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}