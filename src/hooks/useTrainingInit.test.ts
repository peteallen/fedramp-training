import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTrainingStore } from '@/stores/trainingStore'
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
    mockUseTrainingStore.mockReturnValue({
      initializeModules: mockInitializeModules,
      initialized: false,
    })
  })

  it('should call initializeModules when not initialized', () => {
    renderHook(() => useTrainingInit())
    
    expect(mockInitializeModules).toHaveBeenCalledTimes(1)
  })

  it('should not call initializeModules when already initialized', () => {
    mockUseTrainingStore.mockReturnValue({
      initializeModules: mockInitializeModules,
      initialized: true,
    })
    
    renderHook(() => useTrainingInit())
    
    expect(mockInitializeModules).not.toHaveBeenCalled()
  })

  it('should return initialized state', () => {
    mockUseTrainingStore.mockReturnValue({
      initializeModules: mockInitializeModules,
      initialized: true,
    })
    
    const { result } = renderHook(() => useTrainingInit())
    
    expect(result.current.initialized).toBe(true)
  })

  it('should handle changes in initialized state', () => {
    const { result, rerender } = renderHook(() => useTrainingInit())
    
    expect(result.current.initialized).toBe(false)
    
    // Mock store returning initialized: true
    mockUseTrainingStore.mockReturnValue({
      initializeModules: mockInitializeModules,
      initialized: true,
    })
    
    rerender()
    
    expect(result.current.initialized).toBe(true)
  })

  it('should handle initializeModules function changes', () => {
    const newInitializeModules = vi.fn()
    
    const { rerender } = renderHook(() => useTrainingInit())
    
    expect(mockInitializeModules).toHaveBeenCalledTimes(1)
    
    // Mock store returning new function
    mockUseTrainingStore.mockReturnValue({
      initializeModules: newInitializeModules,
      initialized: false,
    })
    
    rerender()
    
    expect(newInitializeModules).toHaveBeenCalledTimes(1)
  })
})