import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import type { CertificateTemplateProps } from '../types/certificate'
import { CertificateTemplate } from './CertificateTemplate'

// Mock data for testing
const mockProps: CertificateTemplateProps = {
  userData: {
    fullName: 'John Doe',
    email: 'john.doe@example.com'
  },
  completionData: {
    modules: [
      {
        id: 1,
        title: 'FedRAMP Fundamentals',
        completionDate: new Date('2024-01-15'),
        score: 95,
        timeSpent: 45
      },
      {
        id: 2,
        title: 'Security Controls',
        completionDate: new Date('2024-01-20'),
        score: 88,
        timeSpent: 60
      }
    ],
    overallCompletionDate: new Date('2024-01-20'),
    totalTimeSpent: 105,
    overallScore: 92
  },
  certificateId: 'CERT-12345-ABCDE',
  issueDate: new Date('2024-01-21')
}

describe('CertificateTemplate', () => {
  it('renders certificate with user name', () => {
    render(<CertificateTemplate {...mockProps} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('displays certificate title and subtitle', () => {
    render(<CertificateTemplate {...mockProps} />)
    
    expect(screen.getByText('Certificate of Completion')).toBeInTheDocument()
    expect(screen.getByText('FedRAMP Security and Privacy Awareness Training')).toBeInTheDocument()
  })

  it('shows completion details', () => {
    render(<CertificateTemplate {...mockProps} />)
    
    expect(screen.getByText(/Completion Date:/)).toBeInTheDocument()
    expect(screen.getByText('Modules Completed:')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Overall Score:')).toBeInTheDocument()
    expect(screen.getByText('92%')).toBeInTheDocument()
  })

  it('displays all completed modules', () => {
    render(<CertificateTemplate {...mockProps} />)
    
    expect(screen.getByText('FedRAMP Fundamentals')).toBeInTheDocument()
    expect(screen.getByText('Security Controls')).toBeInTheDocument()
  })

  it('shows certificate ID and issue date', () => {
    render(<CertificateTemplate {...mockProps} />)
    
    expect(screen.getByText('Certificate ID:')).toBeInTheDocument()
    expect(screen.getByText('CERT-12345-ABCDE')).toBeInTheDocument()
    expect(screen.getByText(/Certificate Issued:/)).toBeInTheDocument()
  })

  it('includes compliance information', () => {
    render(<CertificateTemplate {...mockProps} />)
    
    expect(screen.getByText(/FedRAMP AT-1, AT-2, and AT-3 controls/)).toBeInTheDocument()
    expect(screen.getByText(/Department of Veterans Affairs/)).toBeInTheDocument()
  })

  it('displays ClearTriage branding', () => {
    render(<CertificateTemplate {...mockProps} />)
    
    expect(screen.getByText('ClearTriage')).toBeInTheDocument()
  })

  it('handles modules without scores gracefully', () => {
    const propsWithoutScores = {
      ...mockProps,
      completionData: {
        ...mockProps.completionData,
        modules: [
          {
            id: 1,
            title: 'Test Module',
            completionDate: new Date('2024-01-15'),
            timeSpent: 30
          }
        ],
        overallScore: 0
      }
    }

    render(<CertificateTemplate {...propsWithoutScores} />)
    
    expect(screen.getByText('Test Module')).toBeInTheDocument()
    // Should not display overall score when it's 0
    expect(screen.queryByText(/Overall Score:/)).not.toBeInTheDocument()
  })
})