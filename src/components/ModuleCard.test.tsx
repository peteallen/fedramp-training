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
  FaShieldAlt: () => <div data-testid="shield-icon">Shield</div>,
  FaBookOpen: () => <div data-testid="book-icon">Book</div>,
  FaChartBar: () => <div data-testid="chart-icon">Chart</div>,
  FaUsers: () => <div data-testid="users-icon">Users</div>,
  FaCloud: () => <div data-testid="cloud-icon">Cloud</div>,
  FaExclamationTriangle: () => <div data-testid="warning-icon">Warning</div>,
  FaFileAlt: () => <div data-testid="file-icon">File</div>,
  FaEye: () => <div data-testid="eye-icon">Eye</div>,
  FaUserTie: () => <div data-testid="user-tie-icon">UserTie</div>,
}))

describe('ModuleCard', () => {
  const mockModule = {
    id: 1,
    title: 'Test Module',
    description: 'Test description',
    category: 'fundamentals',
    estimatedTime: '30 minutes',
    difficulty: 'beginner',
    objectives: ['Objective 1', 'Objective 2'],
    content: [{ type: 'introduction', title: 'Intro', content: 'Content' }],
    quiz: [{ question: 'Question?', options: ['A', 'B'], correctAnswer: 0 }],
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
    expect(screen.getByText('30 minutes')).toBeInTheDocument()
    expect(screen.getByText('beginner')).toBeInTheDocument()
  })

  it('should render correct icon based on category', () => {
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument()
  })

  it('should render different icons for different categories', () => {
    const securityModule = { ...mockModule, category: 'security' }
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const mockState = {
        modules: [securityModule],
        updateProgress: mockUpdateProgress,
      }
      return selector ? selector(mockState) : mockState
    })
    
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

  it('should render +25% button for modules with partial progress', () => {
    const moduleWithProgress = { ...mockModule, progress: 50 }
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const mockState = {
        modules: [moduleWithProgress],
        updateProgress: mockUpdateProgress,
      }
      return selector ? selector(mockState) : mockState
    })
    
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    expect(screen.getByRole('button', { name: '+25%' })).toBeInTheDocument()
  })

  it('should not render +25% button for modules with 0% progress', () => {
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    expect(screen.queryByRole('button', { name: '+25%' })).not.toBeInTheDocument()
  })

  it('should not render +25% button for completed modules', () => {
    const completedModule = { ...mockModule, completed: true, progress: 100 }
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const mockState = {
        modules: [completedModule],
        updateProgress: mockUpdateProgress,
      }
      return selector ? selector(mockState) : mockState
    })
    
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    expect(screen.queryByRole('button', { name: '+25%' })).not.toBeInTheDocument()
  })

  it('should call updateProgress when +25% button is clicked', async () => {
    const user = userEvent.setup()
    const moduleWithProgress = { ...mockModule, progress: 50 }
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const mockState = {
        modules: [moduleWithProgress],
        updateProgress: mockUpdateProgress,
      }
      return selector ? selector(mockState) : mockState
    })
    
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    
    await user.click(screen.getByRole('button', { name: '+25%' }))
    expect(mockUpdateProgress).toHaveBeenCalledWith(1, 75)
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

  it('should apply correct difficulty colors', () => {
    const beginnerModule = { ...mockModule, difficulty: 'beginner' }
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const mockState = {
        modules: [beginnerModule],
        updateProgress: mockUpdateProgress,
      }
      return selector ? selector(mockState) : mockState
    })
    
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    const difficultyBadge = screen.getByText('beginner')
    expect(difficultyBadge).toHaveClass('text-green-600')
  })

  it('should apply intermediate difficulty colors', () => {
    const intermediateModule = { ...mockModule, difficulty: 'intermediate' }
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const mockState = {
        modules: [intermediateModule],
        updateProgress: mockUpdateProgress,
      }
      return selector ? selector(mockState) : mockState
    })
    
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    const difficultyBadge = screen.getByText('intermediate')
    expect(difficultyBadge).toHaveClass('text-yellow-600')
  })

  it('should apply advanced difficulty colors', () => {
    const advancedModule = { ...mockModule, difficulty: 'advanced' }
    ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const mockState = {
        modules: [advancedModule],
        updateProgress: mockUpdateProgress,
      }
      return selector ? selector(mockState) : mockState
    })
    
    render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
    const difficultyBadge = screen.getByText('advanced')
    expect(difficultyBadge).toHaveClass('text-red-600')
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

  it('should handle different category icons', () => {
    const testCases = [
      { category: 'security', iconTestId: 'book-icon' },
      { category: 'process', iconTestId: 'chart-icon' },
      { category: 'compliance', iconTestId: 'users-icon' },
      { category: 'risk', iconTestId: 'warning-icon' },
      { category: 'cloud', iconTestId: 'cloud-icon' },
    ]

    testCases.forEach(({ category, iconTestId }) => {
      const moduleWithCategory = { ...mockModule, category }
      ;(useTrainingStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
        const mockState = {
          modules: [moduleWithCategory],
          updateProgress: mockUpdateProgress,
        }
        return selector ? selector(mockState) : mockState
      })
      
      const { unmount } = render(<ModuleCard moduleId={1} onStartModule={mockOnStartModule} />)
      expect(screen.getByTestId(iconTestId)).toBeInTheDocument()
      unmount()
    })
  })
})