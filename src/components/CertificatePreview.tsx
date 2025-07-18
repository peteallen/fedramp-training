import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { CertificateUserData, CompletionData } from '@/types/certificate'

interface CertificatePreviewProps {
  userData: CertificateUserData
  completionData: CompletionData
  certificateId: string
  issueDate: Date
  className?: string
}

export const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(
  ({ userData, completionData, certificateId, issueDate, className }, ref) => {
    const formatDate = (date: Date | string) => {
      // Ensure we have a proper Date object
      const dateObj = date instanceof Date ? date : new Date(date)
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }



    return (
      <div 
        ref={ref}
        className={cn(className)}
        style={{
          backgroundColor: 'white',
          color: 'black',
          padding: '32px',
          fontFamily: 'serif',
          width: '100%',
          maxWidth: '8.5in',
          margin: '0 auto',
          minHeight: '11in',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          aspectRatio: '8.5 / 11',
          fontSize: '14px',
          lineHeight: '1.4'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>
              🛡️ ClearTriage
            </h1>
            <p style={{ fontSize: '18px', color: '#374151' }}>
              Security & Privacy Training Certificate
            </p>
          </div>
          
          <div style={{ borderTop: '2px solid #1e40af', borderBottom: '2px solid #1e40af', paddingTop: '8px', paddingBottom: '8px', marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af' }}>
              FedRAMP Low Impact SaaS Awareness Training
            </p>
          </div>
        </div>

        {/* Certificate Body */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', gap: '24px' }}>
          <div>
            <p style={{ fontSize: '18px', marginBottom: '16px' }}>This certifies that</p>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e40af', marginBottom: '16px', borderBottom: '2px solid #d1d5db', paddingBottom: '8px' }}>
              {userData.fullName || '[Name]'}
            </h2>
            <p style={{ fontSize: '18px' }}>
              has successfully completed the ClearTriage FedRAMP Security and Privacy Awareness Training
            </p>
          </div>

          {/* Completion Details */}
          <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>Training Completion Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px' }}>
              <div>
                <strong>Completion Date:</strong><br />
                {formatDate(completionData.overallCompletionDate)}
              </div>
              <div>
                <strong>Modules Completed:</strong><br />
                {completionData.modules.length} of {completionData.modules.length}
              </div>
              {completionData.overallScore > 0 && (
                <div>
                  <strong>Overall Score:</strong><br />
                  {completionData.overallScore}%
                </div>
              )}
            </div>

            <div style={{ marginTop: '16px' }}>
              <strong>Completed Modules:</strong>
              <ul style={{ marginTop: '8px', fontSize: '14px' }}>
                {completionData.modules.map((module) => (
                  <li key={module.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>• {module.title}</span>
                    <span style={{ color: '#6b7280' }}>
                      {formatDate(module.completionDate)}
                      {module.score && ` (${module.score}%)`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #d1d5db' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', fontSize: '14px', textAlign: 'center' }}>
            <div>
              <strong>Certificate ID:</strong><br />
              <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{certificateId}</span>
            </div>
            <div>
              <strong>Issue Date:</strong><br />
              {formatDate(issueDate)}
            </div>
            <div>
              <strong>Compliance:</strong><br />
              FedRAMP AT-1, AT-2, AT-3
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
            <p>
              This certificate validates completion of FedRAMP Low Impact SaaS awareness training
              for Department of Veterans Affairs (VA) customer engagement.
            </p>
            <p style={{ marginTop: '4px' }}>
              ClearTriage Security & Privacy Training Program
            </p>
          </div>
        </div>
      </div>
    )
  }
)

CertificatePreview.displayName = 'CertificatePreview'