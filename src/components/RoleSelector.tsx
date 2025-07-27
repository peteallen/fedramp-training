import { cn } from '@/lib/utils'
import { ROLE_METADATA, type UserRole } from '@/types/user'

interface RoleSelectorProps {
  selectedRole: UserRole | null
  onRoleChange: (role: UserRole) => void
  error?: string
}

export function RoleSelector({ selectedRole, onRoleChange, error }: RoleSelectorProps) {
  const roles = Object.values(ROLE_METADATA)

  const handleRoleSelect = (role: UserRole) => {
    onRoleChange(role)
  }

  const handleKeyDown = (e: React.KeyboardEvent, role: UserRole) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleRoleSelect(role)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {roles.map((role) => (
          <div
            key={role.value}
            role="button"
            tabIndex={0}
            aria-pressed={selectedRole === role.value}
            aria-describedby={error ? 'role-error' : undefined}
            aria-label={`Select ${role.label} role: ${role.description}`}
            className={cn(
              'relative p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
              'min-h-[44px] touch-manipulation',
              'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800',
              selectedRole === role.value
                ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500',
              error && 'border-red-300 dark:border-red-600'
            )}
            onClick={() => handleRoleSelect(role.value)}
            onKeyDown={(e) => handleKeyDown(e, role.value)}
          >
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="text-xl sm:text-2xl flex-shrink-0 mt-1" aria-hidden="true">
                {role.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {role.label}
                  </h3>
                  {selectedRole === role.value && (
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                  {role.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div 
          id="role-error"
          role="alert"
          className="mt-2 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </div>
      )}
    </div>
  )
}