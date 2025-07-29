import { vi } from 'vitest'
import type { TrainingState } from '@/stores/trainingStore'

interface TrainingModule {
  id: number
  title: string
  description: string
  requiredForMembers: string[]
  objectives: string[]
  sections: unknown[]
  estimatedDuration?: number
  completed: boolean
  progress: number
  lastAccessed?: Date
  timeSpent?: number
  quizScore?: number
  completionDate?: Date
}

// Helper to create a mock training module
export const createMockModule = (overrides?: Partial<TrainingModule>) => ({
  id: 1,
  title: 'Module 1',
  description: 'Test module',
  requiredForMembers: ['Pete', 'Dave'],
  objectives: [],
  sections: [],
  completed: false,
  progress: 0,
  ...overrides
})

// Helper to create a properly typed mock for useTrainingStore
export const createMockTrainingStore = (initialState?: Partial<TrainingState>) => {
  const defaultState: TrainingState = {
    modules: [],
    completedCount: 0,
    totalCount: 0,
    overallProgress: 0,
    initialized: false,
    initializeModules: vi.fn(),
    completeModule: vi.fn(),
    updateProgress: vi.fn(),
    updateModuleAccess: vi.fn(),
    updateTimeSpent: vi.fn(),
    updateQuizScore: vi.fn(),
    resetProgress: vi.fn(),
    resetModule: vi.fn(),
    getModuleById: vi.fn(),
    clearAllData: vi.fn(),
    ...initialState
  }

  return vi.fn(<T>(selector?: (state: TrainingState) => T) => {
    return selector ? selector(defaultState) : defaultState
  })
}