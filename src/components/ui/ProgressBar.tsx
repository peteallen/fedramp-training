import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  className?: string
  showLabel?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
}

const variantClasses = {
  default: 'bg-blue-600 dark:bg-blue-500',
  success: 'bg-green-600 dark:bg-green-500',
  warning: 'bg-yellow-600 dark:bg-yellow-500',
  error: 'bg-red-600 dark:bg-red-500'
}

export const ProgressBar = ({ 
  progress, 
  className, 
  showLabel = false, 
  label,
  size = 'md',
  variant = 'default'
}: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {label || 'Progress'}
          </span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      <div className={cn(
        'w-full bg-gray-200 dark:bg-gray-700 rounded-full',
        sizeClasses[size]
      )}>
        <div 
          className={cn(
            'rounded-full transition-all duration-300',
            sizeClasses[size],
            variantClasses[variant]
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}