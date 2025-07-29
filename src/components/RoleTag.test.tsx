import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RoleTag } from './RoleTag'

describe('RoleTag', () => {
  it('renders single development role tag', () => {
    render(<RoleTag roles={['Development']} />)
    
    const tag = screen.getByText('Development')
    expect(tag).toBeInTheDocument()
    expect(tag).toHaveAttribute('aria-label', 'Relevant for Development role')
    expect(tag).toHaveClass('bg-blue-100', 'text-blue-800')
  })

  it('renders single non-development role tag', () => {
    render(<RoleTag roles={['Non-Development']} />)
    
    const tag = screen.getByText('Non-Development')
    expect(tag).toBeInTheDocument()
    expect(tag).toHaveAttribute('aria-label', 'Relevant for Non-Development role')
    expect(tag).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('renders multiple role tags', () => {
    render(<RoleTag roles={['Development', 'Non-Development']} />)
    
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Non-Development')).toBeInTheDocument()
    
    const devTag = screen.getByText('Development')
    const nonDevTag = screen.getByText('Non-Development')
    
    expect(devTag).toHaveClass('bg-blue-100', 'text-blue-800')
    expect(nonDevTag).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('renders with default variant styling', () => {
    render(<RoleTag roles={['Development']} />)
    
    const tag = screen.getByText('Development')
    expect(tag).toHaveClass('px-2.5', 'py-1')
  })

  it('renders with compact variant styling', () => {
    render(<RoleTag roles={['Development']} variant="compact" />)
    
    const tag = screen.getByText('Development')
    expect(tag).toHaveClass('px-2', 'py-0.5', 'text-[10px]')
  })

  it('applies custom className', () => {
    render(<RoleTag roles={['Development']} className="custom-class" />)
    
    const container = screen.getByText('Development').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('renders nothing when roles array is empty', () => {
    const { container } = render(<RoleTag roles={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('handles role combinations correctly', () => {
    render(<RoleTag roles={['Non-Development', 'Development']} />)
    
    // Check that both roles are rendered
    expect(screen.getByText('Non-Development')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
    
    // Verify both role tags have correct styling
    const devTag = screen.getByText('Development')
    const nonDevTag = screen.getByText('Non-Development')
    
    expect(devTag).toHaveClass('bg-blue-100', 'text-blue-800')
    expect(nonDevTag).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('has proper accessibility attributes', () => {
    render(<RoleTag roles={['Development', 'Non-Development']} />)
    
    const devTag = screen.getByLabelText('Relevant for Development role')
    const nonDevTag = screen.getByLabelText('Relevant for Non-Development role')
    
    expect(devTag).toBeInTheDocument()
    expect(nonDevTag).toBeInTheDocument()
  })

  it('maintains consistent styling across different role combinations', () => {
    const { rerender } = render(<RoleTag roles={['Development']} />)
    
    const devTag = screen.getByText('Development')
    expect(devTag).toHaveClass('rounded-full', 'text-xs', 'font-medium')
    
    rerender(<RoleTag roles={['Non-Development']} />)
    
    const nonDevTag = screen.getByText('Non-Development')
    expect(nonDevTag).toHaveClass('rounded-full', 'text-xs', 'font-medium')
  })

  it('supports dark mode classes', () => {
    render(<RoleTag roles={['Development']} />)
    
    const tag = screen.getByText('Development')
    expect(tag).toHaveClass('dark:bg-blue-900/30', 'dark:text-blue-300')
  })
})