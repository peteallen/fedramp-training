import { FaInfoCircle, FaExclamationTriangle, FaExclamationCircle, FaLightbulb } from 'react-icons/fa'
import { SectionPagination } from './SectionPagination'

interface ContentItem {
  type: string
  title?: string
  text?: string
  content?: string | ContentItem[]
  style?: string
  items?: string[]
}

interface ContentRendererProps {
  content: ContentItem[]
  className?: string
  isLastSection?: boolean
  onLastPageReached?: () => void
  onPaginationStatus?: (isPaginated: boolean) => void
  disablePagination?: boolean
}

export const ContentRenderer = ({ content, className = '', isLastSection, onLastPageReached, onPaginationStatus, disablePagination = false }: ContentRendererProps) => {
  const renderContentItem = (item: ContentItem, index: number) => {
    switch (item.type) {
      case 'text':
        return (
          <div key={index} className="mb-4">
            <p 
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: item.text?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || '' 
              }}
            />
          </div>
        )

      case 'subsection':
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              {item.title}
            </h3>
            <div className="ml-4">
              {Array.isArray(item.content) && (
                <ContentRenderer content={item.content} disablePagination={true} />
              )}
            </div>
          </div>
        )

      case 'list': {
        const ListTag = item.style === 'numbered' ? 'ol' : 'ul'
        const listClass = item.style === 'numbered' 
          ? 'list-decimal list-inside space-y-2 mb-4' 
          : 'list-disc list-inside space-y-2 mb-4'
        
        return (
          <ListTag key={index} className={listClass}>
            {item.items?.map((listItem, listIndex) => (
              <li key={listIndex} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: listItem }} />
              </li>
            ))}
          </ListTag>
        )
      }

      case 'callout': {
        const calloutStyles = {
          info: {
            container: 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500',
            icon: FaInfoCircle,
            iconColor: 'text-blue-600 dark:text-blue-400'
          },
          warning: {
            container: 'bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500',
            icon: FaExclamationTriangle,
            iconColor: 'text-yellow-600 dark:text-yellow-400'
          },
          important: {
            container: 'bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500',
            icon: FaExclamationCircle,
            iconColor: 'text-red-600 dark:text-red-400'
          },
          tip: {
            container: 'bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500',
            icon: FaLightbulb,
            iconColor: 'text-green-600 dark:text-green-400'
          }
        }
        
        const calloutStyle = calloutStyles[item.style as keyof typeof calloutStyles] || calloutStyles.info
        const CalloutIcon = calloutStyle.icon

        return (
          <div key={index} className={`${calloutStyle.container} rounded-lg p-4 mb-4`}>
            <div className="flex items-start">
              <CalloutIcon className={`${calloutStyle.iconColor} mr-3 mt-1 flex-shrink-0`} />
              <div className="flex-1">
                {item.title && (
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {item.title}
                  </h4>
                )}
                <p 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: item.text?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || '' 
                  }}
                />
              </div>
            </div>
          </div>
        )
      }

      case 'tip':
        return (
          <div key={index} className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <FaLightbulb className="text-green-600 dark:text-green-400 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: item.text?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || '' 
                  }}
                />
              </div>
            </div>
          </div>
        )

      case 'example':
        return (
          <div key={index} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded mr-2">
                Example
              </span>
              {item.title}
            </h4>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded p-3">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                {typeof item.content === 'string' ? item.content : ''}
              </pre>
            </div>
          </div>
        )

      default:
        return (
          <div key={index} className="mb-4">
            <p className="text-gray-500 dark:text-gray-400 italic">
              Unknown content type: {item.type}
            </p>
          </div>
        )
    }
  }

  // Helper function to calculate content complexity/length
  const calculateContentScore = (items: ContentItem[]): number => {
    return items.reduce((score, item) => {
      let itemScore = 1 // Base score for each item
      
      if (item.type === 'subsection' && Array.isArray(item.content)) {
        // Nested subsections add more weight
        itemScore += calculateContentScore(item.content) * 1.5
      }
      
      if (item.type === 'list' && item.items) {
        // Lists add weight based on number of items
        itemScore += item.items.length * 0.5
      }
      
      if (item.type === 'example' || item.type === 'callout') {
        // Examples and callouts are heavier content
        itemScore += 2
      }
      
      return score + itemScore
    }, 0)
  }

  // Check if we should paginate based on content complexity
  const contentScore = calculateContentScore(content)
  const subsections = content.filter(item => item.type === 'subsection')
  const otherContent = content.filter(item => item.type !== 'subsection')
  
  const shouldPaginate = !disablePagination && contentScore > 15 && subsections.length > 2
  
  // Notify parent about pagination status
  if (onPaginationStatus) {
    onPaginationStatus(shouldPaginate)
  }
  
  // Use pagination if content score is high (indicating long/complex content) and we have subsections
  if (shouldPaginate) {
    return (
      <div className={className}>
        {/* Render non-subsection content first */}
        {otherContent.map(renderContentItem)}
        
        {/* Render paginated subsections */}
        <SectionPagination
          items={subsections}
          itemsPerPage={2}
          renderItem={(item, index) => renderContentItem(item, index)}
          className="mt-4"
          onLastPageReached={isLastSection ? onLastPageReached : undefined}
        />
      </div>
    )
  }

  return (
    <div className={className}>
      {content.map(renderContentItem)}
    </div>
  )
}