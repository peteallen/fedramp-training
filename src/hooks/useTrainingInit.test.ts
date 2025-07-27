import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTrainingStore } from '@/stores/trainingStore'
import { createMockTrainingStore } from '@/test-utils/mockStores'
import { useTrainingInit } from './useTrainingInit'

// Mock the training store
vi.mock('@/stores/trainingStore', () => ({
  useTrainingStore: vi.fn(),
}))

describe('useTrainingInit', () => {
  const mockInitializeModules = vi.fn()
  const mockUseTrainingStore = vi.mocked(useTrainingStore)

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseTrainingStore.mockImplementation(createMockTrainingStore({
      initializeModules: mockInitializeModules,
      initialized: false,
    }))
  })

  it('should call initializeModules when not initialized', () => {
    renderHook(() => useTrainingInit())
    
    expect(mockInitializeModules).toHaveBeenCalledTimes(1)
  })

  it('should not call initializeModules when already initialized', () => {
    mockUseTrainingStore.mockImplementation(createMockTrainingStore({
      initializeModules: mockInitializeModules,
      initialized: true,
    }))
    
    renderHook(() => useTrainingInit())
    
    expect(mockInitializeModules).not.toHaveBeenCalled()
  })

  it('should return initialized state', () => {
    mockUseTrainingStore.mockImplementation(createMockTrainingStore({
      initializeModules: mockInitializeModules,
      initialized: true,
    }))
    
    const { result } = renderHook(() => useTrainingInit())
    
    expect(result.current.initialized).toBe(true)
  })

  it('should handle changes in initialized state', () => {
    const { result, rerender } = renderHook(() => useTrainingInit())
    
    expect(result.current.initialized).toBe(false)
    
    // Mock store returning initialized: true
    mockUseTrainingStore.mockImplementation(createMockTrainingStore({
      initializeModules: mockInitializeModules,
      initialized: true,
    }))
    
    rerender()
    
    expect(result.current.initialized).toBe(true)
  })

  it('should handle initializeModules function changes', () => {
    const newInitializeModules = vi.fn()
    
    const { rerender } = renderHook(() => useTrainingInit())
    
    expect(mockInitializeModules).toHaveBeenCalledTimes(1)
    
    // Mock store returning new function
    mockUseTrainingStore.mockImplementation(createMockTrainingStore({
      initializeModules: newInitializeModules,
      initialized: false,
    }))
    
    rerender()
    
    expect(newInitializeModules).toHaveBeenCalledTimes(1)
  })
})