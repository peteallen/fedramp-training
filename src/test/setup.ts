import '@testing-library/jest-dom'

// Mock window.matchMedia for theme detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: (_listener: () => void) => {
      // Mock implementation
    },
    removeListener: (_listener: () => void) => {
      // Mock implementation
    },
    addEventListener: (_type: string, _listener: () => void) => {
      // Mock implementation
    },
    removeEventListener: (_type: string, _listener: () => void) => {
      // Mock implementation
    },
    dispatchEvent: (_event: Event) => {
      // Mock implementation
      return false
    },
  }),
}) 