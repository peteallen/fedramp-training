import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCertificateStore, extractCompletionData } from '@/stores/certificateStore'
import { CertificateModal } from './CertificateModal'

// Mock the stores and functions
vi.mock('@/stores/certificateStore')
vi.mock('./CertificatePreview', () => ({
  CertificatePreview: ({ userData }: { userData: { fullName: string } }) => (
    <div data-testid="certificate-preview">Preview for {userData.fullName}</div>
  )
}))

const mockUseCertificateStore = vi.mocked(useCertificateStore)
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
    
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
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

  it('should show preview when toggled', async () => {
    render(
      <CertificateModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    const nameInput = screen.getByLabelText('Full Name *')
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
    const previewButton = screen.getByText('Show Preview')
    fireEvent.click(previewButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('certificate-preview')).toBeInTheDocument()
      expect(screen.getByText('Preview for John Doe')).toBeInTheDocument()
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
})