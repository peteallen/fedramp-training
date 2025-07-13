import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTrainingStore } from './trainingStore'
import { act, renderHook, waitFor } from '@testing-library/react'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

// Mock the modules index
vi.mock('../data/modules.json', () => ({
  default: {
    modules: [
      { id: 1, file: '1.json' },
      { id: 2, file: '2.json' }
    ]
  }
}))

// Mock individual module files
vi.mock('../data/modules/1.json', () => ({
  default: {
    id: 1,
    title: 'Test Module 1',
    description: 'Test description 1',
    category: 'fundamentals',
    estimatedTime: '30 minutes',
    difficulty: 'beginner',
    objectives: ['Objective 1'],
    content: [{ type: 'introduction', title: 'Intro', content: 'Content' }],
    quiz: [{ question: 'Question?', options: ['A', 'B'], correctAnswer: 0 }]
  }
}))

vi.mock('../data/modules/2.json', () => ({
  default: {
    id: 2,
    title: 'Test Module 2',
    description: 'Test description 2',
    category: 'security',
    estimatedTime: '45 minutes',
    difficulty: 'intermediate',
    objectives: ['Objective 2'],
    content: [{ type: 'section', title: 'Section', content: 'Content' }],
    quiz: [{ question: 'Question 2?', options: ['C', 'D'], correctAnswer: 1 }]
  }
}))

describe('Training Store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset Zustand store
    useTrainingStore.setState({
      modules: [],
      completedCount: 0,
      totalCount: 0,
      overallProgress: 0,
      initialized: false,
    })
  })

  describe('Module Initialization', () => {
    it('should initialize modules from JSON data', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      await act(async () => {
        await result.current.initializeModules()
      })

      expect(result.current.modules).toHaveLength(2)
      expect(result.current.totalCount).toBe(2)
      expect(result.current.initialized).toBe(true)
      expect(result.current.modules[0].title).toBe('Test Module 1')
      expect(result.current.modules[1].title).toBe('Test Module 2')
    })

    it('should not reinitialize if already initialized', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      await act(async () => {
        await result.current.initializeModules()
      })

      const firstModules = result.current.modules
      
      await act(async () => {
        await result.current.initializeModules()
      })

      expect(result.current.modules).toBe(firstModules)
    })

    it('should set all modules to initial state', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      await act(async () => {
        await result.current.initializeModules()
      })

      result.current.modules.forEach(module => {
        expect(module.completed).toBe(false)
        expect(module.progress).toBe(0)
        expect(module.lastAccessed).toBeUndefined()
        expect(module.timeSpent).toBe(0)
        expect(module.quizScore).toBeUndefined()
      })
    })
  })

  describe('Progress Management', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useTrainingStore())
      await act(async () => {
        await result.current.initializeModules()
      })
    })

    it('should update module progress', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      // Wait for initialization
      await waitFor(() => expect(result.current.modules.length).toBeGreaterThan(0))
      
      act(() => {
        result.current.updateProgress(1, 50)
      })

      const module = result.current.modules.find(m => m.id === 1)
      expect(module?.progress).toBe(50)
      expect(module?.completed).toBe(false)
      expect(module?.lastAccessed).toBeInstanceOf(Date)
    })

    it('should mark module as completed when progress reaches 100%', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      await waitFor(() => expect(result.current.modules.length).toBeGreaterThan(0))
      
      act(() => {
        result.current.updateProgress(1, 100)
      })

      const module = result.current.modules.find(m => m.id === 1)
      expect(module?.progress).toBe(100)
      expect(module?.completed).toBe(true)
    })

    it('should complete module directly', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      await waitFor(() => expect(result.current.modules.length).toBeGreaterThan(0))
      
      act(() => {
        result.current.completeModule(1)
      })

      const module = result.current.modules.find(m => m.id === 1)
      expect(module?.progress).toBe(100)
      expect(module?.completed).toBe(true)
      expect(module?.lastAccessed).toBeInstanceOf(Date)
    })

    it('should update overall progress correctly', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      await waitFor(() => expect(result.current.modules.length).toBeGreaterThan(0))
      
      act(() => {
        result.current.completeModule(1)
      })

      expect(result.current.completedCount).toBe(1)
      expect(result.current.overallProgress).toBe(50) // 1 out of 2 modules

      act(() => {
        result.current.completeModule(2)
      })

      expect(result.current.completedCount).toBe(2)
      expect(result.current.overallProgress).toBe(100) // 2 out of 2 modules
    })
  })

  describe('Module Access and Time Tracking', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useTrainingStore())
      await act(async () => {
        await result.current.initializeModules()
      })
    })

    it('should update module access time', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      await waitFor(() => expect(result.current.modules.length).toBeGreaterThan(0))
      
      act(() => {
        result.current.updateModuleAccess(1)
      })

      const module = result.current.modules.find(m => m.id === 1)
      expect(module?.lastAccessed).toBeInstanceOf(Date)
    })

    it('should track time spent on modules', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      await waitFor(() => expect(result.current.modules.length).toBeGreaterThan(0))
      
      act(() => {
        result.current.updateTimeSpent(1, 30)
      })

      const module = result.current.modules.find(m => m.id === 1)
      expect(module?.timeSpent).toBe(30)

      act(() => {
        result.current.updateTimeSpent(1, 20)
      })

      const updatedModule = result.current.modules.find(m => m.id === 1)
      expect(updatedModule?.timeSpent).toBe(50)
    })

    it('should update quiz scores', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      await waitFor(() => expect(result.current.modules.length).toBeGreaterThan(0))
      
      act(() => {
        result.current.updateQuizScore(1, 85)
      })

      const module = result.current.modules.find(m => m.id === 1)
      expect(module?.quizScore).toBe(85)
    })
  })

  describe('Reset Functionality', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useTrainingStore())
      await act(async () => {
        await result.current.initializeModules()
      })
      await waitFor(() => expect(result.current.modules.length).toBeGreaterThan(0))
      act(() => {
        result.current.completeModule(1)
        result.current.updateProgress(2, 50)
        result.current.updateTimeSpent(1, 30)
        result.current.updateQuizScore(1, 90)
      })
    })

    it('should reset all progress', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      act(() => {
        result.current.resetProgress()
      })

      expect(result.current.completedCount).toBe(0)
      expect(result.current.overallProgress).toBe(0)
      
      result.current.modules.forEach(module => {
        expect(module.completed).toBe(false)
        expect(module.progress).toBe(0)
        expect(module.lastAccessed).toBeUndefined()
        expect(module.timeSpent).toBe(0)
        expect(module.quizScore).toBeUndefined()
      })
    })

    it('should reset individual module', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      act(() => {
        result.current.resetModule(1)
      })

      const module1 = result.current.modules.find(m => m.id === 1)
      const module2 = result.current.modules.find(m => m.id === 2)
      
      expect(module1?.completed).toBe(false)
      expect(module1?.progress).toBe(0)
      expect(module1?.timeSpent).toBe(0)
      expect(module1?.quizScore).toBeUndefined()
      
      // Module 2 should still have progress
      expect(module2?.progress).toBe(50)
      expect(result.current.completedCount).toBe(0)
    })

    it('should clear all data including localStorage', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      await act(async () => {
        await result.current.clearAllData()
      })

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('training-storage')
      expect(result.current.completedCount).toBe(0)
      expect(result.current.overallProgress).toBe(0)
      expect(result.current.modules).toHaveLength(2)
      expect(result.current.initialized).toBe(true)
      
      result.current.modules.forEach(module => {
        expect(module.completed).toBe(false)
        expect(module.progress).toBe(0)
      })
    })
  })

  describe('Module Retrieval', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useTrainingStore())
      await act(async () => {
        await result.current.initializeModules()
      })
      await waitFor(() => expect(result.current.modules.length).toBeGreaterThan(0))
    })

    it('should get module by ID', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      const module = result.current.getModuleById(1)
      expect(module?.id).toBe(1)
      expect(module?.title).toBe('Test Module 1')
    })

    it('should return undefined for non-existent module ID', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      const module = result.current.getModuleById(999)
      expect(module).toBeUndefined()
    })

    it('should get modules by category', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      const fundamentalsModules = result.current.getModulesByCategory('fundamentals')
      expect(fundamentalsModules).toHaveLength(1)
      expect(fundamentalsModules[0].id).toBe(1)
      
      const securityModules = result.current.getModulesByCategory('security')
      expect(securityModules).toHaveLength(1)
      expect(securityModules[0].id).toBe(2)
    })

    it('should get modules by difficulty', async () => {
      const { result } = renderHook(() => useTrainingStore())
      
      const beginnerModules = result.current.getModulesByDifficulty('beginner')
      expect(beginnerModules).toHaveLength(1)
      expect(beginnerModules[0].id).toBe(1)
      
      const intermediateModules = result.current.getModulesByDifficulty('intermediate')
      expect(intermediateModules).toHaveLength(1)
      expect(intermediateModules[0].id).toBe(2)
    })
  })
})