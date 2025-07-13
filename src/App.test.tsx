import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { useTrainingStore } from '@/stores/trainingStore'
import { useTrainingInit } from '@/hooks/useTrainingInit'

// Mock the training store
vi.mock('@/stores/trainingStore', () => ({
  useTrainingStore: vi.fn(),
}))

// Mock the training init hook
vi.mock('@/hooks/useTrainingInit', () => ({
  useTrainingInit: vi.fn(),
}))

// Mock the ModuleCard component
vi.mock('@/components/ModuleCard', () => ({
  ModuleCard: ({ moduleId }: { moduleId: number }) => (
    <div data-testid={`module-card-${moduleId}`}>Module Card {moduleId}</div>
  ),
}))

// Mock the ConfirmDialog component
vi.mock('@/components/ConfirmDialog', () => ({
  ConfirmDialog: ({ isOpen, onConfirm, onCancel }: any) => (
    isOpen ? (
      <div data-testid="confirm-dialog">
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null
  ),
}))

describe('App', () => {
  const mockStoreData = {
    modules: [
      { id: 1, title: 'Module 1', completed: false, progress: 0 },
      { id: 2, title: 'Module 2', completed: true, progress: 100 },
      { id: 3, title: 'Module 3', completed: false, progress: 50 },
    ],
    completedCount: 1,
    totalCount: 3,
    overallProgress: 33,
    clearAllData: vi.fn(),
  }

  const mockUseTrainingStore = vi.mocked(useTrainingStore)
  const mockUseTrainingInit = vi.mocked(useTrainingInit)

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseTrainingStore.mockReturnValue(mockStoreData)
    mockUseTrainingInit.mockReturnValue({ initialized: true })
  })

  it('should render loading state when not initialized', () => {
    mockUseTrainingInit.mockReturnValue({ initialized: false })
    
    render(<App />)
    
    expect(screen.getByText('Loading training modules...')).toBeInTheDocument()
  })

  it('should render the main heading when initialized', () => {
    render(<App />)
    
    expect(screen.getByRole('heading', { name: /ClearTriage Security & Privacy Training/i })).toBeInTheDocument()
  })

  it('should render module cards for each module', () => {
    render(<App />)
    
    expect(screen.getByTestId('module-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('module-card-2')).toBeInTheDocument()
    expect(screen.getByTestId('module-card-3')).toBeInTheDocument()
  })

  it('should display progress overview', () => {
    render(<App />)
    
    expect(screen.getByText('Training Progress')).toBeInTheDocument()
    expect(screen.getByText('Modules Completed')).toBeInTheDocument()
    expect(screen.getByText('Total Modules')).toBeInTheDocument()
    expect(screen.getByText('Overall Progress')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument() // completed count
    expect(screen.getByText('3')).toBeInTheDocument() // total count
    expect(screen.getByText('33%')).toBeInTheDocument() // overall progress
  })

  it('should render reset button', () => {
    render(<App />)
    
    expect(screen.getByRole('button', { name: 'Reset All Progress' })).toBeInTheDocument()
  })

  it('should disable reset button when no progress', () => {
    mockUseTrainingStore.mockReturnValue({
      ...mockStoreData,
      overallProgress: 0,
    })
    
    render(<App />)
    
    expect(screen.getByRole('button', { name: 'Reset All Progress' })).toBeDisabled()
  })

  it('should enable reset button when there is progress', () => {
    render(<App />)
    
    expect(screen.getByRole('button', { name: 'Reset All Progress' })).toBeEnabled()
  })

  it('should open confirmation dialog when reset button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await user.click(screen.getByRole('button', { name: 'Reset All Progress' }))
    
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
  })

  it('should call clearAllData when reset is confirmed', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await user.click(screen.getByRole('button', { name: 'Reset All Progress' }))
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    
    expect(mockStoreData.clearAllData).toHaveBeenCalledTimes(1)
  })

  it('should close dialog when reset is cancelled', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await user.click(screen.getByRole('button', { name: 'Reset All Progress' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    
    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument()
  })

  it('should not call clearAllData when reset is cancelled', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await user.click(screen.getByRole('button', { name: 'Reset All Progress' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    
    expect(mockStoreData.clearAllData).not.toHaveBeenCalled()
  })

  it('should show correct progress bar width', () => {
    render(<App />)
    
    const progressBar = document.querySelector('.bg-blue-600.dark\\:bg-blue-500.h-4.rounded-full')
    
    // The progress bar should have the correct width style
    expect(progressBar).toHaveStyle('width: 33%')
  })

  it('should handle empty module list', () => {
    mockUseTrainingStore.mockReturnValue({
      ...mockStoreData,
      modules: [],
      completedCount: 0,
      totalCount: 0,
      overallProgress: 0,
    })
    
    render(<App />)
    
    // Use getAllByText since we expect multiple '0' elements
    const zeros = screen.getAllByText('0')
    expect(zeros).toHaveLength(2) // One for completed count, one for total count
    expect(screen.getByText('0% Complete')).toBeInTheDocument()
  })

  it('should handle 100% completion', () => {
    mockUseTrainingStore.mockReturnValue({
      ...mockStoreData,
      modules: [
        { id: 1, title: 'Module 1', completed: true, progress: 100 },
        { id: 2, title: 'Module 2', completed: true, progress: 100 },
      ],
      completedCount: 2,
      totalCount: 2,
      overallProgress: 100,
    })
    
    render(<App />)
    
    // Use getAllByText since we expect multiple '2' elements
    const twos = screen.getAllByText('2')
    expect(twos).toHaveLength(2) // One for completed count, one for total count
    expect(screen.getByText('All training completed! 🎉')).toBeInTheDocument()
  })

  it('should render theme toggle', () => {
    render(<App />)
    
    // The ThemeToggle component should be rendered in the header
    expect(document.querySelector('.absolute.top-0.right-0')).toBeInTheDocument()
  })
}) 