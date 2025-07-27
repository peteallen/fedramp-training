import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RoleSelector } from './RoleSelector'

describe('RoleSelector', () => {
  const mockOnRoleChange = vi.fn()

  beforeEach(() => {
    mockOnRoleChange.mockClear()
  })

  it('renders both role options', () => {
    render(
      <RoleSelector
        selectedRole={null}
        onRoleChange={mockOnRoleChange}
      />
    )
    
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Non-Development')).toBeInTheDocument()
    expect(screen.getByText(/Software engineers, developers/)).toBeInTheDocument()
    expect(screen.getByText(/Project managers, business analysts/)).toBeInTheDocument()
  })

  it('calls onRoleChange when role is clicked', () => {
    render(
      <RoleSelector
        selectedRole={null}
        onRoleChange={mockOnRoleChange}
      />
    )
    
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    fireEvent.click(developmentRole!)
    
    expect(mockOnRoleChange).toHaveBeenCalledWith('Development')
  })

  it('calls onRoleChange when role is selected with keyboard', () => {
    render(
      <RoleSelector
        selectedRole={null}
        onRoleChange={mockOnRoleChange}
      />
    )
    
    const nonDevRole = screen.getByText('Non-Development').closest('[role="button"]')
    fireEvent.keyDown(nonDevRole!, { key: 'Enter' })
    
    expect(mockOnRoleChange).toHaveBeenCalledWith('Non-Development')
  })

  it('calls onRoleChange when role is selected with spacebar', () => {
    render(
      <RoleSelector
        selectedRole={null}
        onRoleChange={mockOnRoleChange}
      />
    )
    
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    fireEvent.keyDown(developmentRole!, { key: ' ' })
    
    expect(mockOnRoleChange).toHaveBeenCalledWith('Development')
  })

  it('does not call onRoleChange for other keys', () => {
    render(
      <RoleSelector
        selectedRole={null}
        onRoleChange={mockOnRoleChange}
      />
    )
    
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    fireEvent.keyDown(developmentRole!, { key: 'Tab' })
    
    expect(mockOnRoleChange).not.toHaveBeenCalled()
  })

  it('shows visual selection state for selected role', () => {
    render(
      <RoleSelector
        selectedRole="Development"
        onRoleChange={mockOnRoleChange}
      />
    )
    
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    const nonDevRole = screen.getByText('Non-Development').closest('[role="button"]')
    
    expect(developmentRole).toHaveAttribute('aria-pressed', 'true')
    expect(nonDevRole).toHaveAttribute('aria-pressed', 'false')
    
    // Check for checkmark icon in selected role
    const checkmark = developmentRole!.querySelector('svg')
    expect(checkmark).toBeInTheDocument()
  })

  it('displays error message when provided', () => {
    const errorMessage = 'Please select your role'
    render(
      <RoleSelector
        selectedRole={null}
        onRoleChange={mockOnRoleChange}
        error={errorMessage}
      />
    )
    
    const errorElement = screen.getByRole('alert')
    expect(errorElement).toHaveTextContent(errorMessage)
    expect(errorElement).toHaveAttribute('id', 'role-error')
  })

  it('associates error with role buttons via aria-describedby', () => {
    const errorMessage = 'Please select your role'
    render(
      <RoleSelector
        selectedRole={null}
        onRoleChange={mockOnRoleChange}
        error={errorMessage}
      />
    )
    
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    const nonDevRole = screen.getByText('Non-Development').closest('[role="button"]')
    
    expect(developmentRole).toHaveAttribute('aria-describedby', 'role-error')
    expect(nonDevRole).toHaveAttribute('aria-describedby', 'role-error')
  })

  it('does not have aria-describedby when no error', () => {
    render(
      <RoleSelector
        selectedRole={null}
        onRoleChange={mockOnRoleChange}
      />
    )
    
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    expect(developmentRole).not.toHaveAttribute('aria-describedby')
  })

  it('has proper keyboard navigation attributes', () => {
    render(
      <RoleSelector
        selectedRole={null}
        onRoleChange={mockOnRoleChange}
      />
    )
    
    const roleButtons = screen.getAllByRole('button')
    
    roleButtons.forEach(button => {
      expect(button).toHaveAttribute('tabIndex', '0')
      expect(button).toHaveAttribute('role', 'button')
    })
  })

  it('applies correct CSS classes for selected and unselected states', () => {
    const { rerender } = render(
      <RoleSelector
        selectedRole={null}
        onRoleChange={mockOnRoleChange}
      />
    )
    
    const developmentRole = screen.getByText('Development').closest('[role="button"]')
    
    // Check unselected state classes
    expect(developmentRole).toHaveClass('border-gray-300')
    expect(developmentRole).not.toHaveClass('border-blue-500')
    
    // Rerender with selected state
    rerender(
      <RoleSelector
        selectedRole="Development"
        onRoleChange={mockOnRoleChange}
      />
    )
    
    // Check selected state classes
    expect(developmentRole).toHaveClass('border-blue-500')
    expect(developmentRole).toHaveClass('bg-blue-50')
  })

  it('applies error styling when error is present', () => {
    render(
      <RoleSelector
        selectedRole={null}
        onRoleChange={mockOnRoleChange}
        error="Please select your role"
      />
    )
    
    const roleButtons = screen.getAllByRole('button')
    
    roleButtons.forEach(button => {
      expect(button).toHaveClass('border-red-300')
    })
  })
})