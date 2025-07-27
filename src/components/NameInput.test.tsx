import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NameInput } from './NameInput'

describe('NameInput', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders input field with label and help text', () => {
    render(
      <NameInput
        value=""
        onChange={mockOnChange}
      />
    )
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByText('This will be used on your completion certificate')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
  })

  it('calls onChange when input value changes', () => {
    render(
      <NameInput
        value=""
        onChange={mockOnChange}
      />
    )
    
    const input = screen.getByLabelText(/full name/i)
    fireEvent.change(input, { target: { value: 'John Doe' } })
    
    expect(mockOnChange).toHaveBeenCalledWith('John Doe')
  })

  it('displays current value in input field', () => {
    render(
      <NameInput
        value="Jane Smith"
        onChange={mockOnChange}
      />
    )
    
    const input = screen.getByLabelText(/full name/i)
    expect(input).toHaveValue('Jane Smith')
  })

  it('displays error message when provided', () => {
    const errorMessage = 'Please enter your full name'
    render(
      <NameInput
        value=""
        onChange={mockOnChange}
        error={errorMessage}
      />
    )
    
    const errorElement = screen.getByRole('alert')
    expect(errorElement).toHaveTextContent(errorMessage)
    expect(errorElement).toHaveAttribute('id', 'name-error')
    
    // Help text should not be visible when error is shown
    expect(screen.queryByText('This will be used on your completion certificate')).not.toBeInTheDocument()
  })

  it('associates error with input via aria-describedby', () => {
    render(
      <NameInput
        value=""
        onChange={mockOnChange}
        error="Please enter your full name"
      />
    )
    
    const input = screen.getByLabelText(/full name/i)
    expect(input).toHaveAttribute('aria-describedby', 'name-error')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('associates help text with input via aria-describedby when no error', () => {
    render(
      <NameInput
        value=""
        onChange={mockOnChange}
      />
    )
    
    const input = screen.getByLabelText(/full name/i)
    expect(input).toHaveAttribute('aria-describedby', 'name-help')
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('shows error icon when error is present', () => {
    render(
      <NameInput
        value=""
        onChange={mockOnChange}
        error="Please enter your full name"
      />
    )
    
    const errorElement = screen.getByRole('alert')
    const errorIcon = errorElement.querySelector('svg')
    expect(errorIcon).toBeInTheDocument()
  })

  it('applies correct CSS classes for error state', () => {
    const { rerender } = render(
      <NameInput
        value=""
        onChange={mockOnChange}
      />
    )
    
    const input = screen.getByLabelText(/full name/i)
    
    // Check normal state classes
    expect(input).toHaveClass('border-gray-300')
    expect(input).not.toHaveClass('border-red-300')
    
    // Rerender with error
    rerender(
      <NameInput
        value=""
        onChange={mockOnChange}
        error="Please enter your full name"
      />
    )
    
    // Check error state classes
    expect(input).toHaveClass('border-red-300')
    expect(input).toHaveClass('focus:ring-red-500')
  })

  it('handles focus and blur events correctly', () => {
    render(
      <NameInput
        value=""
        onChange={mockOnChange}
      />
    )
    
    const input = screen.getByLabelText(/full name/i)
    
    // Focus the input
    fireEvent.focus(input)
    expect(input).toHaveClass('border-blue-300')
    
    // Blur the input
    fireEvent.blur(input)
    expect(input).not.toHaveClass('border-blue-300')
  })

  it('has proper accessibility attributes', () => {
    render(
      <NameInput
        value=""
        onChange={mockOnChange}
      />
    )
    
    const input = screen.getByLabelText(/full name/i)
    expect(input).toHaveAttribute('id', 'fullName')
    expect(input).toHaveAttribute('name', 'fullName')
    expect(input).toHaveAttribute('type', 'text')
    
    const label = screen.getByText(/full name/i)
    expect(label).toHaveAttribute('for', 'fullName')
  })

  it('prevents default behavior on focus indicator', () => {
    render(
      <NameInput
        value=""
        onChange={mockOnChange}
      />
    )
    
    const input = screen.getByLabelText(/full name/i)
    fireEvent.focus(input)
    
    // The focus indicator should be present but not interfere with input
    const focusIndicator = input.parentElement?.querySelector('.absolute')
    expect(focusIndicator).toHaveClass('pointer-events-none')
  })
})