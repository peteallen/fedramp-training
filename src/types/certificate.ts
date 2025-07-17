// Certificate generation types and interfaces

export interface CertificateUserData {
  fullName: string
  email?: string
}

export interface ModuleCompletion {
  id: number
  title: string
  completionDate: Date
  score?: number
  timeSpent?: number
}

export interface CompletionData {
  modules: ModuleCompletion[]
  overallCompletionDate: Date
  totalTimeSpent: number
  overallScore: number
}

export interface GeneratedCertificate {
  id: string
  issueDate: Date
  userData: CertificateUserData
  completionSnapshot: CompletionData
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface CertificateTemplateProps {
  userData: CertificateUserData
  completionData: CompletionData
  certificateId: string
  issueDate: Date
}

export interface CertificateState {
  // User data
  savedUserData: CertificateUserData | null
  
  // Certificate history
  generatedCertificates: GeneratedCertificate[]
  
  // UI state
  isGenerating: boolean
  showModal: boolean
  
  // Actions
  saveUserData: (userData: CertificateUserData) => void
  addGeneratedCertificate: (certificate: GeneratedCertificate) => void
  setGenerating: (isGenerating: boolean) => void
  setShowModal: (show: boolean) => void
  clearData: () => void
}