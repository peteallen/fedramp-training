import { vi } from 'vitest'
import type { TrainingState } from '@/stores/trainingStore'

// Helper to create a mock training module
export const createMockModule = (overrides?: Partial<any>) => ({
  id: 1,
  title: 'Module 1',
  description: 'Test module',
  category: 'Test',
  estimatedTime: '10 minutes',
  difficulty: 'Beginner',
  objectives: [],
  content: [],
  quiz: [],
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
    getModulesByCategory: vi.fn(),
    getModulesByDifficulty: vi.fn(),
    clearAllData: vi.fn(),
    ...initialState
  }

  return vi.fn((selector?: (state: TrainingState) => any) => {
    return selector ? selector(defaultState) : defaultState
  })
}