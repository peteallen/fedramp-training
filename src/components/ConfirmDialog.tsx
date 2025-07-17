import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}: ConfirmDialogProps) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Focus the cancel button when dialog opens
      setTimeout(() => {
        cancelButtonRef.current?.focus()
      }, 0)
    }

    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        role="button"
        tabIndex={0}
        onClick={onCancel}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onCancel()
          }
        }}
        data-testid="dialog-overlay"
        aria-label="Close dialog"
      />
      
      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {message}
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            ref={cancelButtonRef}
            variant="outline" 
            onClick={onCancel}
            className="px-4 py-2"
            autoFocus
          >
            {cancelText}
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            className="px-4 py-2"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}