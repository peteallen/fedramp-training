import { useState, ReactNode, useEffect, useCallback } from 'react'
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

interface PaginationProps<T = unknown> {
  items: T[]
  itemsPerPage?: number
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  onLastPageReached?: () => void
  onFirstPageReached?: () => void
  hideNavigation?: boolean
  currentPage?: number
  onPageChange?: (page: number) => void
  provideTotalPages?: (pages: number) => void
  provideNavHandlers?: (handlers: { next: () => void; prev: () => void }) => void
}

export function SectionPagination<T>({ 
  items, 
  itemsPerPage = 4, 
  renderItem, 
  className = '',
  onLastPageReached,
  onFirstPageReached,
  hideNavigation = false,
  currentPage: externalCurrentPage,
  onPageChange,
  provideTotalPages,
  provideNavHandlers
}: PaginationProps<T>) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1)
  const currentPage = externalCurrentPage ?? internalCurrentPage
  
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = items.slice(startIndex, endIndex)
  
  // Provide total pages to parent if requested
  useEffect(() => {
    if (provideTotalPages) {
      provideTotalPages(totalPages)
    }
  }, [totalPages, provideTotalPages])
  
  const setCurrentPage = useCallback((page: number) => {
    if (onPageChange) {
      onPageChange(page)
    } else {
      setInternalCurrentPage(page)
    }
  }, [onPageChange])

  const _handlePreviousPage = useCallback(() => {
    const newPage = Math.max(1, currentPage - 1)
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage, setCurrentPage])
  
  const _handleNextPage = useCallback(() => {
    const newPage = Math.min(totalPages, currentPage + 1)
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage, totalPages, setCurrentPage])
  
  // Provide navigation handlers to parent if requested
  useEffect(() => {
    if (provideNavHandlers) {
      // Create handlers that use current values
      const handlers = {
        next: () => {
          const newPage = Math.min(totalPages, currentPage + 1)
          setCurrentPage(newPage)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        prev: () => {
          const newPage = Math.max(1, currentPage - 1)
          setCurrentPage(newPage)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
      provideNavHandlers(handlers)
    }
  }, [currentPage, totalPages, provideNavHandlers, setCurrentPage])
  
  const handlePageClick = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Notify parent about page state changes
  useEffect(() => {
    if (currentPage === totalPages && onLastPageReached) {
      onLastPageReached()
    } else if (currentPage === 1 && onFirstPageReached) {
      onFirstPageReached()
    }
  }, [currentPage, totalPages, onLastPageReached, onFirstPageReached])
  
  // Handle single page scenario
  useEffect(() => {
    if (totalPages <= 1) {
      if (onLastPageReached) {
        onLastPageReached() // We're on the only/last page
      }
      if (provideTotalPages) {
        provideTotalPages(1)
      }
    }
  }, [totalPages, onLastPageReached, provideTotalPages])
  
  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return (
      <div className={className}>
        {items.map((item, index) => renderItem(item, index))}
      </div>
    )
  }
  
  return (
    <div className={className}>
      {/* Render current page items */}
      {currentItems.map((item, index) => renderItem(item, startIndex + index))}
      
      {/* Page indicators only - navigation handled by parent */}
      {!hideNavigation && totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                onClick={() => handlePageClick(page)}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                className="w-8 h-8 p-0 text-xs"
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}