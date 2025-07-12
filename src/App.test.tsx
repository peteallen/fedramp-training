import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: /ClearTriage FedRAMP Training LMS/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the correct number of training modules', () => {
    render(<App />)
    const moduleButtons = screen.getAllByText('Start Module')
    expect(moduleButtons).toHaveLength(4)
  })

  it('displays progress overview', () => {
    render(<App />)
    const progressText = screen.getByText(/Modules Completed:/i)
    expect(progressText).toBeInTheDocument()
  })

  it('displays initial progress as 0/4', () => {
    render(<App />)
    const progressCount = screen.getByText('0 / 4')
    expect(progressCount).toBeInTheDocument()
  })
}) 