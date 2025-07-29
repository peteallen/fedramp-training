// Centralized role type definitions
export const USER_ROLES = {
  DEVELOPMENT: 'Development',
  NON_DEVELOPMENT: 'Non-Development'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Role metadata for UI display
export interface RoleMetadata {
  value: UserRole
  label: string
  description: string
  icon: string
}

export const ROLE_METADATA: Record<UserRole, RoleMetadata> = {
  [USER_ROLES.DEVELOPMENT]: {
    value: USER_ROLES.DEVELOPMENT,
    label: 'Development',
    description: 'Software engineers, developers, DevOps, and technical roles',
    icon: '💻'
  },
  [USER_ROLES.NON_DEVELOPMENT]: {
    value: USER_ROLES.NON_DEVELOPMENT,
    label: 'Non-Development',
    description: 'Project managers, business analysts, sales, and non-technical roles',
    icon: '📋'
  }
}

export interface UserOnboardingData {
  fullName: string
}

export interface UserProfile {
  isOnboarded: boolean
  role: UserRole | null
  fullName: string | null
  onboardingCompletedAt: Date | null
}

export interface UserState extends UserProfile {
  // Actions
  completeOnboarding: (userData: UserOnboardingData) => void
  updateRole: (role: UserRole) => void
  updateName: (name: string) => void
  resetOnboarding: () => void
  
  // Getters
  getUserData: () => UserOnboardingData | null
  isRoleRelevant: (contentRoles: string[]) => boolean
  isContentRelevantForUser: (requiredForMembers: string[]) => boolean
}