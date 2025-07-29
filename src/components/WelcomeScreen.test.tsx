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

  it('displays name dropdown field', () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    expect(screen.getByText('Your name')).toBeInTheDocument()
    expect(screen.getByText('Select your name')).toBeInTheDocument()
  })

  it('shows validation error when submitting without name', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    const submitButton = screen.getByRole('button', { name: 'Begin Training' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument()
    })
    
    expect(mockOnComplete).not.toHaveBeenCalled()
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
        fullName: 'Pete Allen'
      } as UserOnboardingData)
    })
  })

  it('submits form correctly with different name', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
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
        fullName: 'Dave Schmitt'
      } as UserOnboardingData)
    })
  })

  it('shows loading state during form submission', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    // Fill out form
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
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    fireEvent.click(nameDropdown)
    
    await waitFor(() => {
      expect(screen.getByText('Pete Allen')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Pete Allen'))
    
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
    
    // Check that form element exists
    const form = document.querySelector('form')
    expect(form).toBeInTheDocument()
    
    // Check dropdown has proper accessibility
    const nameDropdown = screen.getByRole('button', { name: /select your name/i })
    expect(nameDropdown).toBeInTheDocument()
  })
})