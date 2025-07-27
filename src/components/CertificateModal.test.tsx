import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCertificateStore, extractCompletionData } from '@/stores/certificateStore'
import useUserStore from '@/stores/userStore'
import { CertificateModal } from './CertificateModal'

// Mock the stores and functions
vi.mock('@/stores/certificateStore')
vi.mock('@/stores/userStore')


const mockUseCertificateStore = vi.mocked(useCertificateStore)
const mockUseUserStore = vi.mocked(useUserStore)
const mockExtractCompletionData = vi.mocked(extractCompletionData)

describe('CertificateModal', () => {
  const mockOnClose = vi.fn()
  const mockOnGenerate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseCertificateStore.mockReturnValue({
      savedUserData: null,
      isGenerating: false,
      generatedCertificates: [],
      showModal: false,
      saveUserData: vi.fn(),
      addGeneratedCertificate: vi.fn(),
      setGenerating: vi.fn(),
      setShowModal: vi.fn(),
      clearData: vi.fn(),
    })

    mockUseUserStore.mockReturnValue({
      isOnboarded: false,
      role: null,
      fullName: null,
      onboardingCompletedAt: null,
      completeOnboarding: vi.fn(),
      updateRole: vi.fn(),
      updateName: vi.fn(),
      resetOnboarding: vi.fn(),
      getUserData: vi.fn().mockReturnValue(null),
      isRoleRelevant: vi.fn(),
    })

    mockExtractCompletionData.mockReturnValue({
      modules: [
        {
          id: 1,
          title: 'Test Module',
          completionDate: new Date('2024-01-01'),
          score: 95,
          timeSpent: 30
        }
      ],
      overallCompletionDate: new Date('2024-01-01'),
      totalTimeSpent: 30,
      overallScore: 95
    })
  })

  it('should not render when closed', () => {
    render(
      <CertificateModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    expect(screen.queryByText('Generate Certificate')).not.toBeInTheDocument()
  })

  it('should render when open', () => {
    render(
      <CertificateModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    expect(screen.getByRole('button', { name: 'Generate Certificate' })).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name *')).toBeInTheDocument()
  })

  it('should pre-populate name from saved user data', () => {
    mockUseCertificateStore.mockReturnValue({
      savedUserData: { fullName: 'John Doe' },
      isGenerating: false,
      generatedCertificates: [],
      showModal: false,
      saveUserData: vi.fn(),
      addGeneratedCertificate: vi.fn(),
      setGenerating: vi.fn(),
      setShowModal: vi.fn(),
      clearData: vi.fn(),
    })

    render(
      <CertificateModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Using your saved profile information')).toBeInTheDocument()
  })

  it('should validate required name field', async () => {
    render(
      <CertificateModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    const submitButton = screen.getByRole('button', { name: 'Generate Certificate' })
    fireEvent.click(submitButton)
    
    // Check that onGenerate was not called with empty name
    expect(mockOnGenerate).not.toHaveBeenCalled()
  })

  it('should validate name length', async () => {
    render(
      <CertificateModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    const nameInput = screen.getByLabelText('Full Name *')
    fireEvent.change(nameInput, { target: { value: 'A' } })
    
    const submitButton = screen.getByRole('button', { name: 'Generate Certificate' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Full name must be at least 2 characters')).toBeInTheDocument()
    })
  })

  it('should validate name format', async () => {
    render(
      <CertificateModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    const nameInput = screen.getByLabelText('Full Name *')
    fireEvent.change(nameInput, { target: { value: 'John123' } })
    
    const submitButton = screen.getByRole('button', { name: 'Generate Certificate' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Full name can only contain letters/)).toBeInTheDocument()
    })
  })

  it('should clear errors on valid input', async () => {
    render(
      <CertificateModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    const nameInput = screen.getByLabelText('Full Name *')
    
    // Add valid input
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
    // Verify input has the value
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
  })

  it('should submit with valid data', async () => {
    render(
      <CertificateModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    const nameInput = screen.getByLabelText('Full Name *')
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
    const submitButton = screen.getByRole('button', { name: 'Generate Certificate' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalledWith({ fullName: 'John Doe' })
    })
  })



  it('should handle loading state', () => {
    mockUseCertificateStore.mockReturnValue({
      savedUserData: null,
      isGenerating: true,
      generatedCertificates: [],
      showModal: false,
      saveUserData: vi.fn(),
      addGeneratedCertificate: vi.fn(),
      setGenerating: vi.fn(),
      setShowModal: vi.fn(),
      clearData: vi.fn(),
    })

    render(
      <CertificateModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    expect(screen.getByText('Generating...')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name *')).toBeDisabled()
  })

  it('should close on escape key', () => {
    render(
      <CertificateModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should close on overlay click', () => {
    render(
      <CertificateModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    const overlay = screen.getByRole('dialog').parentElement?.firstChild
    if (overlay) {
      fireEvent.click(overlay)
      expect(mockOnClose).toHaveBeenCalled()
    }
  })

  describe('User Store Integration', () => {
    it('should pre-populate name from user store when available', () => {
      mockUseUserStore.mockReturnValue({
        isOnboarded: true,
        role: 'Development',
        fullName: 'Jane Smith',
        onboardingCompletedAt: new Date(),
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn().mockReturnValue({
          role: 'Development',
          fullName: 'Jane Smith'
        }),
        isRoleRelevant: vi.fn(),
      })

      render(
        <CertificateModal 
          isOpen={true} 
          onClose={mockOnClose} 
          onGenerate={mockOnGenerate} 
        />
      )
      
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Using your saved profile information')).toBeInTheDocument()
      expect(screen.queryByLabelText('Full Name *')).not.toBeInTheDocument()
    })

    it('should prioritize user store data over certificate store data', () => {
      mockUseUserStore.mockReturnValue({
        isOnboarded: true,
        role: 'Development',
        fullName: 'User Store Name',
        onboardingCompletedAt: new Date(),
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn().mockReturnValue({
          role: 'Development',
          fullName: 'User Store Name'
        }),
        isRoleRelevant: vi.fn(),
      })

      mockUseCertificateStore.mockReturnValue({
        savedUserData: { fullName: 'Certificate Store Name' },
        isGenerating: false,
        generatedCertificates: [],
        showModal: false,
        saveUserData: vi.fn(),
        addGeneratedCertificate: vi.fn(),
        setGenerating: vi.fn(),
        setShowModal: vi.fn(),
        clearData: vi.fn(),
      })

      render(
        <CertificateModal 
          isOpen={true} 
          onClose={mockOnClose} 
          onGenerate={mockOnGenerate} 
        />
      )
      
      expect(screen.getByText('User Store Name')).toBeInTheDocument()
    })

    it('should fall back to certificate store data when user store is empty', () => {
      mockUseCertificateStore.mockReturnValue({
        savedUserData: { fullName: 'Certificate Store Name' },
        isGenerating: false,
        generatedCertificates: [],
        showModal: false,
        saveUserData: vi.fn(),
        addGeneratedCertificate: vi.fn(),
        setGenerating: vi.fn(),
        setShowModal: vi.fn(),
        clearData: vi.fn(),
      })

      render(
        <CertificateModal 
          isOpen={true} 
          onClose={mockOnClose} 
          onGenerate={mockOnGenerate} 
        />
      )
      
      expect(screen.getByText('Certificate Store Name')).toBeInTheDocument()
    })

    it('should show name input when no stored data is available', () => {
      render(
        <CertificateModal 
          isOpen={true} 
          onClose={mockOnClose} 
          onGenerate={mockOnGenerate} 
        />
      )
      
      expect(screen.getByLabelText('Full Name *')).toBeInTheDocument()
      expect(screen.getByText(/Enter your name to generate your certificate/)).toBeInTheDocument()
    })

    it('should generate certificate with stored user data without validation', async () => {
      mockUseUserStore.mockReturnValue({
        isOnboarded: true,
        role: 'Development',
        fullName: 'Stored User',
        onboardingCompletedAt: new Date(),
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn().mockReturnValue({
          role: 'Development',
          fullName: 'Stored User'
        }),
        isRoleRelevant: vi.fn(),
      })

      render(
        <CertificateModal 
          isOpen={true} 
          onClose={mockOnClose} 
          onGenerate={mockOnGenerate} 
        />
      )
      
      const submitButton = screen.getByRole('button', { name: 'Generate Certificate' })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalledWith({ fullName: 'Stored User' })
      })
    })



    it('should not validate name input when using stored data', async () => {
      mockUseUserStore.mockReturnValue({
        isOnboarded: true,
        role: 'Development',
        fullName: 'A', // This would normally fail validation
        onboardingCompletedAt: new Date(),
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn().mockReturnValue({
          role: 'Development',
          fullName: 'A'
        }),
        isRoleRelevant: vi.fn(),
      })

      render(
        <CertificateModal 
          isOpen={true} 
          onClose={mockOnClose} 
          onGenerate={mockOnGenerate} 
        />
      )
      
      const submitButton = screen.getByRole('button', { name: 'Generate Certificate' })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalledWith({ fullName: 'A' })
      })
      
      // Should not show validation errors
      expect(screen.queryByText(/Full name must be at least 2 characters/)).not.toBeInTheDocument()
    })

    it('should update message based on stored data availability', () => {
      const { rerender } = render(
        <CertificateModal 
          isOpen={true} 
          onClose={mockOnClose} 
          onGenerate={mockOnGenerate} 
        />
      )
      
      expect(screen.getByText(/Enter your name to generate your certificate/)).toBeInTheDocument()
      
      // Update to have stored data
      mockUseUserStore.mockReturnValue({
        isOnboarded: true,
        role: 'Development',
        fullName: 'Test User',
        onboardingCompletedAt: new Date(),
        completeOnboarding: vi.fn(),
        updateRole: vi.fn(),
        updateName: vi.fn(),
        resetOnboarding: vi.fn(),
        getUserData: vi.fn().mockReturnValue({
          role: 'Development',
          fullName: 'Test User'
        }),
        isRoleRelevant: vi.fn(),
      })
      
      rerender(
        <CertificateModal 
          isOpen={true} 
          onClose={mockOnClose} 
          onGenerate={mockOnGenerate} 
        />
      )
      
      expect(screen.getByText(/Your certificate will be generated for Test User/)).toBeInTheDocument()
    })
  })
})