import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCertificateStore } from '@/stores/certificateStore'
import { useTrainingStore } from '@/stores/trainingStore'
import { CertificateButton } from './CertificateButton'

// Mock the stores
vi.mock('@/stores/trainingStore')
vi.mock('@/stores/certificateStore')

const mockUseTrainingStore = vi.mocked(useTrainingStore)
const mockUseCertificateStore = vi.mocked(useCertificateStore)

describe('CertificateButton', () => {
  const mockSetShowModal = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    mockUseCertificateStore.mockReturnValue({
      isGenerating: false,
      setShowModal: mockSetShowModal,
      savedUserData: null,
      generatedCertificates: [],
      showModal: false,
      saveUserData: vi.fn(),
      addGeneratedCertificate: vi.fn(),
      setGenerating: vi.fn(),
      clearData: vi.fn(),
    })
  })

  it('should not render when training is not complete', () => {
    mockUseTrainingStore.mockReturnValue({
      overallProgress: 75,
      modules: [],
      completedCount: 2,
      totalCount: 3,
      initialized: true,
      initializeModules: vi.fn(),
      completeModule: vi.fn(),
      updateProgress: vi.fn(),
      updateModuleAccess: vi.fn(),
      updateTimeSpent: vi.fn(),
      updateQuizScore: vi.fn(),
      resetProgress: vi.fn(),
      resetModule: vi.fn(),
      getModuleById: vi.fn(),
      getModulesByCategory: vi.fn(),
      getModulesByDifficulty: vi.fn(),
      clearAllData: vi.fn(),
    })

    render(<CertificateButton />)
    
    expect(screen.queryByText('Generate Certificate')).not.toBeInTheDocument()
  })

  it('should render when training is complete', () => {
    mockUseTrainingStore.mockReturnValue({
      overallProgress: 100,
      modules: [],
      completedCount: 3,
      totalCount: 3,
      initialized: true,
      initializeModules: vi.fn(),
      completeModule: vi.fn(),
      updateProgress: vi.fn(),
      updateModuleAccess: vi.fn(),
      updateTimeSpent: vi.fn(),
      updateQuizScore: vi.fn(),
      resetProgress: vi.fn(),
      resetModule: vi.fn(),
      getModuleById: vi.fn(),
      getModulesByCategory: vi.fn(),
      getModulesByDifficulty: vi.fn(),
      clearAllData: vi.fn(),
    })

    render(<CertificateButton />)
    
    expect(screen.getByText('🏆 Generate Certificate')).toBeInTheDocument()
  })

  it('should show loading state when generating', () => {
    mockUseTrainingStore.mockReturnValue({
      overallProgress: 100,
      modules: [],
      completedCount: 3,
      totalCount: 3,
      initialized: true,
      initializeModules: vi.fn(),
      completeModule: vi.fn(),
      updateProgress: vi.fn(),
      updateModuleAccess: vi.fn(),
      updateTimeSpent: vi.fn(),
      updateQuizScore: vi.fn(),
      resetProgress: vi.fn(),
      resetModule: vi.fn(),
      getModuleById: vi.fn(),
      getModulesByCategory: vi.fn(),
      getModulesByDifficulty: vi.fn(),
      clearAllData: vi.fn(),
    })

    mockUseCertificateStore.mockReturnValue({
      isGenerating: true,
      setShowModal: mockSetShowModal,
      savedUserData: null,
      generatedCertificates: [],
      showModal: false,
      saveUserData: vi.fn(),
      addGeneratedCertificate: vi.fn(),
      setGenerating: vi.fn(),
      clearData: vi.fn(),
    })

    render(<CertificateButton />)
    
    expect(screen.getByText('Generating Certificate...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should call setShowModal when clicked', () => {
    mockUseTrainingStore.mockReturnValue({
      overallProgress: 100,
      modules: [],
      completedCount: 3,
      totalCount: 3,
      initialized: true,
      initializeModules: vi.fn(),
      completeModule: vi.fn(),
      updateProgress: vi.fn(),
      updateModuleAccess: vi.fn(),
      updateTimeSpent: vi.fn(),
      updateQuizScore: vi.fn(),
      resetProgress: vi.fn(),
      resetModule: vi.fn(),
      getModuleById: vi.fn(),
      getModulesByCategory: vi.fn(),
      getModulesByDifficulty: vi.fn(),
      clearAllData: vi.fn(),
    })

    render(<CertificateButton />)
    
    fireEvent.click(screen.getByText('🏆 Generate Certificate'))
    
    expect(mockSetShowModal).toHaveBeenCalledWith(true)
  })

  it('should call custom onGenerateCertificate when provided', () => {
    const mockOnGenerate = vi.fn()
    
    mockUseTrainingStore.mockReturnValue({
      overallProgress: 100,
      modules: [],
      completedCount: 3,
      totalCount: 3,
      initialized: true,
      initializeModules: vi.fn(),
      completeModule: vi.fn(),
      updateProgress: vi.fn(),
      updateModuleAccess: vi.fn(),
      updateTimeSpent: vi.fn(),
      updateQuizScore: vi.fn(),
      resetProgress: vi.fn(),
      resetModule: vi.fn(),
      getModuleById: vi.fn(),
      getModulesByCategory: vi.fn(),
      getModulesByDifficulty: vi.fn(),
      clearAllData: vi.fn(),
    })

    render(<CertificateButton onGenerateCertificate={mockOnGenerate} />)
    
    fireEvent.click(screen.getByText('🏆 Generate Certificate'))
    
    expect(mockOnGenerate).toHaveBeenCalled()
    expect(mockSetShowModal).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    mockUseTrainingStore.mockReturnValue({
      overallProgress: 100,
      modules: [],
      completedCount: 3,
      totalCount: 3,
      initialized: true,
      initializeModules: vi.fn(),
      completeModule: vi.fn(),
      updateProgress: vi.fn(),
      updateModuleAccess: vi.fn(),
      updateTimeSpent: vi.fn(),
      updateQuizScore: vi.fn(),
      resetProgress: vi.fn(),
      resetModule: vi.fn(),
      getModuleById: vi.fn(),
      getModulesByCategory: vi.fn(),
      getModulesByDifficulty: vi.fn(),
      clearAllData: vi.fn(),
    })

    render(<CertificateButton className="custom-class" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })
})