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
          role: userData.role,
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
        if (!state.isOnboarded || !state.role || !state.fullName) {
          return null
        }
        return {
          role: state.role,
          fullName: state.fullName,
        }
      },

      isRoleRelevant: (contentRoles: string[]): boolean => {
        const state = get()
        if (!state.role || contentRoles.length === 0) {
          return true // Show content if no role specified or no role restrictions
        }
        return contentRoles.includes(state.role)
      },
    }),
    {
      name: 'user-onboarding-storage',
    }
  )
)

export default useUserStore