import { FaBookOpen, FaUsers } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { useTrainingStore } from '@/stores/trainingStore'

interface ModuleCardProps {
  moduleId: number
  onStartModule: (moduleId: number) => void
}

export const ModuleCard = ({ moduleId, onStartModule }: ModuleCardProps) => {
  const module = useTrainingStore((state) => 
    state.modules.find(m => m.id === moduleId)
  )

  if (!module) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl dark:hover:shadow-gray-700/50 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
            <FaBookOpen className="text-xl text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {module.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center">
                <FaUsers className="mr-1" />
                {module.sections?.length || 0} sections
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {module.description}
      </p>
      
      {module.requiredForMembers && module.requiredForMembers.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Required for:</span>
            <div className="flex flex-wrap gap-1">
              {module.requiredForMembers.slice(0, 4).map((member, index) => (
                <span key={index} className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {member}
                </span>
              ))}
              {module.requiredForMembers.length > 4 && (
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  +{module.requiredForMembers.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Learning Objectives
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          {module.objectives.slice(0, 2).map((objective, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span className="leading-relaxed">{objective}</span>
            </li>
          ))}
          {module.objectives.length > 2 && (
            <li className="text-blue-600 dark:text-blue-400 font-medium text-sm ml-4">
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

      <div className="flex space-x-3">
        <Button 
          onClick={() => onStartModule(module.id)}
          className="flex-1 h-11"
          variant={module.completed ? "default" : "outline"}
        >
          {module.completed ? "Review Module" : "Start Module"}
        </Button>
      </div>
      
      {module.lastAccessed && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Last accessed: {new Date(module.lastAccessed).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}