import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTrainingStore } from '@/stores/trainingStore'
import { ModuleCard } from './ModuleCard'

// Mock the training store
vi.mock('@/stores/trainingStore', () => ({
  useTrainingStore: vi.fn(),
}))

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaBookOpen: () => <div data-testid="book-icon">Book</div>,
  FaUsers: () => <div data-testid="users-icon">Users</div>,
}))

describe('ModuleCard', () => {
  const mockModule = {
    id: 1,
    title: 'Test Module',
    description: 'Test description',
    requiredForMembers: ['Pete', 'Dave'],
    objectives: ['Objective 1', 'Objective 2'],
    sections: [{id: 'a', title: 'Section A', content: []}],
    completed: false,
    progress: 0,
    lastAccessed: undefined,
    timeSpent: 0,
    quizScore: undefined,
  }

  const mockUpdateProgress = vi.fn()
  const mockOnStartModule = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock the store to return the appropriate values based on what selector is passed
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      if (selector) {
        // If a selector is passed, call it with our mock state
        const mockState = {
          modules: [mockModule],
          updateProgress: mockUpdateProgress,
        }
        return selector(mockState)
      }
      // Fallback for any direct store access
      return {
        modules: [mockModule],
        updateProgress: mockUpdateProgress,
      }
    })
  })

  it('should render module information', () => {
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    
    expect(screen.getByText('Test Module')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('1 sections')).toBeInTheDocument()
  })

  it('should render book icon', () => {
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    expect(screen.getByTestId('book-icon')).toBeInTheDocument()
  })


  it('should display progress bar and percentage', () => {
    const moduleWithProgress = { ...mockModule, progress: 50 }
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const mockState = {
        modules: [moduleWithProgress],
        updateProgress: mockUpdateProgress,
      }
      return selector ? selector(mockState) : mockState
    })
    
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should render "Start Module" button for incomplete modules', () => {
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    expect(screen.getByRole('button', { name: 'Start Module' })).toBeInTheDocument()
  })

  it('should render "Review Module" button for completed modules', () => {
    const completedModule = { ...mockModule, completed: true, progress: 100 }
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const mockState = {
        modules: [completedModule],
        updateProgress: mockUpdateProgress,
      }
      return selector ? selector(mockState) : mockState
    })
    
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    expect(screen.getByRole('button', { name: 'Review Module' })).toBeInTheDocument()
  })

  it('should not disable completed button', () => {
    const completedModule = { ...mockModule, completed: true, progress: 100 }
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const mockState = {
        modules: [completedModule],
        updateProgress: mockUpdateProgress,
      }
      return selector ? selector(mockState) : mockState
    })
    
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    expect(screen.getByRole('button', { name: 'Review Module' })).not.toBeDisabled()
  })

  it('should call onStartModule when start button is clicked', async () => {
    const user = userEvent.setup()
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    
    await user.click(screen.getByRole('button', { name: 'Start Module' }))
    expect(mockOnStartModule).toHaveBeenCalledWith(1)
  })





  it('should display last accessed date when available', () => {
    const lastAccessed = new Date('2024-01-15T12:00:00Z')
    const moduleWithAccess = { ...mockModule, lastAccessed }
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const mockState = {
        modules: [moduleWithAccess],
        updateProgress: mockUpdateProgress,
      }
      return selector ? selector(mockState) : mockState
    })
    
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    // Use a more flexible matcher that just checks for the presence of "Last accessed:"
    // The exact date format may vary based on timezone
    expect(screen.getByText(/Last accessed:/)).toBeInTheDocument()
  })

  it('should not display last accessed when not available', () => {
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    expect(screen.queryByText(/Last accessed:/)).not.toBeInTheDocument()
  })




  it('should return null when module is not found', () => {
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const mockState = {
        modules: [], // Empty modules array
        updateProgress: mockUpdateProgress,
      }
      return selector ? selector(mockState) : mockState
    })
    
    const { container } = render(<ModuleCard moduleId={999} onStartModule={mockOnStartModule} />)
    expect(container.firstChild).toBeNull()
  })

})