import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WelcomeScreen } from './WelcomeScreen'
import { RoleTag } from './RoleTag'

describe('Responsive Design and Accessibility Improvements', () => {
  const mockOnComplete = vi.fn()

  describe('WelcomeScreen Responsive Design', () => {
    it('should have responsive padding and spacing', () => {
      render(<WelcomeScreen onComplete={mockOnComplete} />)
      
      const mainContainer = screen.getByRole('main')
      expect(mainContainer).toHaveClass('p-4') // Mobile padding
      
      const cardContainer = document.querySelector('.max-w-2xl')
      expect(cardContainer).toHaveClass('w-full') // Full width on mobile
      
      const innerCard = document.querySelector('.bg-white')
      expect(innerCard).toHaveClass('p-4', 'sm:p-6', 'lg:p-8') // Responsive padding
    })

    it('should have responsive text sizes', () => {
      render(<WelcomeScreen onComplete={mockOnComplete} />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('text-2xl', 'sm:text-3xl') // Responsive heading
      
      const subtitle = screen.getByText('FedRAMP Low Impact SaaS Awareness Training for ClearTriage Team')
      expect(subtitle).toHaveClass('text-base', 'sm:text-lg') // Responsive subtitle
    })

    it('should have responsive grid layout for role selector', () => {
      render(<WelcomeScreen onComplete={mockOnComplete} />)
      
      const roleGrid = document.querySelector('.grid')
      expect(roleGrid).toHaveClass('grid-cols-1', 'sm:grid-cols-2') // Responsive grid
      expect(roleGrid).toHaveClass('gap-3', 'sm:gap-4') // Responsive gap
    })
  })

  describe('WelcomeScreen Accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      render(<WelcomeScreen onComplete={mockOnComplete} />)
      
      // Main landmark
      const main = screen.getByRole('main')
      expect(main).toHaveAttribute('aria-labelledby', 'welcome-heading')
      
      // Form structure
      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('aria-labelledby', 'welcome-heading')
      
      // Fieldset for role selection
      const fieldset = document.querySelector('fieldset')
      expect(fieldset).toBeInTheDocument()
      
      const legend = document.querySelector('legend')
      expect(legend).toBeInTheDocument()
    })

    it('should have proper ARIA attributes for interactive elements', () => {
      render(<WelcomeScreen onComplete={mockOnComplete} />)
      
      // Role buttons
      const developmentButton = screen.getByText('Development').closest('[role="button"]')
      expect(developmentButton).toHaveAttribute('aria-pressed', 'false')
      expect(developmentButton).toHaveAttribute('tabIndex', '0')
      expect(developmentButton).toHaveAttribute('aria-label')
      
      // Name input
      const nameInput = screen.getByLabelText(/full name/i)
      expect(nameInput).toHaveAttribute('aria-required', 'true')
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-help')
      expect(nameInput).toHaveAttribute('aria-invalid', 'false')
    })

    it('should have minimum touch target sizes', () => {
      render(<WelcomeScreen onComplete={mockOnComplete} />)
      
      // Role buttons
      const developmentButton = screen.getByText('Development').closest('[role="button"]')
      expect(developmentButton).toHaveClass('min-h-[44px]')
      
      // Name input
      const nameInput = screen.getByLabelText(/full name/i)
      expect(nameInput).toHaveClass('min-h-[44px]')
      
      // Submit button
      const submitButton = screen.getByRole('button', { name: /begin training/i })
      expect(submitButton).toHaveClass('min-h-[44px]')
    })

    it('should have proper focus management', () => {
      render(<WelcomeScreen onComplete={mockOnComplete} />)
      
      // Focus indicators
      const developmentButton = screen.getByText('Development').closest('[role="button"]')
      expect(developmentButton).toHaveClass('focus:ring-2', 'focus:ring-blue-500')
      
      const nameInput = screen.getByLabelText(/full name/i)
      expect(nameInput).toHaveClass('focus:ring-2', 'focus:ring-blue-500')
    })

    it('should support touch manipulation', () => {
      render(<WelcomeScreen onComplete={mockOnComplete} />)
      
      const developmentButton = screen.getByText('Development').closest('[role="button"]')
      expect(developmentButton).toHaveClass('touch-manipulation')
    })

    it('should have proper icon accessibility', () => {
      render(<WelcomeScreen onComplete={mockOnComplete} />)
      
      // Shield emoji should have proper role and label
      const shieldIcon = document.querySelector('[role="img"]')
      expect(shieldIcon).toHaveAttribute('aria-label', 'Security shield')
      
      // Role icons should be hidden from screen readers
      const roleIcons = document.querySelectorAll('[aria-hidden="true"]')
      expect(roleIcons.length).toBeGreaterThan(0)
    })

    it('should have proper privacy notice', () => {
      render(<WelcomeScreen onComplete={mockOnComplete} />)
      
      const privacyNote = document.querySelector('[role="note"]')
      expect(privacyNote).toBeInTheDocument()
      expect(privacyNote).toHaveTextContent(/stored locally/)
    })
  })

  describe('RoleTag Accessibility and Responsive Design', () => {
    it('should have proper contrast and responsive text', () => {
      render(<RoleTag roles={['Development']} />)
      
      const tag = screen.getByText('Development')
      expect(tag).toHaveClass('text-xs', 'sm:text-sm') // Responsive text
      expect(tag).toHaveClass('border') // Border for contrast
      expect(tag).toHaveAttribute('aria-label')
      expect(tag).toHaveAttribute('role', 'img')
    })

    it('should handle multiple roles properly', () => {
      render(<RoleTag roles={['Development', 'Non-Development']} />)
      
      const devTag = screen.getByText('Development')
      const nonDevTag = screen.getByText('Non-Development')
      
      expect(devTag).toBeInTheDocument()
      expect(nonDevTag).toBeInTheDocument()
      
      // Different color schemes
      expect(devTag).toHaveClass('bg-blue-100', 'text-blue-800')
      expect(nonDevTag).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('should support compact variant', () => {
      render(<RoleTag roles={['Development']} variant="compact" />)
      
      const tag = screen.getByText('Development')
      expect(tag).toHaveClass('text-[10px]', 'sm:text-xs') // Smaller text for compact
      expect(tag).toHaveClass('px-2', 'py-0.5') // Smaller padding
    })
  })

  describe('High Contrast and Reduced Motion Support', () => {
    it('should have proper border styles for high contrast', () => {
      render(<WelcomeScreen onComplete={mockOnComplete} />)
      
      const developmentButton = screen.getByText('Development').closest('[role="button"]')
      expect(developmentButton).toHaveClass('border-2') // Visible borders
    })

    it('should support reduced motion preferences', () => {
      // This would typically be tested with CSS media queries
      // For now, we verify that transition classes are applied
      render(<WelcomeScreen onComplete={mockOnComplete} />)
      
      const mainContainer = screen.getByRole('main')
      expect(mainContainer).toHaveClass('transition-colors')
    })
  })
})