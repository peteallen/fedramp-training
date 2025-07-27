import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WelcomeScreen } from './WelcomeScreen'
import type { UserOnboardingData } from '@/types/user'

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

  it('displays role selection and name input fields', () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    expect(screen.getByText('What is your primary role at ClearTriage?')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Non-Development')).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
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
    fireEvent.click(developmentRole!)
    
    await waitFor(() => {
      expect(screen.queryByText('Please select your role')).not.toBeInTheDocument()
    })
  })

  it('clears name error when user starts typing', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    // Submit to trigger validation errors
    const submitButton = screen.getByRole('button', { name: 'Begin Training' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument()
    })
    
    // Start typing in name field
    const nameInput = screen.getByLabelText(/full name/i)
    fireEvent.change(nameInput, { target: { value: 'John' } })
    
    await waitFor(() => {
      expect(screen.queryByText('Please enter your full name')).not.toBeInTheDocument()
    })
  })

  it('calls onComplete with correct data when form is valid', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    // Select role
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    fireEvent.click(developmentRole!)
    
    // Enter name
    const nameInput = screen.getByLabelText(/full name/i)
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Begin Training' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith({
        role: 'Development',
        fullName: 'John Doe'
      } as UserOnboardingData)
    })
  })

  it('trims whitespace from name before submitting', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    // Select role
    const nonDevRole = screen.getByText('Non-Development').closest('[role="button"]')
    fireEvent.click(nonDevRole!)
    
    // Enter name with whitespace
    const nameInput = screen.getByLabelText(/full name/i)
    fireEvent.change(nameInput, { target: { value: '  Jane Smith  ' } })
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Begin Training' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith({
        role: 'Non-Development',
        fullName: 'Jane Smith'
      } as UserOnboardingData)
    })
  })

  it('shows loading state during form submission', async () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />)
    
    // Fill out form
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    fireEvent.click(developmentRole!)
    
    const nameInput = screen.getByLabelText(/full name/i)
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
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
    fireEvent.click(developmentRole!)
    
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