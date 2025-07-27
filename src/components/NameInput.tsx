import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface NameInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  onValidationChange?: (isValid: boolean, error?: string) => void
}

// Validation utilities
const validateName = (name: string): { isValid: boolean; error?: string } => {
  const trimmedName = name.trim()
  
  if (!trimmedName) {
    return { isValid: false, error: 'Please enter your full name' }
  }
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters' }
  }
  
  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Full name must be less than 100 characters' }
  }
  
  // Allow letters, spaces, hyphens, apostrophes, and periods
  const nameRegex = /^[a-zA-Z\s\-'.]+$/
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods' }
  }
  
  return { isValid: true }
}

export function NameInput({ value, onChange, error, onValidationChange }: NameInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Perform validation if callback provided
    if (onValidationChange) {
      const validation = validateName(newValue)
      onValidationChange(validation.isValid, validation.error)
    }
  }, [onChange, onValidationChange])

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <div>
      <label 
        htmlFor="fullName"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Full Name <span className="text-red-500" aria-label="required">*</span>
      </label>
      <div className="relative">
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'name-error' : 'name-help'}
          aria-required="true"
          placeholder="Enter your full name"
          autoComplete="name"
          className={cn(
            'w-full px-3 sm:px-4 py-3 rounded-lg border transition-all duration-200',
            'min-h-[44px] text-base',
            'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
            'bg-white dark:bg-gray-700',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'dark:focus:ring-blue-400 dark:focus:border-blue-400',
            error
              ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400'
              : isFocused
              ? 'border-blue-300 dark:border-blue-600'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          )}
        />
        
        {/* Visual indicator for focus state */}
        {isFocused && !error && (
          <div className="absolute inset-0 rounded-lg border-2 border-blue-500 dark:border-blue-400 pointer-events-none opacity-20"></div>
        )}
      </div>
      
      {error ? (
        <div 
          id="name-error"
          role="alert"
          className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      ) : (
        <div 
          id="name-help"
          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          This will be used on your completion certificate
        </div>
      )}
    </div>
  )
}