import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import modulesData from '../data/modules.json'

interface ModuleContent {
  type: string
  title: string
  content: string
}

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

interface TrainingModule {
  id: number
  title: string
  description: string
  category: string
  estimatedTime: string
  difficulty: string
  objectives: string[]
  content: ModuleContent[]
  quiz: QuizQuestion[]
  completed: boolean
  progress: number
  lastAccessed?: Date
  timeSpent?: number
  quizScore?: number
}

interface TrainingState {
  modules: TrainingModule[]
  completedCount: number
  totalCount: number
  overallProgress: number
  initialized: boolean
  
  // Actions
  initializeModules: () => void
  completeModule: (moduleId: number) => void
  updateProgress: (moduleId: number, progress: number) => void
  updateModuleAccess: (moduleId: number) => void
  updateTimeSpent: (moduleId: number, timeSpent: number) => void
  updateQuizScore: (moduleId: number, score: number) => void
  resetProgress: () => void
  resetModule: (moduleId: number) => void
  getModuleById: (moduleId: number) => TrainingModule | undefined
  getModulesByCategory: (category: string) => TrainingModule[]
  getModulesByDifficulty: (difficulty: string) => TrainingModule[]
  clearAllData: () => void
}

// Helper function to convert JSON modules to TrainingModule format
const convertJSONModules = (jsonModules: any[]): TrainingModule[] => {
  return jsonModules.map(module => ({
    ...module,
    completed: false,
    progress: 0,
    lastAccessed: undefined,
    timeSpent: 0,
    quizScore: undefined
  }))
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      modules: [],
      completedCount: 0,
      totalCount: 0,
      overallProgress: 0,
      initialized: false,

      initializeModules: () => {
        const state = get()
        if (!state.initialized) {
          const modules = convertJSONModules(modulesData.modules)
          set({
            modules,
            totalCount: modules.length,
            initialized: true
          })
        }
      },

      completeModule: (moduleId: number) => {
        set((state) => {
          const updatedModules = state.modules.map((module) =>
            module.id === moduleId
              ? { ...module, completed: true, progress: 100, lastAccessed: new Date() }
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

      updateProgress: (moduleId: number, progress: number) => {
        set((state) => {
          const updatedModules = state.modules.map((module) =>
            module.id === moduleId
              ? { 
                  ...module, 
                  progress, 
                  completed: progress >= 100,
                  lastAccessed: new Date()
                }
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

      updateModuleAccess: (moduleId: number) => {
        set((state) => ({
          modules: state.modules.map((module) =>
            module.id === moduleId
              ? { ...module, lastAccessed: new Date() }
              : module
          )
        }))
      },

      updateTimeSpent: (moduleId: number, timeSpent: number) => {
        set((state) => ({
          modules: state.modules.map((module) =>
            module.id === moduleId
              ? { ...module, timeSpent: (module.timeSpent || 0) + timeSpent }
              : module
          )
        }))
      },

      updateQuizScore: (moduleId: number, score: number) => {
        set((state) => ({
          modules: state.modules.map((module) =>
            module.id === moduleId
              ? { ...module, quizScore: score }
              : module
          )
        }))
      },

      resetProgress: () => {
        set((state) => {
          const resetModules = state.modules.map(module => ({
            ...module,
            completed: false,
            progress: 0,
            lastAccessed: undefined,
            timeSpent: 0,
            quizScore: undefined
          }))
          
          return {
            modules: resetModules,
            completedCount: 0,
            overallProgress: 0,
          }
        })
      },

      resetModule: (moduleId: number) => {
        set((state) => {
          const updatedModules = state.modules.map((module) =>
            module.id === moduleId
              ? { 
                  ...module, 
                  completed: false, 
                  progress: 0,
                  lastAccessed: undefined,
                  timeSpent: 0,
                  quizScore: undefined
                }
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

      getModuleById: (moduleId: number) => {
        return get().modules.find(module => module.id === moduleId)
      },

      getModulesByCategory: (category: string) => {
        return get().modules.filter(module => module.category === category)
      },

      getModulesByDifficulty: (difficulty: string) => {
        return get().modules.filter(module => module.difficulty === difficulty)
      },

      clearAllData: () => {
        // Clear localStorage
        localStorage.removeItem('training-storage')
        
        // Reset state to initial values
        const modules = convertJSONModules(modulesData.modules)
        set({
          modules,
          completedCount: 0,
          totalCount: modules.length,
          overallProgress: 0,
          initialized: true
        })
      },
    }),
    {
      name: 'training-storage',
      partialize: (state) => ({
        modules: state.modules,
        completedCount: state.completedCount,
        totalCount: state.totalCount,
        overallProgress: state.overallProgress,
        initialized: state.initialized
      }),
    }
  )
) 