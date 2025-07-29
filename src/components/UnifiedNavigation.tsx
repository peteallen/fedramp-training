import { Button } from '@/components/ui/button'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'

interface UnifiedNavigationProps {
  // Section navigation
  currentSection: number
  totalSections: number
  onPrevSection: () => void
  onNextSection: () => void
  
  // Page navigation (when content is paginated)
  currentPage?: number
  totalPages?: number
  onPrevPage?: () => void
  onNextPage?: () => void
  onPageChange?: (page: number) => void
  
  // Module completion
  isLastSection: boolean
  isOnLastPage: boolean
  isOnFirstPage: boolean
  onCompleteModule: () => void
}

export const UnifiedNavigation = ({
  currentSection,
  totalSections,
  onPrevSection,
  onNextSection,
  currentPage = 1,
  totalPages = 1,
  onPrevPage,
  onNextPage,
  onPageChange,
  isLastSection,
  isOnLastPage,
  isOnFirstPage,
  onCompleteModule
}: UnifiedNavigationProps) => {
  const isPaginated = totalPages > 1
  const isFirstSection = currentSection === 0
  const hasMultipleSections = totalSections > 1
  
  // Determine what navigation buttons to show
  const showPrevSection = !isFirstSection && isOnFirstPage && hasMultipleSections
  const showPrevPage = !isOnFirstPage && isPaginated
  const showNextSection = !isLastSection && ((isOnLastPage || !isPaginated) || (isPaginated && currentPage === totalPages)) && hasMultipleSections
  const showNextPage = !isOnLastPage && isPaginated && !(currentPage === totalPages && !isLastSection)
  const showCompleteModule = isLastSection && (isOnLastPage || !isPaginated)
  
  // Show nothing if we're in the middle of paginated content with no navigation needed
  if (!showPrevSection && !showPrevPage && !showNextSection && !showNextPage && !showCompleteModule) {
    return null
  }
  
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center">
        {/* Left side navigation */}
        <div>
          {showPrevSection && (
            <Button
              onClick={onPrevSection}
              variant="outline"
              size="sm"
            >
              <FaArrowLeft className="mr-2" />
              Previous Section
            </Button>
          )}
          {showPrevPage && (
            <Button
              onClick={() => {
                if (onPageChange && currentPage > 1) {
                  onPageChange(currentPage - 1)
                } else if (onPrevPage) {
                  onPrevPage()
                }
              }}
              variant="outline"
              size="sm"
            >
              <FaArrowLeft className="mr-2" />
              Previous
            </Button>
          )}
          {!showPrevSection && !showPrevPage && <div />}
        </div>
        
        {/* Center status */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {hasMultipleSections && (
            <span>Section {currentSection + 1} of {totalSections}</span>
          )}
          {hasMultipleSections && isPaginated && ' • '}
          {isPaginated && (
            <span>Page {currentPage} of {totalPages}</span>
          )}
        </div>
        
        {/* Right side navigation */}
        <div>
          {showNextSection && (
            <Button
              onClick={onNextSection}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              Next Section
              <FaArrowRight className="ml-2" />
            </Button>
          )}
          {showNextPage && !showNextSection && (
            <Button
              onClick={() => {
                if (onPageChange && currentPage < totalPages) {
                  onPageChange(currentPage + 1)
                } else if (onNextPage) {
                  onNextPage()
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              Next
              <FaArrowRight className="ml-2" />
            </Button>
          )}
          {showCompleteModule && (
            <Button
              onClick={onCompleteModule}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <FaCheck className="mr-2" />
              Complete Module
            </Button>
          )}
          {!showNextSection && !showNextPage && !showCompleteModule && <div />}
        </div>
      </div>
    </div>
  )
}