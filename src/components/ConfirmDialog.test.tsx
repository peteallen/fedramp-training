import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  const mockOnConfirm = vi.fn()
  const mockOnCancel = vi.fn()

  const defaultProps = {
    isOpen: true,
    title: 'Test Title',
    message: 'Test message',
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render dialog when isOpen is true', () => {
    render(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('should render default button text', () => {
    render(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('should render custom button text', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmText="Delete"
        cancelText="Keep"
      />
    )
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('should call onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)
    
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)
    
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when overlay is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)
    
    // Click on the overlay (backdrop)
    const overlay = screen.getByTestId('dialog-overlay') || document.querySelector('.fixed.inset-0.bg-black')
    if (overlay) {
      await user.click(overlay)
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    }
  })

  it('should call onCancel when Escape key is pressed', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)
    
    await user.keyboard('{Escape}')
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('should focus cancel button when dialog opens', async () => {
    render(<ConfirmDialog {...defaultProps} />)
    
    await waitFor(() => {
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      expect(cancelButton).toHaveFocus()
    })
  })

  it('should not call onCancel when Escape is pressed and dialog is closed', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} isOpen={false} />)
    
    await user.keyboard('{Escape}')
    expect(mockOnCancel).not.toHaveBeenCalled()
  })

  it('should handle keyboard navigation between buttons', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    const confirmButton = screen.getByRole('button', { name: 'Confirm' })
    
    await waitFor(() => {
      expect(cancelButton).toHaveFocus()
    })
    
    await user.keyboard('{Tab}')
    expect(confirmButton).toHaveFocus()
    
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(cancelButton).toHaveFocus()
  })

  it('should have proper destructive styling for confirm button', () => {
    render(<ConfirmDialog {...defaultProps} />)
    
    const confirmButton = screen.getByRole('button', { name: 'Confirm' })
    expect(confirmButton).toHaveClass('bg-destructive')
  })

  it('should have proper outline styling for cancel button', () => {
    render(<ConfirmDialog {...defaultProps} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    expect(cancelButton).toHaveClass('border')
  })

  it('should clean up event listeners when unmounted', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = render(<ConfirmDialog {...defaultProps} />)
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })
})