import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { CertificateUserData, GeneratedCertificate } from '../types/certificate'
import { useCertificateStore, extractCompletionData, isCertificateAvailable, getCompletionSummary } from './certificateStore'
import { useTrainingStore } from './trainingStore'

describe('useCertificateStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useCertificateStore.getState().clearData()
  })

  it('should initialize with default state', () => {
    const state = useCertificateStore.getState()
    
    expect(state.savedUserData).toBeNull()
    expect(state.generatedCertificates).toEqual([])
    expect(state.isGenerating).toBe(false)
    expect(state.showModal).toBe(false)
  })

  it('should save user data', () => {
    const userData: CertificateUserData = {
      fullName: 'John Doe',
      email: 'john.doe@example.com'
    }

    useCertificateStore.getState().saveUserData(userData)
    
    const state = useCertificateStore.getState()
    expect(state.savedUserData).toEqual(userData)
  })

  it('should add generated certificate', () => {
    const certificate: GeneratedCertificate = {
      id: 'cert-123',
      issueDate: new Date('2024-01-01'),
      userData: { fullName: 'John Doe' },
      completionSnapshot: {
        modules: [],
        overallCompletionDate: new Date('2024-01-01'),
        totalTimeSpent: 120,
        overallScore: 95
      }
    }

    useCertificateStore.getState().addGeneratedCertificate(certificate)
    
    const state = useCertificateStore.getState()
    expect(state.generatedCertificates).toHaveLength(1)
    expect(state.generatedCertificates[0]).toEqual(certificate)
  })

  it('should set generating state', () => {
    useCertificateStore.getState().setGenerating(true)
    expect(useCertificateStore.getState().isGenerating).toBe(true)

    useCertificateStore.getState().setGenerating(false)
    expect(useCertificateStore.getState().isGenerating).toBe(false)
  })

  it('should set modal visibility', () => {
    useCertificateStore.getState().setShowModal(true)
    expect(useCertificateStore.getState().showModal).toBe(true)

    useCertificateStore.getState().setShowModal(false)
    expect(useCertificateStore.getState().showModal).toBe(false)
  })

  it('should clear all data', () => {
    // Set up some data first
    const userData: CertificateUserData = { fullName: 'John Doe' }
    const certificate: GeneratedCertificate = {
      id: 'cert-123',
      issueDate: new Date(),
      userData,
      completionSnapshot: {
        modules: [],
        overallCompletionDate: new Date(),
        totalTimeSpent: 120,
        overallScore: 95
      }
    }

    const store = useCertificateStore.getState()
    store.saveUserData(userData)
    store.addGeneratedCertificate(certificate)
    store.setGenerating(true)
    store.setShowModal(true)

    // Clear data
    store.clearData()

    // Verify everything is reset
    const state = useCertificateStore.getState()
    expect(state.savedUserData).toBeNull()
    expect(state.generatedCertificates).toEqual([])
    expect(state.isGenerating).toBe(false)
    expect(state.showModal).toBe(false)
  })

  it('should add multiple certificates', () => {
    const cert1: GeneratedCertificate = {
      id: 'cert-1',
      issueDate: new Date('2024-01-01'),
      userData: { fullName: 'John Doe' },
      completionSnapshot: {
        modules: [],
        overallCompletionDate: new Date('2024-01-01'),
        totalTimeSpent: 120,
        overallScore: 95
      }
    }

    const cert2: GeneratedCertificate = {
      id: 'cert-2',
      issueDate: new Date('2024-01-02'),
      userData: { fullName: 'Jane Smith' },
      completionSnapshot: {
        modules: [],
        overallCompletionDate: new Date('2024-01-02'),
        totalTimeSpent: 150,
        overallScore: 98
      }
    }

    const store = useCertificateStore.getState()
    store.addGeneratedCertificate(cert1)
    store.addGeneratedCertificate(cert2)

    const state = useCertificateStore.getState()
    expect(state.generatedCertificates).toHaveLength(2)
    expect(state.generatedCertificates[0]).toEqual(cert1)
    expect(state.generatedCertificates[1]).toEqual(cert2)
  })
})

describe('Certificate Integration Functions', () => {
  beforeEach(() => {
    // Clear both stores before each test
    useCertificateStore.getState().clearData()
    useTrainingStore.getState().resetProgress()
  })

  describe('extractCompletionData', () => {
    it('should return null when training is not complete', () => {
      // Set up incomplete training state
      const trainingStore = useTrainingStore.getState()
      
      // Mock incomplete state
      vi.spyOn(useTrainingStore, 'getState').mockReturnValue({
        ...trainingStore,
        overallProgress: 50,
        modules: []
      })

      const result = extractCompletionData()
      expect(result).toBeNull()
    })

    it('should return null when no modules are completed', () => {
      const trainingStore = useTrainingStore.getState()
      
      vi.spyOn(useTrainingStore, 'getState').mockReturnValue({
        ...trainingStore,
        overallProgress: 100,
        modules: []
      })

      const result = extractCompletionData()
      expect(result).toBeNull()
    })

    it('should extract completion data when training is complete', () => {
      const mockModules = [
        {
          id: 1,
          title: 'Module 1',
          completed: true,
          lastAccessed: new Date('2024-01-01'),
          quizScore: 85,
          timeSpent: 60,
          description: 'Test module',
          requiredForMembers: ['Pete'],
          objectives: [],
          sections: [],
          progress: 100
        },
        {
          id: 2,
          title: 'Module 2',
          completed: true,
          lastAccessed: new Date('2024-01-02'),
          quizScore: 95,
          timeSpent: 90,
          description: 'Test module 2',
          requiredForMembers: ['Dave'],
          objectives: [],
          sections: [],
          progress: 100
        }
      ]

      const trainingStore = useTrainingStore.getState()
      vi.spyOn(useTrainingStore, 'getState').mockReturnValue({
        ...trainingStore,
        overallProgress: 100,
        modules: mockModules
      })

      const result = extractCompletionData()
      
      expect(result).not.toBeNull()
      if (result) {
        expect(result.modules).toHaveLength(2)
        expect(result.modules[0]).toEqual({
          id: 1,
          title: 'Module 1',
          completionDate: new Date('2024-01-01'),
          score: 85,
          timeSpent: 60
        })
        expect(result.totalTimeSpent).toBe(150)
        expect(result.overallScore).toBe(90) // Average of 85 and 95
        expect(result.overallCompletionDate).toEqual(new Date('2024-01-02'))
      }
    })

    it('should handle modules without scores', () => {
      const mockModules = [
        {
          id: 1,
          title: 'Module 1',
          completed: true,
          lastAccessed: new Date('2024-01-01'),
          timeSpent: 60,
          description: 'Test module',
          requiredForMembers: ['Pete'],
          objectives: [],
          sections: [],
          progress: 100
        }
      ]

      const trainingStore = useTrainingStore.getState()
      vi.spyOn(useTrainingStore, 'getState').mockReturnValue({
        ...trainingStore,
        overallProgress: 100,
        modules: mockModules
      })

      const result = extractCompletionData()
      
      expect(result).not.toBeNull()
      if (result) {
        expect(result.overallScore).toBe(0)
      }
    })
  })

  describe('isCertificateAvailable', () => {
    it('should return false when training is incomplete', () => {
      const trainingStore = useTrainingStore.getState()
      vi.spyOn(useTrainingStore, 'getState').mockReturnValue({
        ...trainingStore,
        overallProgress: 75
      })

      expect(isCertificateAvailable()).toBe(false)
    })

    it('should return true when training is complete', () => {
      const trainingStore = useTrainingStore.getState()
      vi.spyOn(useTrainingStore, 'getState').mockReturnValue({
        ...trainingStore,
        overallProgress: 100
      })

      expect(isCertificateAvailable()).toBe(true)
    })
  })

  describe('getCompletionSummary', () => {
    it('should return completion summary', () => {
      const trainingStore = useTrainingStore.getState()
      vi.spyOn(useTrainingStore, 'getState').mockReturnValue({
        ...trainingStore,
        completedCount: 2,
        totalCount: 3,
        overallProgress: 67
      })

      const summary = getCompletionSummary()
      
      expect(summary).toEqual({
        completedCount: 2,
        totalCount: 3,
        overallProgress: 67,
        isComplete: false
      })
    })

    it('should indicate completion when progress is 100%', () => {
      const trainingStore = useTrainingStore.getState()
      vi.spyOn(useTrainingStore, 'getState').mockReturnValue({
        ...trainingStore,
        completedCount: 3,
        totalCount: 3,
        overallProgress: 100
      })

      const summary = getCompletionSummary()
      
      expect(summary.isComplete).toBe(true)
    })
  })
})