import { Button } from '@/components/ui/button'
import { useTrainingStore } from '@/stores/trainingStore'
import { FaShieldAlt, FaBookOpen, FaChartBar, FaUsers, FaCloud, FaExclamationTriangle } from 'react-icons/fa'

interface ModuleCardProps {
  moduleId: number
}

export const ModuleCard = ({ moduleId }: ModuleCardProps) => {
  const { getModuleById, completeModule, updateProgress } = useTrainingStore()
  const module = getModuleById(moduleId)

  if (!module) {
    return null
  }

  const getModuleIcon = (category: string) => {
    const iconMap = {
      fundamentals: FaShieldAlt,
      security: FaBookOpen,
      process: FaChartBar,
      compliance: FaUsers,
      risk: FaExclamationTriangle,
      cloud: FaCloud,
    }
    return iconMap[category as keyof typeof iconMap] || FaShieldAlt
  }

  const getDifficultyColor = (difficulty: string) => {
    const colorMap = {
      beginner: 'text-green-600 dark:text-green-400',
      intermediate: 'text-yellow-600 dark:text-yellow-400',
      advanced: 'text-red-600 dark:text-red-400',
    }
    return colorMap[difficulty as keyof typeof colorMap] || 'text-gray-600 dark:text-gray-400'
  }

  const IconComponent = getModuleIcon(module.category)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <IconComponent className="text-2xl text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {module.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {module.category} • {module.estimatedTime}
            </p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(module.difficulty)}`}>
          {module.difficulty}
        </span>
      </div>
      
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
        {module.description}
      </p>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{module.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${module.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button 
          onClick={() => completeModule(module.id)}
          className="flex-1"
          variant={module.completed ? "default" : "outline"}
          disabled={module.completed}
        >
          {module.completed ? "Completed" : "Start Module"}
        </Button>
        
        {module.progress > 0 && module.progress < 100 && (
          <Button 
            onClick={() => updateProgress(module.id, module.progress + 25)}
            variant="outline"
            size="sm"
          >
            +25%
          </Button>
        )}
      </div>
      
      {module.lastAccessed && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Last accessed: {new Date(module.lastAccessed).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}