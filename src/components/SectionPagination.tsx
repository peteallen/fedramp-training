import { useState, ReactNode } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

interface PaginationProps<T = unknown> {
  items: T[]
  itemsPerPage?: number
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  onLastPageReached?: () => void
  hideNavigation?: boolean
}

export function SectionPagination<T>({ 
  items, 
  itemsPerPage = 4, 
  renderItem, 
  className = '',
  onLastPageReached,
  hideNavigation = false
}: PaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = items.slice(startIndex, endIndex)
  
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handleNextPage = () => {
    const newPage = Math.min(totalPages, currentPage + 1)
    setCurrentPage(newPage)
    if (newPage === totalPages && onLastPageReached) {
      onLastPageReached()
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handlePageClick = (page: number) => {
    setCurrentPage(page)
    if (page === totalPages && onLastPageReached) {
      onLastPageReached()
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    if (onLastPageReached) {
      onLastPageReached() // We're on the only/last page
    }
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
      
      {/* Pagination controls */}
      {!hideNavigation && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          {/* Navigation buttons */}
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <FaChevronLeft className="w-3 h-3" />
              <span>Previous</span>
            </Button>
            
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <FaChevronRight className="w-3 h-3" />
            </Button>
          </div>
          
          {/* Page indicators - centered */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            
            {/* Page number buttons */}
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0 text-xs"
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}