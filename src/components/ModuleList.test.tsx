import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTrainingStore } from '@/stores/trainingStore'
import useUserStore from '@/stores/userStore'
import { createMockTrainingStore, createMockModule } from '@/test-utils/mockStores'
import { ModuleList } from './ModuleList'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Helper function to render with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

// Mock the training store
vi.mock('@/stores/trainingStore')

// Mock the user store
vi.mock('@/stores/userStore')

// Mock components
vi.mock('@/components/ModuleCard', () => ({
  ModuleCard: ({ moduleId, onStartModule }: any) => (
    <div data-testid={`module-card-${moduleId}`}>
      <button onClick={() => onStartModule(moduleId)}>Start Module {moduleId}</button>
    </div>
  ),
}))

vi.mock('@/components/CertificateButton', () => ({
  CertificateButton: () => <button data-testid="certificate-button">🏆 Generate Certificate</button>,
}))

vi.mock('@/components/ConfirmDialog', () => ({
  ConfirmDialog: ({ isOpen, onConfirm, onCancel }: any) => (
    isOpen ? (
      <div>
        <p>Are you sure you want to reset all training progress?</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null
  ),
}))

describe('ModuleList', () => {
  const mockStoreData = {
    modules: [
      createMockModule({ id: 1, title: 'Module 1', completed: false, progress: 0 }),
      createMockModule({ id: 2, title: 'Module 2', completed: true, progress: 100 }),
      createMockModule({ id: 3, title: 'Module 3', completed: false, progress: 50 }),
    ],
    completedCount: 1,
    totalCount: 3,
    overallProgress: 33,
    clearAllData: vi.fn(),
  }

  const mockUseTrainingStore = vi.mocked(useTrainingStore)
  const mockUseUserStore = vi.mocked(useUserStore)

  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
    mockUseTrainingStore.mockImplementation(createMockTrainingStore(mockStoreData))
    
    // Mock useUserStore to support both direct call and selector pattern
    mockUseUserStore.mockImplementation((selector?: any) => {
      const state = {
        isOnboarded: true,
        completeOnboarding: vi.fn(),
        isContentRelevantForUser: vi.fn(() => true),
      }
      return selector ? selector(state) : state
    })
  })

  it('should render the main heading', () => {
    renderWithRouter(<ModuleList />)
    
    expect(screen.getByRole('heading', { name: /ClearTriage Security & Privacy Training/i })).toBeInTheDocument()
  })

  it('should render module cards for each module', () => {
    renderWithRouter(<ModuleList />)
    
    expect(screen.getByTestId('module-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('module-card-2')).toBeInTheDocument()
    expect(screen.getByTestId('module-card-3')).toBeInTheDocument()
  })

  it('should display progress overview', () => {
    renderWithRouter(<ModuleList />)
    
    expect(screen.getByText('Training Progress')).toBeInTheDocument()
    expect(screen.getByText('Modules Completed')).toBeInTheDocument()
    expect(screen.getByText('Total Modules')).toBeInTheDocument()
    expect(screen.getByText('Overall Progress')).toBeInTheDocument()
  })

  it('should render reset button', () => {
    renderWithRouter(<ModuleList />)
    
    expect(screen.getByRole('button', { name: 'Reset All Progress' })).toBeInTheDocument()
  })

  it('should disable reset button when no progress', () => {
    mockUseTrainingStore.mockImplementation(createMockTrainingStore({
      ...mockStoreData,
      modules: mockStoreData.modules.map(m => ({ ...m, completed: false, progress: 0 })),
      completedCount: 0,
      overallProgress: 0,
    }))
    
    renderWithRouter(<ModuleList />)
    
    const resetButton = screen.getByRole('button', { name: 'Reset All Progress' })
    expect(resetButton).toBeDisabled()
  })

  it('should enable reset button when there is progress', () => {
    renderWithRouter(<ModuleList />)
    
    const resetButton = screen.getByRole('button', { name: 'Reset All Progress' })
    expect(resetButton).toBeEnabled()
  })

  it('should open confirmation dialog when reset button is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ModuleList />)
    
    await user.click(screen.getByRole('button', { name: 'Reset All Progress' }))
    
    expect(screen.getByText(/Are you sure you want to reset all training progress/)).toBeInTheDocument()
  })

  it('should call clearAllData when reset is confirmed', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ModuleList />)
    
    await user.click(screen.getByRole('button', { name: 'Reset All Progress' }))
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    
    expect(mockStoreData.clearAllData).toHaveBeenCalled()
  })

  it('should close dialog when reset is cancelled', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ModuleList />)
    
    await user.click(screen.getByRole('button', { name: 'Reset All Progress' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    
    await waitFor(() => {
      expect(screen.queryByText(/Are you sure you want to reset all training progress/)).not.toBeInTheDocument()
    })
  })

  it('should not call clearAllData when reset is cancelled', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ModuleList />)
    
    await user.click(screen.getByRole('button', { name: 'Reset All Progress' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    
    expect(mockStoreData.clearAllData).not.toHaveBeenCalled()
  })

  it('should filter modules based on user relevance', () => {
    mockUseUserStore.mockImplementation((selector?: any) => {
      const state = {
        isOnboarded: true,
        completeOnboarding: vi.fn(),
        isContentRelevantForUser: vi.fn((members) => members.includes('Pete')),
      }
      return selector ? selector(state) : state
    })

    mockUseTrainingStore.mockImplementation(createMockTrainingStore({
      ...mockStoreData,
      modules: [
        createMockModule({ id: 1, requiredForMembers: ['Pete'], completed: false, progress: 0 }),
        createMockModule({ id: 2, requiredForMembers: ['Dave'], completed: true, progress: 100 }),
        createMockModule({ id: 3, requiredForMembers: ['Pete', 'Dave'], completed: false, progress: 50 }),
      ],
    }))
    
    renderWithRouter(<ModuleList />)
    
    expect(screen.getByTestId('module-card-1')).toBeInTheDocument()
    expect(screen.queryByTestId('module-card-2')).not.toBeInTheDocument()
    expect(screen.getByTestId('module-card-3')).toBeInTheDocument()
  })

  it('should navigate to module when Start Module is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithRouter(<ModuleList />)
    
    const startButton = screen.getByText('Start Module 1')
    await user.click(startButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/modules/1')
  })

  it('should render certificate button', () => {
    renderWithRouter(<ModuleList />)
    
    expect(screen.getByTestId('certificate-button')).toBeInTheDocument()
  })
})