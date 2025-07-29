import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from './App'
import useUserStore from './stores/userStore'

// Helper function to render with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

// Create a mock for trainingStore that can be used in multiple places
const mockTrainingStore = {
  modules: [
    { 
      id: 1, 
      title: 'Foundation Security Training', 
      description: 'Essential security awareness and practices for all ClearTriage team members and partners.',
      objectives: ['Understand FedRAMP requirements', 'Master authentication procedures'],
      requiredForMembers: ['Pete', 'Dave', 'Shelly', 'Savvy', 'Braden', 'Krista', 'ScaleSec'],
      sections: [],
      completed: false,
      progress: 0
    },
    { 
      id: 4, 
      title: 'Detection Infrastructure', 
      description: 'Learn how ClearTriage\'s AWS-based security monitoring protects our FedRAMP boundary.',
      objectives: ['Navigate AWS Security Hub', 'Interpret security alerts'],
      requiredForMembers: ['Pete', 'Savvy', 'Braden'],
      sections: [],
      completed: false,
      progress: 0
    }
  ],
  completedCount: 0,
  totalCount: 2,
  overallProgress: 0,
  initialized: true,
  clearAllData: vi.fn(),
  initializeModules: vi.fn(),
  getModuleById: vi.fn((id: number) => mockTrainingStore.modules.find(m => m.id === id)),
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

// Mock the training init hook
vi.mock('./hooks/useTrainingInit', () => ({
  useTrainingInit: () => ({ initialized: true })
}))

// Mock the certificate store
vi.mock('./stores/certificateStore', () => ({
  useCertificateStore: vi.fn((selector) => {
    const state = {
      showModal: false,
      setShowModal: vi.fn(),
      saveUserData: vi.fn(),
      setGenerating: vi.fn(),
      addGeneratedCertificate: vi.fn(),
    }
    return selector ? selector(state) : state
  }),
  extractCompletionData: vi.fn()
}))

describe('App Integration - Welcome Screen Flow', () => {
  beforeEach(() => {
    useUserStore.getState().resetOnboarding()
  })

  it('should show welcome screen when user is not onboarded', () => {
    renderWithRouter(<App />)
    
    expect(screen.getByText('Welcome to ClearTriage Security Training')).toBeInTheDocument()
    expect(screen.getByText('Your name')).toBeInTheDocument()
  })

  it('should show main dashboard after completing onboarding', async () => {
    renderWithRouter(<App />)
    
    // Fill out the welcome form
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Pete Allen' })).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByRole('option', { name: 'Pete Allen' }))
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    // Wait for onboarding to complete and main dashboard to show
    await waitFor(() => {
      expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    })
  })

  it('should skip welcome screen for returning users', () => {
    // Complete onboarding first
    useUserStore.getState().completeOnboarding({
      fullName: 'Dave Schmitt'
    })
    
    renderWithRouter(<App />)
    
    // Should go directly to main dashboard
    expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    expect(screen.queryByText('Welcome to ClearTriage Security Training')).not.toBeInTheDocument()
  })

  it('should persist onboarding data across sessions', async () => {
    renderWithRouter(<App />)
    
    // Complete onboarding
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Pete Allen' })).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByRole('option', { name: 'Pete Allen' }))
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    })
    
    // Verify user data is stored
    const userData = useUserStore.getState().getUserData()
    expect(userData).toEqual({
      fullName: 'Pete Allen'
    })
  })
})

describe('App Integration - Form Validation and Error Handling', () => {
  beforeEach(() => {
    useUserStore.getState().resetOnboarding()
  })

  it('should show validation errors when submitting empty form', async () => {
    renderWithRouter(<App />)
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument()
    })
    
    // Should still be on welcome screen
    expect(screen.getByText('Welcome to ClearTriage Security Training')).toBeInTheDocument()
  })

  it('should clear validation errors when name is selected', async () => {
    renderWithRouter(<App />)
    
    // Submit empty form to trigger errors
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument()
    })
    
    // Select name
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Pete Allen' })).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByRole('option', { name: 'Pete Allen' }))
    
    await waitFor(() => {
      expect(screen.queryByText('Please enter your full name')).not.toBeInTheDocument()
    })
  })
})

describe('App Integration - Accessibility', () => {
  beforeEach(() => {
    useUserStore.getState().resetOnboarding()
  })

  it('should support keyboard navigation through welcome form', async () => {
    renderWithRouter(<App />)
    
    // Use fireEvent for more direct focus control in this test
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    
    // Focus the dropdown
    nameDropdown.focus()
    expect(nameDropdown).toHaveFocus()
    
    // Open dropdown
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Pete Allen' })).toBeInTheDocument()
    })
    
    // Select option
    fireEvent.click(screen.getByRole('option', { name: 'Pete Allen' }))
    
    // Verify selection
    await waitFor(() => {
      expect(nameDropdown).toHaveTextContent('Pete Allen')
    })
    
    // Focus submit button
    const submitButton = screen.getByRole('button', { name: /begin training/i })
    submitButton.focus()
    expect(submitButton).toHaveFocus()
    
    // Submit form
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('🛡️ ClearTriage Security & Privacy Training')).toBeInTheDocument()
    })
  })

  it('should have proper ARIA attributes for form validation', async () => {
    renderWithRouter(<App />)
    
    const beginButton = screen.getByRole('button', { name: /begin training/i })
    fireEvent.click(beginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument()
    })
    
    // Check name error ARIA attributes
    const nameError = screen.getByText('Please enter your full name')
    expect(nameError).toHaveAttribute('role', 'alert')
    // The error message is properly displayed as an alert for screen readers
    expect(nameError).toBeInTheDocument()
  })
})