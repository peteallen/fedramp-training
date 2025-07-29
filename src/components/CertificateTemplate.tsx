import React from 'react'
import type { CertificateTemplateProps } from '../types/certificate'
import './CertificateTemplate.css'

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  userData,
  completionData,
  certificateId,
  issueDate
}) => {
  // Format date for display
  const formatDate = (date: Date | string) => {
    // Ensure we have a proper Date object
    const dateObj = date instanceof Date ? date : new Date(date)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj)
  }



  return (
    <div className="certificate-container" style={{ 
      backgroundColor: '#ffffff',
      color: '#000000' 
    }}>
      {/* Certificate Border */}
      <div className="certificate-border">
        {/* Header Section */}
        <div className="certificate-header">
          <div className="certificate-logo">
            <div className="logo-placeholder">
              ClearTriage
            </div>
          </div>
          <h1 className="certificate-title">
            Certificate of Completion
          </h1>
          <p className="certificate-subtitle">
            FedRAMP Security and Privacy Awareness Training
          </p>
        </div>

        {/* Main Content */}
        <div className="certificate-content">
          <div className="certificate-recipient">
            <p className="recipient-label">This certifies that</p>
            <h2 className="recipient-name">{userData.fullName}</h2>
            <p className="completion-text">
              has successfully completed the ClearTriage FedRAMP Low Impact SaaS 
              Security and Privacy Awareness Training Program
            </p>
          </div>

          {/* Completion Details */}
          <div className="completion-details">
            <div className="completion-date">
              <strong>Completion Date:</strong> {formatDate(completionData.overallCompletionDate)}
            </div>
            <div className="completion-stats">
              <div className="stat-item">
                <strong>Modules Completed:</strong> {completionData.modules.length}
              </div>
              {completionData.overallScore > 0 && (
                <div className="stat-item">
                  <strong>Overall Score:</strong> {completionData.overallScore}%
                </div>
              )}

            </div>
          </div>

          {/* Module List */}
          <div className="modules-section">
            <h3 className="modules-title">Training Modules Completed:</h3>
            <div className="modules-list">
              {completionData.modules.map((module) => (
                <div key={module.id} className="module-item">
                  <div className="module-info">
                    <span className="module-title">{module.title}</span>
                    <span className="module-date">
                      Completed: {formatDate(module.completionDate)}
                    </span>
                  </div>
                  <div className="module-stats">
                    {module.score !== undefined && (
                      <span className="module-score">Score: {module.score}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="certificate-footer">
          <div className="footer-content">
            <div className="compliance-info">
              <p className="compliance-text">
                This training satisfies FedRAMP AT-1, AT-2, and AT-3 controls for 
                Department of Veterans Affairs (VA) customer engagement requirements.
              </p>
            </div>
            
            <div className="certificate-meta">
              <div className="issue-info">
                <div className="issue-date">
                  <strong>Certificate Issued:</strong> {formatDate(issueDate)}
                </div>
                <div className="certificate-id">
                  <strong>Certificate ID:</strong> {certificateId}
                </div>
              </div>
              
              <div className="signature-section">
                <div className="signature-line">
                  <div className="signature-placeholder"></div>
                  <p className="signature-label">ClearTriage Training Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}