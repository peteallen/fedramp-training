import { FaSun, FaMoon } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/themeStore'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeStore()

  const handleToggle = () => {
    // If currently using system theme, switch to opposite of resolved theme
    if (theme === 'system') {
      const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
      setTheme(newTheme)
    } else {
      // If using explicit theme, toggle it
      toggleTheme()
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="h-9 w-9"
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {resolvedTheme === 'light' ? (
        <FaSun className="h-4 w-4 text-yellow-500" />
      ) : (
        <FaMoon className="h-4 w-4 text-blue-300" />
      )}
    </Button>
  )
} 