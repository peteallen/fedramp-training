import { useEffect } from 'react'
import { useTrainingStore } from '../stores/trainingStore'

export const useTrainingInit = () => {
  const { initializeModules, initialized } = useTrainingStore()

  useEffect(() => {
    if (!initialized) {
      initializeModules()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Remove dependencies to prevent potential loops in production

  return { initialized }
}