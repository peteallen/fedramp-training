import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTrainingInit } from '@/hooks/useTrainingInit'
import { useCertificateStore } from '@/stores/certificateStore'
import useUserStore from '@/stores/userStore'
import App from './App'

// Mock the hooks directly
vi.mock('@/hooks/useTrainingInit')
vi.mock('@/stores/certificateStore')
vi.mock('@/stores/userStore')

describe('App', () => {
  const mockUseTrainingInit = vi.mocked(useTrainingInit)
  const mockUseCertificateStore = vi.mocked(useCertificateStore)
  const mockUseUserStore = vi.mocked(useUserStore)

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mocks
    mockUseTrainingInit.mockReturnValue({ initialized: true })
    
    // Mock certificate store to return functions
    mockUseCertificateStore.mockImplementation((selector) => {
      const state = {
        showModal: false,
        setShowModal: vi.fn(),
        saveUserData: vi.fn(),
        setGenerating: vi.fn(),
        addGeneratedCertificate: vi.fn(),
      }
      return selector ? selector(state) : state
    })
    
    // Mock user store to return functions
    mockUseUserStore.mockImplementation((selector) => {
      const state = {
        isOnboarded: false,
        completeOnboarding: vi.fn(),
        isContentRelevantForUser: vi.fn(() => true),
        getUserData: vi.fn(() => null),
      }
      return selector ? selector(state) : state
    })
  })

  it('should render loading state when not initialized', () => {
    mockUseTrainingInit.mockReturnValue({ initialized: false })
    
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Loading training modules...')).toBeInTheDocument()
  })

  it('should render welcome screen route when not onboarded', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    
    // The WelcomeScreen component should be rendered
    expect(screen.getByText(/Welcome to ClearTriage Security Training/)).toBeInTheDocument()
  })

  it('should redirect to modules when onboarded', () => {
    mockUseUserStore.mockImplementation((selector) => {
      const state = {
        isOnboarded: true,
        completeOnboarding: vi.fn(),
        isContentRelevantForUser: vi.fn(() => true),
        getUserData: vi.fn(() => null),
      }
      return selector ? selector(state) : state
    })
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    
    // Should redirect to modules (ModuleList component)
    expect(screen.getByText(/ClearTriage Security & Privacy Training/)).toBeInTheDocument()
  })

  it('should render certificate modal when showModal is true', () => {
    mockUseUserStore.mockImplementation((selector) => {
      const state = {
        isOnboarded: true,
        completeOnboarding: vi.fn(),
        isContentRelevantForUser: vi.fn(() => true),
        getUserData: vi.fn(() => null),
      }
      return selector ? selector(state) : state
    })
    
    mockUseCertificateStore.mockImplementation((selector) => {
      const state = {
        showModal: true,
        setShowModal: vi.fn(),
        saveUserData: vi.fn(),
        setGenerating: vi.fn(),
        addGeneratedCertificate: vi.fn(),
      }
      return selector ? selector(state) : state
    })
    
    render(
      <MemoryRouter initialEntries={['/modules']}>
        <App />
      </MemoryRouter>
    )
    
    // Certificate modal should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})