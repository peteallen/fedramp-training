// @ts-nocheck - React icons type compatibility issue
import { useState, useEffect } from 'react'
import { FaArrowLeft, FaArrowRight, FaCheck, FaTimes, FaLightbulb, FaQuestionCircle, FaBookOpen, FaClock, FaGraduationCap, FaUserShield } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'
import { useTrainingStore } from '@/stores/trainingStore'

interface ModuleViewerProps {
  moduleId: number
  onBack: () => void
}

export const ModuleViewer = ({ moduleId, onBack }: ModuleViewerProps) => {
  const { getModuleById, updateProgress, completeModule, updateModuleAccess, updateQuizScore } = useTrainingStore()
  const module = getModuleById(moduleId)
  
  const [currentSection, setCurrentSection] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (module) {
      updateModuleAccess(moduleId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId])

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">Module not found</p>
          <Button onClick={onBack} className="mt-4">
            <FaArrowLeft className="mr-2" />
            Back to Modules
          </Button>
        </div>
      </div>
    )
  }

  const totalSections = module.content.length
  const progressPercent = showQuiz ? 100 : Math.round(((currentSection + 1) / totalSections) * 90)

  const handleNextSection = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1)
      updateProgress(moduleId, Math.round(((currentSection + 2) / totalSections) * 90))
    } else {
      setShowQuiz(true)
      updateProgress(moduleId, 90)
    }
  }

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuizQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleQuizNext = () => {
    if (currentQuizQuestion < module.quiz.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1)
    } else {
      submitQuiz()
    }
  }

  const handleQuizPrev = () => {
    if (currentQuizQuestion > 0) {
      setCurrentQuizQuestion(currentQuizQuestion - 1)
    }
  }

  const submitQuiz = () => {
    let correct = 0
    module.quiz.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    
    const score = Math.round((correct / module.quiz.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)
    updateQuizScore(moduleId, score)
    
    if (score >= 70) {
      completeModule(moduleId)
      updateProgress(moduleId, 100)
    }
  }

  const getContentIcon = (type: string) => {
    const iconMap = {
      introduction: FaLightbulb,
      section: FaBookOpen,
      conclusion: FaCheck,
    }
    return iconMap[type as keyof typeof iconMap] || FaBookOpen
  }

  if (showQuiz && !quizSubmitted) {
    const currentQuestion = module.quiz[currentQuizQuestion]
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FaQuestionCircle className="text-2xl text-blue-600 dark:text-blue-400 mr-3" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Quiz: {module.title}
                </h1>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuizQuestion + 1} of {module.quiz.length}
              </div>
            </div>

            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuizQuestion + 1) / module.quiz.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                {currentQuestion.question}
              </h2>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswers[currentQuizQuestion] === index
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full border-2 border-gray-400 dark:border-gray-500 mr-3 flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={handleQuizPrev}
                disabled={currentQuizQuestion === 0}
                variant="outline"
              >
                <FaArrowLeft className="mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleQuizNext}
                disabled={selectedAnswers[currentQuizQuestion] === undefined}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {currentQuizQuestion === module.quiz.length - 1 ? 'Submit Quiz' : 'Next'}
                {currentQuizQuestion < module.quiz.length - 1 && <FaArrowRight className="ml-2" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (quizSubmitted) {
    const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60)
    const passed = quizScore >= 70
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
              passed ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
            }`}>
              {passed ? (
                <FaCheck className="text-4xl text-green-600 dark:text-green-400" />
              ) : (
                <FaTimes className="text-4xl text-red-600 dark:text-red-400" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {quizScore}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Quiz Score</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {timeSpent}m
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Time Spent</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {selectedAnswers.filter((answer, index) => answer === module.quiz[index].correctAnswer).length}/{module.quiz.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
              </div>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              {passed 
                ? 'You have successfully completed this training module!'
                : 'You need at least 70% to pass. Review the material and try again.'
              }
            </p>

            <div className="flex justify-center space-x-4">
              <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white">
                <FaArrowLeft className="mr-2" />
                Back to Modules
              </Button>
              {!passed && (
                <Button 
                  onClick={() => {
                    setShowQuiz(false)
                    setCurrentSection(0)
                    setCurrentQuizQuestion(0)
                    setSelectedAnswers([])
                    setQuizSubmitted(false)
                    setQuizScore(0)
                  }}
                  variant="outline"
                >
                  Review Material
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentContent = module.content[currentSection]
  const IconComponent = getContentIcon(currentContent.type)

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
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Section {currentSection + 1} of {totalSections}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {module.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <FaClock className="mr-2" />
              {module.estimatedTime}
            </div>
            <div className="flex items-center">
              <FaGraduationCap className="mr-2" />
              {module.difficulty}
            </div>
            <div className="flex items-center">
              <FaUserShield className="mr-2" />
              {module.category}
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
              <IconComponent className="text-xl text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {currentContent.title}
            </h2>
          </div>

          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none 
                         prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 
                         prose-h1:text-2xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:leading-tight
                         prose-h2:text-xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:leading-tight
                         prose-h3:text-lg prose-h3:mb-3 prose-h3:mt-5 prose-h3:leading-tight
                         prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                         prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                         prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                         prose-ul:my-4 prose-li:my-1 prose-li:leading-relaxed
                         prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic
                         prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentContent.content}</ReactMarkdown>
          </div>

          {currentSection === 0 && (
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Learning Objectives
              </h3>
              <ul className="space-y-2">
                {module.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={handlePrevSection}
            disabled={currentSection === 0}
            variant="outline"
          >
            <FaArrowLeft className="mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNextSection}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {currentSection === totalSections - 1 ? 'Take Quiz' : 'Next'}
            <FaArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}