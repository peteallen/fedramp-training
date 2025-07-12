import { create } from 'zustand'

interface TrainingModule {
  id: number
  title: string
  completed: boolean
  progress: number
}

interface TrainingState {
  modules: TrainingModule[]
  completedCount: number
  totalCount: number
  overallProgress: number
  
  // Actions
  completeModule: (moduleId: number) => void
  updateProgress: (moduleId: number, progress: number) => void
  resetProgress: () => void
}

export const useTrainingStore = create<TrainingState>((set) => ({
  modules: [
    { id: 1, title: 'FedRAMP Basics', completed: false, progress: 0 },
    { id: 2, title: 'Security Controls', completed: false, progress: 0 },
    { id: 3, title: 'Assessment Process', completed: false, progress: 0 },
    { id: 4, title: 'Compliance Management', completed: false, progress: 0 },
  ],
  completedCount: 0,
  totalCount: 4,
  overallProgress: 0,

  completeModule: (moduleId) => {
    set((state) => {
      const updatedModules = state.modules.map((module) =>
        module.id === moduleId
          ? { ...module, completed: true, progress: 100 }
          : module
      )
      const completedCount = updatedModules.filter(m => m.completed).length
      const overallProgress = Math.round((completedCount / state.totalCount) * 100)
      
      return {
        modules: updatedModules,
        completedCount,
        overallProgress,
      }
    })
  },

  updateProgress: (moduleId, progress) => {
    set((state) => {
      const updatedModules = state.modules.map((module) =>
        module.id === moduleId
          ? { ...module, progress, completed: progress >= 100 }
          : module
      )
      const completedCount = updatedModules.filter(m => m.completed).length
      const overallProgress = Math.round((completedCount / state.totalCount) * 100)
      
      return {
        modules: updatedModules,
        completedCount,
        overallProgress,
      }
    })
  },

  resetProgress: () => {
    set(() => ({
      modules: [
        { id: 1, title: 'FedRAMP Basics', completed: false, progress: 0 },
        { id: 2, title: 'Security Controls', completed: false, progress: 0 },
        { id: 3, title: 'Assessment Process', completed: false, progress: 0 },
        { id: 4, title: 'Compliance Management', completed: false, progress: 0 },
      ],
      completedCount: 0,
      overallProgress: 0,
    }))
  },
})) 