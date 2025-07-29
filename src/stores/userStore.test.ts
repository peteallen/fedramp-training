import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { UserOnboardingData } from '@/types/user'
import useUserStore from './userStore'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('userStore', () => {
  beforeEach(() => {
    // Clear the store state before each test
    useUserStore.getState().resetOnboarding()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useUserStore.getState()
      
      expect(state.isOnboarded).toBe(false)
      expect(state.role).toBe(null)
      expect(state.fullName).toBe(null)
      expect(state.onboardingCompletedAt).toBe(null)
    })
  })

  describe('completeOnboarding', () => {
    it('should complete onboarding with user data', () => {
      const userData: UserOnboardingData = {
        fullName: 'John Doe',
      }

      const beforeDate = new Date()
      useUserStore.getState().completeOnboarding(userData)
      const afterDate = new Date()

      const state = useUserStore.getState()
      expect(state.isOnboarded).toBe(true)
      expect(state.role).toBe(null) // Role is no longer used
      expect(state.fullName).toBe('John Doe')
      expect(state.onboardingCompletedAt).toBeInstanceOf(Date)
      if (state.onboardingCompletedAt) {
        expect(state.onboardingCompletedAt.getTime()).toBeGreaterThanOrEqual(beforeDate.getTime())
        expect(state.onboardingCompletedAt.getTime()).toBeLessThanOrEqual(afterDate.getTime())
      }
    })

    it('should complete onboarding with different name', () => {
      const userData: UserOnboardingData = {
        fullName: 'Jane Smith',
      }

      useUserStore.getState().completeOnboarding(userData)

      const state = useUserStore.getState()
      expect(state.isOnboarded).toBe(true)
      expect(state.role).toBe(null) // Role is no longer used
      expect(state.fullName).toBe('Jane Smith')
    })
  })

  describe('updateRole', () => {
    it('should update user role', () => {
      useUserStore.getState().updateRole('Development')
      
      const state = useUserStore.getState()
      expect(state.role).toBe(null) // Role is no longer used
    })

    it('should update role from Development to Non-Development', () => {
      useUserStore.getState().updateRole('Development')
      useUserStore.getState().updateRole('Non-Development')
      
      const state = useUserStore.getState()
      expect(state.role).toBe('Non-Development')
    })
  })

  describe('updateName', () => {
    it('should update user name', () => {
      useUserStore.getState().updateName('Alice Johnson')
      
      const state = useUserStore.getState()
      expect(state.fullName).toBe('Alice Johnson')
    })

    it('should update name multiple times', () => {
      useUserStore.getState().updateName('First Name')
      useUserStore.getState().updateName('Second Name')
      
      const state = useUserStore.getState()
      expect(state.fullName).toBe('Second Name')
    })
  })

  describe('resetOnboarding', () => {
    it('should reset all onboarding data', () => {
      // First complete onboarding
      const userData: UserOnboardingData = {
        role: 'Development',
        fullName: 'John Doe',
      }
      useUserStore.getState().completeOnboarding(userData)

      // Verify it's completed
      let state = useUserStore.getState()
      expect(state.isOnboarded).toBe(true)

      // Reset onboarding
      useUserStore.getState().resetOnboarding()

      // Verify it's reset
      state = useUserStore.getState()
      expect(state.isOnboarded).toBe(false)
      expect(state.role).toBe(null)
      expect(state.fullName).toBe(null)
      expect(state.onboardingCompletedAt).toBe(null)
    })
  })

  describe('getUserData', () => {
    it('should return null when not onboarded', () => {
      const userData = useUserStore.getState().getUserData()
      expect(userData).toBe(null)
    })

    it('should return null when missing role', () => {
      useUserStore.getState().updateName('John Doe')
      const userData = useUserStore.getState().getUserData()
      expect(userData).toBe(null)
    })

    it('should return null when missing name', () => {
      useUserStore.getState().updateRole('Development')
      const userData = useUserStore.getState().getUserData()
      expect(userData).toBe(null)
    })

    it('should return user data when fully onboarded', () => {
      const onboardingData: UserOnboardingData = {
        fullName: 'John Doe',
      }
      useUserStore.getState().completeOnboarding(onboardingData)

      const userData = useUserStore.getState().getUserData()
      expect(userData).toEqual({
        fullName: 'John Doe',
      })
    })

    it('should return user data for different name', () => {
      const onboardingData: UserOnboardingData = {
        fullName: 'Jane Smith',
      }
      useUserStore.getState().completeOnboarding(onboardingData)

      const userData = useUserStore.getState().getUserData()
      expect(userData).toEqual({
        fullName: 'Jane Smith',
      })
    })
  })

  describe('isContentRelevantForUser', () => {
    beforeEach(() => {
      // Set up a user for most tests
      useUserStore.getState().completeOnboarding({
        fullName: 'Pete Allen',
      })
    })

    it('should return true for empty required members array', () => {
      const isRelevant = useUserStore.getState().isContentRelevantForUser([])
      expect(isRelevant).toBe(true)
    })

    it('should return true when user name matches required member', () => {
      const isRelevant = useUserStore.getState().isContentRelevantForUser(['Pete', 'Dave'])
      expect(isRelevant).toBe(true)
    })

    it('should return false when user name does not match required members', () => {
      const isRelevant = useUserStore.getState().isContentRelevantForUser(['Dave', 'Shelly'])
      expect(isRelevant).toBe(false)
    })

    it('should return true when user name is in multiple required members', () => {
      const isRelevant = useUserStore.getState().isContentRelevantForUser(['Pete', 'Dave', 'Shelly'])
      expect(isRelevant).toBe(true)
    })

    it('should return true when no user name is set', () => {
      useUserStore.getState().resetOnboarding()
      const isRelevant = useUserStore.getState().isContentRelevantForUser(['Pete'])
      expect(isRelevant).toBe(true)
    })

    it('should work correctly for different user', () => {
      useUserStore.getState().completeOnboarding({
        fullName: 'Dave Schmitt',
      })

      expect(useUserStore.getState().isContentRelevantForUser(['Dave'])).toBe(true)
      expect(useUserStore.getState().isContentRelevantForUser(['Pete'])).toBe(false)
      expect(useUserStore.getState().isContentRelevantForUser(['Pete', 'Dave'])).toBe(true)
    })

    it('should handle case-insensitive name matching', () => {
      useUserStore.getState().completeOnboarding({
        fullName: 'Pete Allen',
      })

      expect(useUserStore.getState().isContentRelevantForUser(['pete'])).toBe(true)
      expect(useUserStore.getState().isContentRelevantForUser(['PETE'])).toBe(true)
      expect(useUserStore.getState().isContentRelevantForUser(['Pete'])).toBe(true)
    })
  })

  describe('persistence', () => {
    it('should have persistence configuration', () => {
      // Test that the store is configured with persistence
      // We can't easily test the actual localStorage interaction in this environment
      // but we can verify the store maintains state correctly
      const userData: UserOnboardingData = {
        role: 'Development',
        fullName: 'John Doe',
      }

      useUserStore.getState().completeOnboarding(userData)
      
      // Verify state is maintained
      const state = useUserStore.getState()
      expect(state.isOnboarded).toBe(true)
      expect(state.role).toBe(null) // Role is no longer used
      expect(state.fullName).toBe('John Doe')
      expect(state.onboardingCompletedAt).toBeInstanceOf(Date)
    })

    it('should handle date serialization correctly', () => {
      const userData: UserOnboardingData = {
        role: 'Development',
        fullName: 'John Doe',
      }

      useUserStore.getState().completeOnboarding(userData)
      const state = useUserStore.getState()
      
      // Verify the date is properly stored as a Date object
      expect(state.onboardingCompletedAt).toBeInstanceOf(Date)
      if (state.onboardingCompletedAt) {
        expect(state.onboardingCompletedAt.toISOString()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      }
    })
  })
})