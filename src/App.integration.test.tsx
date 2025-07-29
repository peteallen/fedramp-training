import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from './App'
import useUserStore from './stores/userStore'

// Create a mock for trainingStore that can be used in multiple places
const mockTrainingStore = {
  modules: [
    { id: 1, title: 'Test Module 1', description: 'Test description', objectives: ['Test objective 1', 'Test objective 2'] },
    { id: 2, title: 'Test Module 2', description: 'Test description', objectives: ['Test objective 1', 'Test objective 2'] }
  ],
  completedCount: 0,
  totalCount: 2,
  overallProgress: 0,
  initialized: true,
  clearAllData: vi.fn(),
  initializeModules: vi.fn(),
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
  completeModule: vi.fn(),
  updateModuleAccess: vi.fn(),
  updateTimeSpent: vi.fn(),
  updateQuizScore: vi.fn(),
  resetProgress: vi.fn(),
  resetModule: vi.fn(),
}

// Mock the training store to avoid TypeScript issues
vi.mock('./stores/trainingStore', () => ({
  useTrainingStore: vi.fn((selector) => {
    if (typeof selector === 'function') {
      return selector(mockTrainingStore)
    }
    return mockTrainingStore
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

describe('App Integration - Welcome Screen Flow', () => {
  beforeEach(() => {
    // Reset user store before each test
    useUserStore.getState().resetOnboarding()
  })

  it('should show welcome screen when user is not onboarded', () => {
    render(<App />)
    
    expect(screen.getByText('Welcome to ClearTriage Security Training')).toBeInTheDocument()
    expect(screen.getByText('What is your primary role at ClearTriage?')).toBeInTheDocument()
  })

  it('should show main dashboard after completing onboarding', async () => {
    render(<App />)
    
    // Fill out the welcome form
    const developmentButton = screen.getByText('Development')
    fireEvent.click(developmentButton)
    
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByText('Pete Allen')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Pete Allen'))
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    // Wait for onboarding to complete and main dashboard to show
    await waitFor(() => {
      expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    })
    
    // Verify the "About this Training" section is NOT present
    expect(screen.queryByText('💡 About This Training')).not.toBeInTheDocument()
  })

  it('should skip welcome screen for returning users', () => {
    // Complete onboarding first
    useUserStore.getState().completeOnboarding({
      role: 'Development',
      fullName: 'Jane Doe'
    })
    
    render(<App />)
    
    // Should go directly to main dashboard
    expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    expect(screen.queryByText('Welcome to ClearTriage Security Training')).not.toBeInTheDocument()
  })

  it('should persist onboarding data across sessions', async () => {
    render(<App />)
    
    // Complete onboarding
    const developmentButton = screen.getByText('Development')
    fireEvent.click(developmentButton)
    
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByText('Pete Allen')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Pete Allen'))
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    })
    
    // Verify user data is stored
    const userData = useUserStore.getState().getUserData()
    expect(userData).toEqual({
      role: 'Development',
      fullName: 'Test User'
    })
  })
})

describe('App Integration - Form Validation and Error Handling', () => {
  beforeEach(() => {
    useUserStore.getState().resetOnboarding()
  })

  it('should show validation errors when submitting empty form', async () => {
    render(<App />)
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please select your role')).toBeInTheDocument()
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument()
    })
    
    // Should still be on welcome screen
    expect(screen.getByText('Welcome to ClearTriage Security Training')).toBeInTheDocument()
  })

  it('should show role validation error when only name is provided', async () => {
    render(<App />)
    
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByText('Pete Allen')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Pete Allen'))
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please select your role')).toBeInTheDocument()
    })
    
    expect(screen.queryByText('Please enter your full name')).not.toBeInTheDocument()
  })

  it('should show name validation error when only role is selected', async () => {
    render(<App />)
    
    const developmentButton = screen.getByText('Development')
    fireEvent.click(developmentButton)
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument()
    })
    
    expect(screen.queryByText('Please select your role')).not.toBeInTheDocument()
  })

  it('should clear validation errors when fields are corrected', async () => {
    render(<App />)
    
    // Submit empty form to trigger errors
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please select your role')).toBeInTheDocument()
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument()
    })
    
    // Fix role error
    const developmentButton = screen.getByText('Development')
    fireEvent.click(developmentButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Please select your role')).not.toBeInTheDocument()
    })
    
    // Fix name error
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByText('Pete Allen')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Pete Allen'))
    
    await waitFor(() => {
      expect(screen.queryByText('Please enter your full name')).not.toBeInTheDocument()
    })
  })

  it('should handle form submission with Non-Development role', async () => {
    render(<App />)
    
    const nonDevButton = screen.getByText('Non-Development')
    fireEvent.click(nonDevButton)
    
    const nameInput = screen.getByLabelText(/full name/i)
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } })
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    })
    
    // Verify user data is stored correctly
    const userData = useUserStore.getState().getUserData()
    expect(userData).toEqual({
      role: 'Non-Development',
      fullName: 'Jane Smith'
    })
  })

  it('should trim whitespace from name input', async () => {
    render(<App />)
    
    const developmentButton = screen.getByText('Development')
    fireEvent.click(developmentButton)
    
    const nameInput = screen.getByLabelText(/full name/i)
    fireEvent.change(nameInput, { target: { value: '  John Doe  ' } })
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    })
    
    // Verify trimmed name is stored
    const userData = useUserStore.getState().getUserData()
    expect(userData?.fullName).toBe('John Doe')
  })
})

describe('App Integration - Accessibility and Keyboard Navigation', () => {
  beforeEach(() => {
    useUserStore.getState().resetOnboarding()
  })

  it('should support keyboard navigation through welcome form', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Tab to first role button
    await user.tab()
    expect(screen.getByText('Development').closest('[role="button"]')).toHaveFocus()
    
    // Select role with Enter key
    await user.keyboard('{Enter}')
    
    // Tab to Non-Development role
    await user.tab()
    expect(screen.getByText('Non-Development').closest('[role="button"]')).toHaveFocus()
    
    // Tab to name input
    await user.tab()
    expect(screen.getByRole('button', { name: /select your name/i })).toBeInTheDocument()
    
    // Select name from dropdown
    await user.click(screen.getByRole('button', { name: /select your name/i }))
    await user.click(screen.getByText('Pete Allen'))
    
    // Tab to submit button
    await user.tab()
    expect(screen.getByRole('button', { name: /begin training/i })).toHaveFocus()
    
    // Submit with Enter
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    })
  })

  it('should support role selection with spacebar', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Focus on Non-Development role
    const nonDevButton = screen.getByText('Non-Development').closest('[role="button"]')
    ;(nonDevButton as HTMLElement)?.focus()
    
    // Select with spacebar
    await user.keyboard(' ')
    
    // Verify selection
    expect(nonDevButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('should have proper ARIA attributes for form validation', async () => {
    render(<App />)
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please select your role')).toBeInTheDocument()
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument()
    })
    
    // Check role error ARIA attributes
    const roleError = screen.getByText('Please select your role')
    expect(roleError).toHaveAttribute('role', 'alert')
    expect(roleError).toHaveAttribute('id', 'role-error')
    
    // Check name error ARIA attributes
    const nameError = screen.getByText('Please enter your full name')
    expect(nameError).toHaveAttribute('role', 'alert')
    expect(nameError).toHaveAttribute('id', 'name-error')
    
    // Check that form fields are associated with errors
    const nameInput = screen.getByLabelText(/full name/i)
    expect(nameInput).toHaveAttribute('aria-describedby', 'name-error')
    expect(nameInput).toHaveAttribute('aria-invalid', 'true')
  })

  it('should announce form submission loading state', async () => {
    render(<App />)
    
    const developmentButton = screen.getByText('Development')
    fireEvent.click(developmentButton)
    
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByText('Pete Allen')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Pete Allen'))
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    // Check loading state
    expect(screen.getByText('Starting Training...')).toBeInTheDocument()
    expect(beginButton).toBeDisabled()
  })
})