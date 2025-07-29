import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserState, UserOnboardingData, UserRole } from '@/types/user'

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      isOnboarded: false,
      role: null,
      fullName: null,
      onboardingCompletedAt: null,

      // Actions
      completeOnboarding: (userData: UserOnboardingData) => {
        set({
          isOnboarded: true,
          role: null, // Role is no longer used
          fullName: userData.fullName,
          onboardingCompletedAt: new Date(),
        })
      },

      updateRole: (role: UserRole) => {
        set({ role })
      },

      updateName: (name: string) => {
        set({ fullName: name })
      },

      resetOnboarding: () => {
        set({
          isOnboarded: false,
          role: null,
          fullName: null,
          onboardingCompletedAt: null,
        })
      },

      // Getters
      getUserData: (): UserOnboardingData | null => {
        const state = get()
        if (!state.isOnboarded || !state.fullName) {
          return null
        }
        return {
          fullName: state.fullName,
        }
      },

      isRoleRelevant: (_contentRoles: string[]): boolean => {
        // This method is deprecated - use isContentRelevantForUser instead
        return true
      },
      
      isContentRelevantForUser: (requiredForMembers: string[]): boolean => {
        const state = get()
        if (!state.fullName || requiredForMembers.length === 0) {
          return true // Show content if no name specified or no restrictions
        }
        // Extract first name from full name for matching
        const firstName = state.fullName.split(' ')[0]
        return requiredForMembers.some(member => 
          member.toLowerCase() === firstName.toLowerCase()
        )
      },
    }),
    {
      name: 'user-onboarding-storage',
    }
  )
)

export default useUserStore