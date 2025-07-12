import { useEffect } from 'react'
import { useTrainingStore } from '../stores/trainingStore'

export const useTrainingInit = () => {
  const { initializeModules, initialized } = useTrainingStore()

  useEffect(() => {
    if (!initialized) {
      initializeModules()
    }
  }, [initializeModules, initialized])

  return { initialized }
}