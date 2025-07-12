import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useThemeStore } from '@/stores/themeStore'
import { ThemeToggle } from './ThemeToggle'

// Mock the theme store
const mockSetTheme = vi.fn()
const mockToggleTheme = vi.fn()

vi.mock('@/stores/themeStore', () => ({
  useThemeStore: vi.fn(),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mock return values
    ;(useThemeStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
      toggleTheme: mockToggleTheme,
    })
  })

  it('renders the theme toggle button', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /switch to dark mode/i })
    expect(button).toBeInTheDocument()
  })

  it('displays sun icon in light mode', () => {
    render(<ThemeToggle />)
    const sunIcon = screen.getByLabelText(/switch to dark mode/i)
    expect(sunIcon).toBeInTheDocument()
  })

  it('displays moon icon in dark mode', () => {
    ;(useThemeStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
      toggleTheme: mockToggleTheme,
    })

    render(<ThemeToggle />)
    const moonIcon = screen.getByLabelText(/switch to light mode/i)
    expect(moonIcon).toBeInTheDocument()
  })

  it('calls setTheme when in system mode', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
    expect(mockToggleTheme).not.toHaveBeenCalled()
  })

  it('calls toggleTheme when in explicit mode', () => {
    ;(useThemeStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
      toggleTheme: mockToggleTheme,
    })

    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    
    expect(mockToggleTheme).toHaveBeenCalled()
    expect(mockSetTheme).not.toHaveBeenCalled()
  })
}) 