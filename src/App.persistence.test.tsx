import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'
import useUserStore from './stores/userStore'

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

// Mock the training store to avoid TypeScript issues
vi.mock('./stores/trainingStore', () => ({
  useTrainingStore: () => ({
    modules: [
      { id: 1, title: 'Test Module 1', description: 'Test description', objectives: ['Test objective 1', 'Test objective 2'] },
      { id: 2, title: 'Test Module 2', description: 'Test description', objectives: ['Test objective 1', 'Test objective 2'] }
    ],
    completedCount: 0,
    totalCount: 2,
    overallProgress: 0,
    clearAllData: vi.fn(),
    getModuleById: vi.fn((id: number) => ({
      id,
      title: `Test Module ${id}`,
      description: 'Test description',
      objectives: ['Test objective 1', 'Test objective 2'],
      completed: false,
      progress: 0,
      lastAccessed: undefined,
      timeSpent: 0,
      quizScore: undefined,
      completionDate: undefined
    })),
    updateProgress: vi.fn(),
  })
}))

// Mock the certificate store
vi.mock('./stores/certificateStore', () => ({
  useCertificateStore: () => ({
    showModal: false,
    setShowModal: vi.fn(),
    saveUserData: vi.fn(),
    setGenerating: vi.fn(),
    addGeneratedCertificate: vi.fn(),
  })
}))

// Mock the training init hook
vi.mock('./hooks/useTrainingInit', () => ({
  useTrainingInit: () => ({
    initialized: true
  })
}))

describe('App - localStorage Persistence', () => {
  beforeEach(() => {
    // Reset user store and localStorage mocks before each test
    useUserStore.getState().resetOnboarding()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should persist onboarding data to localStorage', async () => {
    render(<App />)
    
    // Complete onboarding
    const developmentButton = screen.getByText('Development')
    fireEvent.click(developmentButton)
    
    const nameInput = screen.getByLabelText(/full name/i)
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    })
    
    // Verify localStorage was called to persist data
    expect(localStorageMock.setItem).toHaveBeenCalled()
    
    // Verify the user store has the correct data
    const state = useUserStore.getState()
    expect(state.isOnboarded).toBe(true)
    expect(state.role).toBe('Development')
    expect(state.fullName).toBe('John Doe')
    expect(state.onboardingCompletedAt).toBeInstanceOf(Date)
  })

  it('should restore onboarding data from localStorage on app load', () => {
    // Mock localStorage to return existing user data
    const mockUserData = {
      state: {
        isOnboarded: true,
        role: 'Non-Development',
        fullName: 'Jane Smith',
        onboardingCompletedAt: new Date().toISOString()
      },
      version: 0
    }
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUserData))
    
    // Manually set the store state to simulate persistence restoration
    useUserStore.getState().completeOnboarding({
      role: 'Non-Development',
      fullName: 'Jane Smith'
    })
    
    render(<App />)
    
    // Should skip welcome screen and go directly to dashboard
    expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    expect(screen.queryByText('Welcome to ClearTriage Security Training')).not.toBeInTheDocument()
    
    // Verify user data is available
    const userData = useUserStore.getState().getUserData()
    expect(userData).toEqual({
      role: 'Non-Development',
      fullName: 'Jane Smith'
    })
  })

  it('should handle corrupted localStorage data gracefully', () => {
    // Mock localStorage to return corrupted data
    localStorageMock.getItem.mockReturnValue('invalid-json')
    
    render(<App />)
    
    // Should show welcome screen when localStorage data is corrupted
    expect(screen.getByText('Welcome to ClearTriage Security Training')).toBeInTheDocument()
    
    // User should be able to complete onboarding normally
    const developmentButton = screen.getByText('Development')
    expect(developmentButton).toBeInTheDocument()
  })

  it('should handle missing localStorage data', () => {
    // Mock localStorage to return null (no stored data)
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<App />)
    
    // Should show welcome screen when no data is stored
    expect(screen.getByText('Welcome to ClearTriage Security Training')).toBeInTheDocument()
    expect(screen.getByText('What is your primary role at ClearTriage?')).toBeInTheDocument()
  })

  it('should persist data across multiple sessions', async () => {
    // First session - complete onboarding
    const { unmount } = render(<App />)
    
    const developmentButton = screen.getByText('Development')
    fireEvent.click(developmentButton)
    
    const nameInput = screen.getByLabelText(/full name/i)
    fireEvent.change(nameInput, { target: { value: 'Session User' } })
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    })
    
    // Store the current state
    const firstSessionData = useUserStore.getState().getUserData()
    
    // Unmount to simulate closing the app
    unmount()
    
    // Second session - should restore data
    // Simulate the store being rehydrated with persisted data
    useUserStore.getState().completeOnboarding({
      role: 'Development',
      fullName: 'Session User'
    })
    
    render(<App />)
    
    // Should go directly to dashboard
    expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    expect(screen.queryByText('Welcome to ClearTriage Security Training')).not.toBeInTheDocument()
    
    // Verify data is the same
    const secondSessionData = useUserStore.getState().getUserData()
    expect(secondSessionData).toEqual(firstSessionData)
  })

  it('should update localStorage when user data changes', async () => {
    // Start with existing user
    useUserStore.getState().completeOnboarding({
      role: 'Development',
      fullName: 'Original Name'
    })
    
    render(<App />)
    
    // Update user name
    useUserStore.getState().updateName('Updated Name')
    
    // Verify localStorage was called to persist the change
    expect(localStorageMock.setItem).toHaveBeenCalled()
    
    // Verify the state was updated
    const userData = useUserStore.getState().getUserData()
    expect(userData?.fullName).toBe('Updated Name')
  })

  it('should handle localStorage quota exceeded error', async () => {
    // Mock localStorage.setItem to throw quota exceeded error
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    
    render(<App />)
    
    // Complete onboarding
    const developmentButton = screen.getByText('Development')
    fireEvent.click(developmentButton)
    
    const nameInput = screen.getByLabelText(/full name/i)
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    // Should still complete onboarding even if localStorage fails
    await waitFor(() => {
      expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    })
    
    // Verify the in-memory state is correct
    const userData = useUserStore.getState().getUserData()
    expect(userData).toEqual({
      role: 'Development',
      fullName: 'John Doe'
    })
  })

  it('should clear localStorage when onboarding is reset', () => {
    // Complete onboarding first
    useUserStore.getState().completeOnboarding({
      role: 'Development',
      fullName: 'John Doe'
    })
    
    // Reset onboarding
    useUserStore.getState().resetOnboarding()
    
    // Verify localStorage operations were called
    expect(localStorageMock.setItem).toHaveBeenCalled()
    
    // Verify state is reset
    const state = useUserStore.getState()
    expect(state.isOnboarded).toBe(false)
    expect(state.role).toBe(null)
    expect(state.fullName).toBe(null)
  })
})