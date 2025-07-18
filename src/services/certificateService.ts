import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import type { CertificateUserData, ValidationResult } from '../types/certificate'

export class CertificateService {
  /**
   * Generate a cryptographically secure certificate ID
   * Uses Web Crypto API for secure random generation
   */
  static generateCertificateId(): string {
    if (crypto.randomUUID) {
      // Use native UUID generation (supported in modern browsers)
      return crypto.randomUUID()
    } else {
      // Fallback using crypto.getRandomValues()
      const array = new Uint8Array(16)
      crypto.getRandomValues(array)
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    }
  }

  /**
   * Validate user data for certificate generation
   */
  static validateUserData(userData: CertificateUserData): ValidationResult {
    const errors: string[] = []

    // Validate full name
    if (!userData.fullName || userData.fullName.trim().length === 0) {
      errors.push('Full name is required')
    } else if (userData.fullName.trim().length > 100) {
      errors.push('Full name must be less than 100 characters')
    } else if (!/^[a-zA-Z\s\-'.]+$/.test(userData.fullName.trim())) {
      errors.push('Full name can only contain letters, spaces, hyphens, apostrophes, and periods')
    }

    // Validate email if provided
    if (userData.email && userData.email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email.trim())) {
        errors.push('Please enter a valid email address')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Sanitize user input to prevent XSS and ensure clean data
   */
  static sanitizeUserData(userData: CertificateUserData): CertificateUserData {
    return {
      fullName: userData.fullName.trim().replace(/\s+/g, ' '), // Normalize whitespace
      email: userData.email?.trim() || undefined
    }
  }

  /**
   * Generate PDF from HTML element
   */
  static async generatePDF(templateElement: HTMLElement, filename: string): Promise<void> {
    try {
      // Configure html2canvas options for better PDF quality
      const canvas = await html2canvas(templateElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: templateElement.scrollWidth,
        height: templateElement.scrollHeight
      })

      // Create PDF with standard letter size (8.5 x 11 inches)
      const pdf = new jsPDF({
        orientation: 'landscape', // Certificate typically looks better in landscape
        unit: 'in',
        format: 'letter'
      })

      // Calculate dimensions to fit the certificate properly
      const imgWidth = 11 // Letter width in landscape
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // Add the canvas as an image to the PDF
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

      // Save the PDF
      pdf.save(filename)
    } catch (_error) {
      throw new Error('Failed to generate certificate PDF. Please try again.')
    }
  }

  /**
   * Generate a filename for the certificate
   */
  static generateFilename(userName: string, issueDate: Date): string {
    const sanitizedName = userName
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .toLowerCase()
    
    const dateStr = issueDate.toISOString().split('T')[0] // YYYY-MM-DD format
    
    return `fedramp_training_certificate_${sanitizedName}_${dateStr}.pdf`
  }

  /**
   * Check if the browser supports the required features for PDF generation
   */
  static isBrowserSupported(): boolean {
    return !!(
      window.crypto &&
      typeof window.crypto.getRandomValues === 'function' &&
      HTMLCanvasElement.prototype.toDataURL
    )
  }
}