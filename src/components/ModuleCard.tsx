import { Button } from '@/components/ui/button'
import { useTrainingStore } from '@/stores/trainingStore'
import { FaShieldAlt, FaBookOpen, FaChartBar, FaUsers, FaCloud, FaExclamationTriangle, FaFileAlt, FaEye, FaUserTie } from 'react-icons/fa'

interface ModuleCardProps {
  moduleId: number
  onStartModule: (moduleId: number) => void
}

export const ModuleCard = ({ moduleId, onStartModule }: ModuleCardProps) => {
  const { getModuleById, updateProgress } = useTrainingStore()
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
      policy: FaFileAlt,
      awareness: FaEye,
      'role-based': FaUserTie,
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

  const getCategoryColor = (category: string) => {
    const colorMap = {
      policy: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      awareness: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'role-based': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    }
    return colorMap[category as keyof typeof colorMap] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  const IconComponent = getModuleIcon(module.category)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 transition-all duration-300 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <IconComponent className="text-2xl text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {module.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(module.category)}`}>
                {module.category}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {module.estimatedTime}
              </span>
            </div>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(module.difficulty)}`}>
          {module.difficulty}
        </span>
      </div>
      
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {module.description}
      </p>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Learning Objectives:</h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          {module.objectives.slice(0, 2).map((objective, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              {objective}
            </li>
          ))}
          {module.objectives.length > 2 && (
            <li className="text-blue-600 dark:text-blue-400 font-medium">
              +{module.objectives.length - 2} more objectives
            </li>
          )}
        </ul>
      </div>
      
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
          onClick={() => onStartModule(module.id)}
          className="flex-1"
          variant={module.completed ? "default" : "outline"}
        >
          {module.completed ? "Review Module" : "Start Module"}
        </Button>
        
        {module.progress > 0 && module.progress < 100 && (
          <Button 
            onClick={() => updateProgress(module.id, Math.min(module.progress + 25, 100))}
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