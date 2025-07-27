import { useEffect, type ReactNode } from 'react'
import { useThemeStore } from '@/stores/themeStore'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const initializeTheme = useThemeStore((state) => state.initializeTheme)

  useEffect(() => {
    const cleanup = initializeTheme()
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Remove initializeTheme from dependencies to prevent loops

  return <>{children}</>
} 