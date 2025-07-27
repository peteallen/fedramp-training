import { useState, useCallback } from 'react'

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

interface UseQuizProps {
  questions: QuizQuestion[]
  passingScore?: number
  onComplete: (score: number, passed: boolean) => void
}

export const useQuiz = ({ questions, passingScore = 70, onComplete }: UseQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const selectAnswer = useCallback((answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }, [currentQuestion, selectedAnswers])

  const goToNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitQuiz()
    }
  }, [currentQuestion, questions.length])

  const goToPrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }, [currentQuestion])

  const submitQuiz = useCallback(() => {
    const correctAnswers = questions.reduce((count, question, index) => {
      return selectedAnswers[index] === question.correctAnswer ? count + 1 : count
    }, 0)
    
    const finalScore = Math.round((correctAnswers / questions.length) * 100)
    const passed = finalScore >= passingScore
    
    setScore(finalScore)
    setIsSubmitted(true)
    onComplete(finalScore, passed)
  }, [questions, selectedAnswers, passingScore, onComplete])

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setIsSubmitted(false)
    setScore(0)
  }, [])

  const canProceed = selectedAnswers[currentQuestion] !== undefined
  const isLastQuestion = currentQuestion === questions.length - 1
  const correctAnswersCount = selectedAnswers.filter((answer, index) => 
    answer === questions[index]?.correctAnswer
  ).length

  return {
    currentQuestion,
    selectedAnswers,
    isSubmitted,
    score,
    selectAnswer,
    goToNext,
    goToPrevious,
    resetQuiz,
    canProceed,
    isLastQuestion,
    correctAnswersCount,
    totalQuestions: questions.length,
    currentQuestionData: questions[currentQuestion],
    progressPercent: ((currentQuestion + 1) / questions.length) * 100
  }
}