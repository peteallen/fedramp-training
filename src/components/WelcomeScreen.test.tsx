import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { UserOnboardingData } from '@/types/user'
import { WelcomeScreen } from './WelcomeScreen'

describe('WelcomeScreen', () => {
  const mockOnComplete = vi.fn()

  beforeEach(() => {
    mockOnComplete.mockClear()
  })

  it('renders welcome screen with introduction content', () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    expect(screen.getByText('Welcome to ClearTriage Security Training')).toBeInTheDocument()
    expect(screen.getByText(/FedRAMP Low Impact SaaS Awareness Training/)).toBeInTheDocument()
    expect(screen.getByText('About This Training')).toBeInTheDocument()
    expect(screen.getByText(/Department of Veterans Affairs/)).toBeInTheDocument()
  })

  it('displays role selection and name dropdown fields', () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    expect(screen.getByText('What is your primary role at ClearTriage?')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Non-Development')).toBeInTheDocument()
    expect(screen.getByText('Your name')).toBeInTheDocument()
    expect(screen.getByText('Select your name')).toBeInTheDocument()
  })

  it('shows validation errors when submitting without required fields', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    const submitButton = screen.getByRole('button', { name: 'Begin Training' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please select your role')).toBeInTheDocument()
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument()
    })
    
    expect(mockOnComplete).not.toHaveBeenCalled()
  })

  it('clears role error when role is selected', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    // Submit to trigger validation errors
    const submitButton = screen.getByRole('button', { name: 'Begin Training' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please select your role')).toBeInTheDocument()
    })
    
    // Select a role
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    if (developmentRole) {
      fireEvent.click(developmentRole)
    }
    
    await waitFor(() => {
      expect(screen.queryByText('Please select your role')).not.toBeInTheDocument()
    })
  })

  it('clears name error when user selects a name', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    // Submit to trigger validation errors
    const submitButton = screen.getByRole('button', { name: 'Begin Training' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument()
    })
    
    // Open dropdown and select a name
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

  it('calls onComplete with correct data when form is valid', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    // Select role
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    if (developmentRole) {
      fireEvent.click(developmentRole)
    }
    
    // Select name from dropdown
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByText('Pete Allen')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Pete Allen'))
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Begin Training' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith({
        role: 'Development',
        fullName: 'Pete Allen'
      } as UserOnboardingData)
    })
  })

  it('submits form correctly with non-development role', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    // Select role
    const nonDevRole = screen.getByText('Non-Development').closest('[role="button"]')
    if (nonDevRole) {
      fireEvent.click(nonDevRole)
    }
    
    // Select name from dropdown
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByText('Dave Schmitt')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Dave Schmitt'))
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Begin Training' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith({
        role: 'Non-Development',
        fullName: 'Dave Schmitt'
      } as UserOnboardingData)
    })
  })

  it('shows loading state during form submission', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    // Fill out form
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    if (developmentRole) {
      fireEvent.click(developmentRole)
    }
    
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByText('Pete Allen')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Pete Allen'))
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Begin Training' })
    fireEvent.click(submitButton)
    
    // Check loading state
    expect(screen.getByText('Starting Training...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled()
    })
  })

  it('prevents form submission when already submitting', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    // Fill out form
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    if (developmentRole) {
      fireEvent.click(developmentRole)
    }
    
    const nameInput = screen.getByLabelText(/full name/i)
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
    // Submit form multiple times quickly
    const submitButton = screen.getByRole('button', { name: 'Begin Training' })
    fireEvent.click(submitButton)
    fireEvent.click(submitButton)
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1)
    })
  })

  it('has proper accessibility attributes', () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    const nameInput = screen.getByLabelText(/full name/i)
    expect(nameInput).toHaveAttribute('aria-describedby', 'name-help')
    
    // Check that form element exists (even without explicit role)
    const form = document.querySelector('form')
    expect(form).toBeInTheDocument()
  })
})