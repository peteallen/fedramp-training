import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ContentItem {
  type: string
  title?: string
  text?: string
  content?: string | ContentItem[]
  style?: string
  items?: string[]
}

interface ModuleSection {
  id: string
  title: string
  content: ContentItem[]
}


interface TrainingModule {
  id: number
  title: string
  description: string
  requiredForMembers: string[]
  objectives: string[]
  sections: ModuleSection[]
  completed: boolean
  progress: number
  lastAccessed?: Date
  timeSpent?: number
  quizScore?: number
  completionDate?: Date
}

export interface TrainingState {
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
  clearAllData: () => void
}

// Helper function to load module metadata
const loadModuleMetadata = async (moduleId: number) => {
  try {
    const response = await fetch(`/src/data/modules/${moduleId}/module.json`)
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

// Helper function to load a module section
const loadModuleSection = async (moduleId: number, sectionId: string) => {
  try {
    const response = await fetch(`/src/data/modules/${moduleId}/sections/${sectionId}.json`)
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

// Helper function to load all modules with their sections
const loadAllModules = async (): Promise<TrainingModule[]> => {
  const modules: TrainingModule[] = []
  
  // Load all available modules
  const moduleIds = [1, 2, 3, 4] // Module 1: Foundation Security Training, Module 2: Incident Recognition and Reporting, Module 3: Basic Response Procedures, Module 4: Detection Infrastructure
  
  for (const moduleId of moduleIds) {
    const metadata = await loadModuleMetadata(moduleId)
    if (!metadata) continue
    
    const sections: ModuleSection[] = []
    
    // Load each section defined in metadata
    for (const sectionId of metadata.sections || []) {
      const sectionData = await loadModuleSection(moduleId, sectionId)
      if (sectionData) {
        sections.push(sectionData)
      }
    }
    
    // Create the module with default progress values
    modules.push({
      id: moduleId,
      title: metadata.title,
      description: metadata.description,
      requiredForMembers: metadata.requiredForMembers || [],
      objectives: metadata.objectives || [],
      sections,
      completed: false,
      progress: 0
    })
  }
  
  return modules
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
        const state = get();
        if (state.initialized) return;

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
                    completionDate: existing.completionDate || (existing.completed && existing.lastAccessed ? existing.lastAccessed : undefined)
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
          // eslint-disable-next-line no-console
          console.error('Failed to load modules:', error)
          set({ initialized: true })
        }
      },

      completeModule: (moduleId: number) => {
        set((state) => {
          const updatedModules = state.modules.map((module) =>
            module.id === moduleId
              ? { ...module, completed: true, progress: 100, lastAccessed: new Date(), completionDate: module.completionDate || new Date() }
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
                  lastAccessed: new Date(),
                  completionDate: (progress >= 100 && !module.completed) ? new Date() : module.completionDate
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
        set((state: TrainingState) => {
          const resetModules = state.modules.map((module: TrainingModule) => ({
            ...module,
            completed: false,
            progress: 0,
            lastAccessed: undefined,
            timeSpent: 0,
            quizScore: undefined,
            completionDate: undefined
          }))
          
          return {
            modules: resetModules,
            completedCount: 0,
            overallProgress: 0,
          }
        })
      },

      resetModule: (moduleId: number) => {
        set((state: TrainingState) => {
          const updatedModules = state.modules.map((module: TrainingModule) =>
            module.id === moduleId
              ? { 
                  ...module, 
                  completed: false, 
                  progress: 0,
                  lastAccessed: undefined,
                  timeSpent: 0,
                  quizScore: undefined,
                  completionDate: undefined
                }
              : module
          )
          const completedCount = updatedModules.filter((m: TrainingModule) => m.completed).length
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
          // eslint-disable-next-line no-console
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
      partialize: (state: TrainingState) => ({
        // Persist only progress-related fields to keep storage small and
        // ensure content can be refreshed from disk on reload.
        modules: state.modules.map((m: TrainingModule) => ({
          id: m.id,
          completed: m.completed,
          progress: m.progress,
          lastAccessed: m.lastAccessed,
          timeSpent: m.timeSpent,
          quizScore: m.quizScore,
          completionDate: m.completionDate
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