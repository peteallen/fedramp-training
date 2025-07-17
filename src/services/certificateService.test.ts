import { describe, it, expect, vi } from 'vitest'
import { CertificateService } from './certificateService'
import type { CertificateUserData } from '../types/certificate'

// Mock crypto for testing
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid-123'),
    getRandomValues: vi.fn((array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    })
  }
})

describe('CertificateService', () => {
  describe('generateCertificateId', () => {
    it('should generate a UUID when crypto.randomUUID is available', () => {
      const id = CertificateService.generateCertificateId()
      expect(id).toBe('test-uuid-123')
    })

    it('should generate a hex string when crypto.randomUUID is not available', () => {
      const originalRandomUUID = globalThis.crypto.randomUUID
      // @ts-expect-error - Testing fallback behavior
      globalThis.crypto.randomUUID = undefined

      const id = CertificateService.generateCertificateId()
      expect(id).toMatch(/^[0-9a-f]{32}$/) // 32 hex characters

      globalThis.crypto.randomUUID = originalRandomUUID
    })
  })

  describe('validateUserData', () => {
    it('should validate correct user data', () => {
      const userData: CertificateUserData = {
        fullName: 'John Doe',
        email: 'john@example.com'
      }

      const result = CertificateService.validateUserData(userData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject empty full name', () => {
      const userData: CertificateUserData = {
        fullName: '',
        email: 'john@example.com'
      }

      const result = CertificateService.validateUserData(userData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Full name is required')
    })

    it('should reject full name that is too long', () => {
      const userData: CertificateUserData = {
        fullName: 'a'.repeat(101),
        email: 'john@example.com'
      }

      const result = CertificateService.validateUserData(userData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Full name must be less than 100 characters')
    })

    it('should reject full name with invalid characters', () => {
      const userData: CertificateUserData = {
        fullName: 'John@Doe#123',
        email: 'john@example.com'
      }

      const result = CertificateService.validateUserData(userData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Full name can only contain letters, spaces, hyphens, apostrophes, and periods')
    })

    it('should reject invalid email format', () => {
      const userData: CertificateUserData = {
        fullName: 'John Doe',
        email: 'invalid-email'
      }

      const result = CertificateService.validateUserData(userData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Please enter a valid email address')
    })

    it('should accept valid full name with special characters', () => {
      const userData: CertificateUserData = {
        fullName: "Mary O'Connor-Smith Jr."
      }

      const result = CertificateService.validateUserData(userData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('sanitizeUserData', () => {
    it('should trim and normalize whitespace in full name', () => {
      const userData: CertificateUserData = {
        fullName: '  John   Doe  ',
        email: '  john@example.com  '
      }

      const result = CertificateService.sanitizeUserData(userData)
      expect(result.fullName).toBe('John Doe')
      expect(result.email).toBe('john@example.com')
    })

    it('should handle undefined email', () => {
      const userData: CertificateUserData = {
        fullName: 'John Doe'
      }

      const result = CertificateService.sanitizeUserData(userData)
      expect(result.fullName).toBe('John Doe')
      expect(result.email).toBeUndefined()
    })
  })

  describe('generateFilename', () => {
    it('should generate a proper filename', () => {
      const userName = 'John Doe'
      const issueDate = new Date('2024-01-15T10:30:00Z')

      const filename = CertificateService.generateFilename(userName, issueDate)
      expect(filename).toBe('fedramp_training_certificate_john_doe_2024-01-15.pdf')
    })

    it('should sanitize special characters in name', () => {
      const userName = "Mary O'Connor-Smith Jr.!"
      const issueDate = new Date('2024-01-15T10:30:00Z')

      const filename = CertificateService.generateFilename(userName, issueDate)
      expect(filename).toBe('fedramp_training_certificate_mary_oconnorsmith_jr_2024-01-15.pdf')
    })
  })

  describe('isBrowserSupported', () => {
    it('should return true when all required features are available', () => {
      const result = CertificateService.isBrowserSupported()
      expect(result).toBe(true)
    })

    it('should return false when crypto.getRandomValues is not available', () => {
      const originalGetRandomValues = globalThis.crypto.getRandomValues
      // @ts-expect-error - Testing unsupported browser
      globalThis.crypto.getRandomValues = undefined

      const result = CertificateService.isBrowserSupported()
      expect(result).toBe(false)

      globalThis.crypto.getRandomValues = originalGetRandomValues
    })
  })
})