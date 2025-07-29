import { useState, useEffect, useMemo } from 'react'
import { FaArrowLeft, FaArrowRight, FaCheck, FaLightbulb, FaBookOpen, FaClock } from 'react-icons/fa'
import { ContentRenderer } from '@/components/ContentRenderer'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useTrainingStore } from '@/stores/trainingStore'

// Constants
const COMPLETE_PROGRESS = 100

interface ModuleViewerProps {
  moduleId: number
  onBack: () => void
}

export const ModuleViewer = ({ moduleId, onBack }: ModuleViewerProps) => {
  const module = useTrainingStore((state) => 
    state.modules.find(m => m.id === moduleId)
  )
  const updateProgress = useTrainingStore((state) => state.updateProgress)
  const completeModule = useTrainingStore((state) => state.completeModule)
  const updateModuleAccess = useTrainingStore((state) => state.updateModuleAccess)
  
  const [currentSection, setCurrentSection] = useState(0)
  const [isOnLastPage, setIsOnLastPage] = useState(false)
  const [isPaginated, setIsPaginated] = useState(false)

  useEffect(() => {
    if (module) {
      updateModuleAccess(moduleId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId])

  const totalSections = module?.sections?.length ?? 0;

  const progressPercent = useMemo(() => {
    if (totalSections === 0) return 0;
    return Math.round(((currentSection + 1) / totalSections) * COMPLETE_PROGRESS);
  }, [currentSection, totalSections]);


  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Module Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              The requested module (ID: {moduleId}) could not be found.
            </p>
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white">
              <FaArrowLeft className="mr-2" />
              Back to Modules
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleNextSection = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1)
      setIsOnLastPage(false) // Reset when moving to new section
      updateProgress(moduleId, Math.round(((currentSection + 2) / totalSections) * COMPLETE_PROGRESS))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      setIsOnLastPage(false) // Reset when moving sections
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const currentSection_data = module.sections[currentSection]
  const IconComponent = FaBookOpen // Use book icon for all sections
  const isLastSection = currentSection === totalSections - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <FaArrowLeft className="mr-2" />
              Back to Modules
            </Button>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {module.estimatedDuration && (
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  {module.estimatedDuration} min
                </div>
              )}
              <div>
                Section {currentSection + 1} of {totalSections}
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {module.title}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {module.description}
          </p>
          
          {module.requiredForMembers && module.requiredForMembers.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>Required for:</span>
              <div className="flex flex-wrap gap-1">
                {module.requiredForMembers.map((member, index) => (
                  <span key={index} className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <ProgressBar 
              progress={progressPercent} 
              showLabel 
              label="Progress"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mr-4">
              <IconComponent className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {currentSection_data.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Section {currentSection_data.id}
              </p>
            </div>
          </div>

          {currentSection === 0 && (
            <div className="mb-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <FaLightbulb className="text-blue-600 dark:text-blue-400 mr-2" />
                Learning Objectives
              </h3>
              <ul className="space-y-3">
                {module.objectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ContentRenderer 
            content={currentSection_data.content} 
            isLastSection={isLastSection}
            onLastPageReached={() => setIsOnLastPage(true)}
            onPaginationStatus={setIsPaginated}
          />
        </div>

        {/* Module completion box - show above navigation/pagination */}
        {isLastSection && isOnLastPage && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/30 rounded-lg p-6 border border-green-200 dark:border-green-800 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              <FaCheck className="text-green-600 dark:text-green-400 mr-2" />
              Module Complete!
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Congratulations! You have completed this training module. Click the button below to mark it as complete and return to the main page.
            </p>
            <Button
              onClick={() => {
                completeModule(moduleId)
                updateProgress(moduleId, COMPLETE_PROGRESS)
                onBack()
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <FaCheck className="mr-2" />
              Complete Module & Return
            </Button>
          </div>
        )}

        {/* Navigation - only show when not using pagination and not on completion screen */}
        {!isPaginated && !(isLastSection && isOnLastPage) && (
          <div className="flex justify-between mt-6">
          <Button
            onClick={handlePrevSection}
            disabled={currentSection === 0}
            variant="outline"
          >
            <FaArrowLeft className="mr-2" />
            Previous Section
          </Button>
          
          <Button
            onClick={handleNextSection}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLastSection ? 'Next Page' : 'Next Section'}
            <FaArrowRight className="ml-2" />
          </Button>
          </div>
        )}
      </div>
    </div>
  )
}