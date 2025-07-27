import { FaQuestionCircle } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface QuizQuestionProps {
  question: {
    question: string
    options: string[]
  }
  selectedAnswer?: number
  questionNumber: number
  totalQuestions: number
  onSelectAnswer: (index: number) => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  isLastQuestion: boolean
  moduleTitle: string
}

export const QuizQuestion = ({
  question,
  selectedAnswer,
  questionNumber,
  totalQuestions,
  onSelectAnswer,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
  moduleTitle
}: QuizQuestionProps) => {
  const progressPercent = (questionNumber / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaQuestionCircle className="text-2xl text-blue-600 dark:text-blue-400 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Quiz: {moduleTitle}
              </h1>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Question {questionNumber} of {totalQuestions}
            </div>
          </div>

          <div className="mb-6">
            <ProgressBar 
              progress={progressPercent} 
              variant="success"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              {question.question}
            </h2>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onSelectAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
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
              onClick={onPrevious}
              disabled={!canGoPrevious}
              variant="outline"
            >
              Previous
            </Button>
            
            <Button
              onClick={onNext}
              disabled={!canGoNext}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLastQuestion ? 'Submit Quiz' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}