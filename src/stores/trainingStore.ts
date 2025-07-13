import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import modulesIndex from '../data/modules.json'

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
  initializeModules: () => Promise<void>
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

// Helper function to load a single module from its file
const loadModule = async (moduleInfo: { id: number; file: string }): Promise<TrainingModule> => {
  // Import the module with explicit file extension for Vite compatibility
  let moduleData;
  switch (moduleInfo.file) {
    case '1.json':
      moduleData = await import('../data/modules/1.json');
      break;
    case '2.json':
      moduleData = await import('../data/modules/2.json');
      break;
    case '3.json':
      moduleData = await import('../data/modules/3.json');
      break;
    default:
      throw new Error(`Unknown module file: ${moduleInfo.file}`);
  }
  
  return {
    ...moduleData.default,
    completed: false,
    progress: 0,
    lastAccessed: undefined,
    timeSpent: 0,
    quizScore: undefined
  }
}

// Helper function to load all modules
const loadAllModules = async (): Promise<TrainingModule[]> => {
  const modulePromises = modulesIndex.modules.map(moduleInfo => loadModule(moduleInfo))
  return Promise.all(modulePromises)
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      modules: [],
      completedCount: 0,
      totalCount: 0,
      overallProgress: 0,
      initialized: false,

      initializeModules: async () => {
        try {
          const freshModules = await loadAllModules()

          set((state) => {
            // Merge progress data from any existing (possibly persisted) modules
            const mergedModules = freshModules.map((fresh) => {
              const existing = state.modules.find((m) => m.id === fresh.id)
              return existing
                ? {
                    ...fresh,
                    completed: existing.completed,
                    progress: existing.progress,
                    lastAccessed: existing.lastAccessed,
                    timeSpent: existing.timeSpent,
                    quizScore: existing.quizScore,
                  }
                : fresh
            })

            const completedCount = mergedModules.filter((m) => m.completed).length
            const overallProgress = Math.round((completedCount / mergedModules.length) * 100)

            return {
              modules: mergedModules,
              totalCount: mergedModules.length,
              completedCount,
              overallProgress,
              initialized: true,
            }
          })
        } catch (error) {
          console.error('Failed to load modules:', error)
          set({ initialized: true })
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

      clearAllData: async () => {
        // Clear localStorage
        localStorage.removeItem('training-storage')
        
        // Reset state to initial values
        try {
          const modules = await loadAllModules()
          set({
            modules,
            completedCount: 0,
            totalCount: modules.length,
            overallProgress: 0,
            initialized: true
          })
        } catch (error) {
          console.error('Failed to reload modules:', error)
          set({
            modules: [],
            completedCount: 0,
            totalCount: 0,
            overallProgress: 0,
            initialized: true
          })
        }
      },
    }),
    {
      name: 'training-storage',
      partialize: (state) => ({
        // Persist only progress-related fields to keep storage small and
        // ensure content can be refreshed from disk on reload.
        modules: state.modules.map((m) => ({
          id: m.id,
          completed: m.completed,
          progress: m.progress,
          lastAccessed: m.lastAccessed,
          timeSpent: m.timeSpent,
          quizScore: m.quizScore,
        })),
        completedCount: state.completedCount,
        totalCount: state.totalCount,
        overallProgress: state.overallProgress,
        // NOTE: `initialized` intentionally omitted so app always reloads
        // module content on startup.
      }),
    }
  )
)

// --- Hot-reload support for module JSON files (dev only) ---
if (import.meta.hot) {
  // Helper to register an HMR accept handler for a single JSON file
  const acceptUpdate = (path: string, moduleId: number) => {
    // Vite will re-import the updated JSON and pass it to the callback
    import.meta.hot!.accept(path, (mod: any) => {
      if (!mod?.default) return
      // Merge the fresh JSON content into the existing module while
      // preserving runtime fields like progress, completed, etc.
      useTrainingStore.setState((state) => ({
        modules: state.modules.map((m) =>
          m.id === moduleId ? { ...m, ...mod.default } : m
        ),
      }))
    })
  }

  // Register handlers for each known module file
  acceptUpdate('../data/modules/1.json', 1)
  acceptUpdate('../data/modules/2.json', 2)
  acceptUpdate('../data/modules/3.json', 3)
} 