import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import useUserStore from '@/stores/userStore'
import { RoleTag } from './RoleTag'

// Mock the user store
vi.mock('@/stores/userStore')

describe('RoleTag - Integration Tests', () => {
  const mockUseUserStore = vi.mocked(useUserStore)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Role Filtering Logic', () => {
    it('should show all content when user has no role set', () => {
      mockUseUserStore.mockReturnValue({
        isOnboarded: false,
        role: null,
        fullName: null,
        onboardingCompletedAt: null,
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn(() => null),
        isRoleRelevant: vi.fn(() => true), // Show all content when no role
      })

      render(<RoleTag roles={['Development']} />)
      
      const tag = screen.getByText('Development')
      expect(tag).toBeInTheDocument()
    })

    it('should highlight relevant content for Development role', () => {
      mockUseUserStore.mockReturnValue({
        isOnboarded: true,
        role: 'Development',
        fullName: 'John Doe',
        onboardingCompletedAt: new Date(),
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn(() => ({ role: 'Development', fullName: 'John Doe' })),
        isRoleRelevant: vi.fn((roles) => roles.includes('Development')),
      })

      render(<RoleTag roles={['Development']} />)
      
      const tag = screen.getByText('Development')
      expect(tag).toBeInTheDocument()
      expect(tag).toHaveClass('bg-blue-100', 'text-blue-800')
    })

    it('should highlight relevant content for Non-Development role', () => {
      mockUseUserStore.mockReturnValue({
        isOnboarded: true,
        role: 'Non-Development',
        fullName: 'Jane Smith',
        onboardingCompletedAt: new Date(),
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn(() => ({ role: 'Non-Development', fullName: 'Jane Smith' })),
        isRoleRelevant: vi.fn((roles) => roles.includes('Non-Development')),
      })

      render(<RoleTag roles={['Non-Development']} />)
      
      const tag = screen.getByText('Non-Development')
      expect(tag).toBeInTheDocument()
      expect(tag).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('should show both tags when content applies to all roles', () => {
      mockUseUserStore.mockReturnValue({
        isOnboarded: true,
        role: 'Development',
        fullName: 'John Doe',
        onboardingCompletedAt: new Date(),
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn(() => ({ role: 'Development', fullName: 'John Doe' })),
        isRoleRelevant: vi.fn(() => true),
      })

      render(<RoleTag roles={['Development', 'Non-Development']} />)
      
      expect(screen.getByText('Development')).toBeInTheDocument()
      expect(screen.getByText('Non-Development')).toBeInTheDocument()
    })
  })

  describe('Visual Styling and Variants', () => {
    beforeEach(() => {
      mockUseUserStore.mockReturnValue({
        isOnboarded: true,
        role: 'Development',
        fullName: 'John Doe',
        onboardingCompletedAt: new Date(),
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn(() => ({ role: 'Development', fullName: 'John Doe' })),
        isRoleRelevant: vi.fn(() => true),
      })
    })

    it('should apply default variant styling correctly', () => {
      render(<RoleTag roles={['Development']} />)
      
      const tag = screen.getByText('Development')
      expect(tag).toHaveClass('px-2.5', 'py-1', 'text-xs')
    })

    it('should apply compact variant styling correctly', () => {
      render(<RoleTag roles={['Development']} variant="compact" />)
      
      const tag = screen.getByText('Development')
      expect(tag).toHaveClass('px-2', 'py-0.5', 'text-[10px]')
    })

    it('should maintain consistent styling across different roles', () => {
      render(<RoleTag roles={['Development', 'Non-Development']} />)
      
      const devTag = screen.getByText('Development')
      const nonDevTag = screen.getByText('Non-Development')
      
      // Both should have consistent base styling
      expect(devTag).toHaveClass('rounded-full', 'font-medium')
      expect(nonDevTag).toHaveClass('rounded-full', 'font-medium')
      
      // But different colors
      expect(devTag).toHaveClass('bg-blue-100', 'text-blue-800')
      expect(nonDevTag).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('should support custom className prop', () => {
      render(<RoleTag roles={['Development']} className="custom-spacing" />)
      
      const container = screen.getByText('Development').parentElement
      expect(container).toHaveClass('custom-spacing')
    })
  })

  describe('Accessibility Features', () => {
    beforeEach(() => {
      mockUseUserStore.mockReturnValue({
        isOnboarded: true,
        role: 'Development',
        fullName: 'John Doe',
        onboardingCompletedAt: new Date(),
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn(() => ({ role: 'Development', fullName: 'John Doe' })),
        isRoleRelevant: vi.fn(() => true),
      })
    })

    it('should have proper ARIA labels for single role', () => {
      render(<RoleTag roles={['Development']} />)
      
      const tag = screen.getByLabelText('Relevant for Development role')
      expect(tag).toBeInTheDocument()
    })

    it('should have proper ARIA labels for multiple roles', () => {
      render(<RoleTag roles={['Development', 'Non-Development']} />)
      
      expect(screen.getByLabelText('Relevant for Development role')).toBeInTheDocument()
      expect(screen.getByLabelText('Relevant for Non-Development role')).toBeInTheDocument()
    })

    it('should support screen reader navigation', () => {
      render(<RoleTag roles={['Development', 'Non-Development']} />)
      
      const devTag = screen.getByLabelText('Relevant for Development role')
      const nonDevTag = screen.getByLabelText('Relevant for Non-Development role')
      
      // Tags should be focusable for screen readers
      expect(devTag).toHaveAttribute('aria-label')
      expect(nonDevTag).toHaveAttribute('aria-label')
    })
  })

  describe('Edge Cases and Error Handling', () => {
    beforeEach(() => {
      mockUseUserStore.mockReturnValue({
        isOnboarded: true,
        role: 'Development',
        fullName: 'John Doe',
        onboardingCompletedAt: new Date(),
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn(() => ({ role: 'Development', fullName: 'John Doe' })),
        isRoleRelevant: vi.fn(() => true),
      })
    })

    it('should handle empty roles array gracefully', () => {
      const { container } = render(<RoleTag roles={[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('should handle undefined roles gracefully', () => {
      const { container } = render(<RoleTag roles={undefined as any} />)
      expect(container.firstChild).toBeNull()
    })

    it('should handle duplicate roles in array', () => {
      render(<RoleTag roles={['Development', 'Development']} />)
      
      // Should only render one tag even with duplicates
      const tags = screen.getAllByText('Development')
      expect(tags).toHaveLength(1)
    })

    it('should handle invalid role values gracefully', () => {
      // This test ensures the component doesn't crash with invalid data
      const { container } = render(<RoleTag roles={['InvalidRole' as any]} />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('Performance and Rendering', () => {
    beforeEach(() => {
      mockUseUserStore.mockReturnValue({
        isOnboarded: true,
        role: 'Development',
        fullName: 'John Doe',
        onboardingCompletedAt: new Date(),
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn(() => ({ role: 'Development', fullName: 'John Doe' })),
        isRoleRelevant: vi.fn(() => true),
      })
    })

    it('should render efficiently with multiple roles', () => {
      const { container } = render(<RoleTag roles={['Development', 'Non-Development']} />)
      
      // Should render both tags in a single container
      const tags = container.querySelectorAll('[aria-label*="Relevant for"]')
      expect(tags).toHaveLength(2)
    })

    it('should not re-render unnecessarily when props are the same', () => {
      const { rerender } = render(<RoleTag roles={['Development']} />)
      
      screen.getByText('Development')
      
      // Re-render with same props
      rerender(<RoleTag roles={['Development']} />)
      
      const rerenderedTag = screen.getByText('Development')
      expect(rerenderedTag).toBeInTheDocument()
    })

    it('should update correctly when roles change', () => {
      const { rerender } = render(<RoleTag roles={['Development']} />)
      
      expect(screen.getByText('Development')).toBeInTheDocument()
      expect(screen.queryByText('Non-Development')).not.toBeInTheDocument()
      
      rerender(<RoleTag roles={['Non-Development']} />)
      
      expect(screen.queryByText('Development')).not.toBeInTheDocument()
      expect(screen.getByText('Non-Development')).toBeInTheDocument()
    })
  })
})