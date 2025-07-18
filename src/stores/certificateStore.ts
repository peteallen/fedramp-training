import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  CertificateState, 
  CertificateUserData, 
  GeneratedCertificate,
  CompletionData,
  ModuleCompletion
} from '../types/certificate'
import { useTrainingStore } from './trainingStore'

// Add interface for persisted state


// Helper functions to extract completion data from training store
export const extractCompletionData = (): CompletionData | null => {
  const trainingState = useTrainingStore.getState()
  
  // Only return data if all modules are completed
  if (trainingState.overallProgress < 100) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedModules = trainingState.modules.filter((module: any) => module.completed)
  
  if (completedModules.length === 0) {
    return null
  }

  // Transform training modules to completion data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modules: ModuleCompletion[] = completedModules.map((module: any) => {
    let completionDate = module.completionDate || module.lastAccessed || new Date();
    if (typeof completionDate === 'string') {
      completionDate = new Date(completionDate);
    }
    if (isNaN(completionDate.getTime())) {
      completionDate = new Date();
    }
    
    return {
      id: module.id,
      title: module.title,
      completionDate,
      score: module.quizScore,
      timeSpent: module.timeSpent || 0
    }
  })

  // Calculate overall completion date (latest module completion)
  const completionTimes = modules.map(m => m.completionDate.getTime());
  const maxTime = Math.max(...completionTimes);
  const overallCompletionDate = new Date(maxTime);

  // Calculate total time spent across all modules
  const totalTimeSpent = modules.reduce((total, module) => {
    return total + (module.timeSpent || 0)
  }, 0)

  // Calculate overall score (average of module scores, excluding undefined scores)
  const modulesWithScores = modules.filter((module: ModuleCompletion) => module.score !== undefined)
  const overallScore = modulesWithScores.length > 0
    ? Math.round(modulesWithScores.reduce((sum, module: ModuleCompletion) => sum + (module.score || 0), 0) / modulesWithScores.length)
    : 0

  return {
    modules,
    overallCompletionDate,
    totalTimeSpent,
    overallScore
  }
}

// Helper function to check if certificate generation is available
export const isCertificateAvailable = (): boolean => {
  const trainingState = useTrainingStore.getState()
  return trainingState.overallProgress >= 100
}

// Helper function to get completion summary for display
export const getCompletionSummary = () => {
  const trainingState = useTrainingStore.getState()
  return {
    completedCount: trainingState.completedCount,
    totalCount: trainingState.totalCount,
    overallProgress: trainingState.overallProgress,
    isComplete: trainingState.overallProgress >= 100
  }
}

export const useCertificateStore = create<CertificateState>()(
  // @ts-expect-error - Zustand type compatibility issue with persist middleware
  persist(
    (set) => ({
      // User data
      savedUserData: null,
      
      // Certificate history
      generatedCertificates: [],
      
      // UI state
      isGenerating: false,
      showModal: false,
      
      // Actions
      saveUserData: (userData: CertificateUserData) => {
        set({ savedUserData: userData })
      },

      addGeneratedCertificate: (certificate: GeneratedCertificate) => {
        set((state) => ({
          generatedCertificates: [...state.generatedCertificates, certificate]
        }))
      },

      setGenerating: (isGenerating: boolean) => {
        set({ isGenerating })
      },

      setShowModal: (show: boolean) => {
        set({ showModal: show })
      },

      clearData: () => {
        set({
          savedUserData: null,
          generatedCertificates: [],
          isGenerating: false,
          showModal: false
        })
      },
    }),
    {
      name: 'certificate-storage',
      partialize: (state: CertificateState) => ({
        // Persist user data and certificate history
        savedUserData: state.savedUserData,
        generatedCertificates: state.generatedCertificates,
        // UI state is not persisted (isGenerating, showModal)
      }),
    }
  )
)