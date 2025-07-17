# Technology Stack

## Core Framework
- **React 18** - Component-based UI library with TypeScript
- **TypeScript** - Strict type checking enabled
- **Vite** - Next-generation frontend build tool with ES modules and HMR

## Build System & Package Management
- **pnpm** - Fast, disk space efficient package manager (preferred)
- **Node.js** v18+ required
- **ESM modules** - Pure ES module setup

## Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable components built with Radix UI primitives
- **Radix UI** - Unstyled, accessible UI primitives
- **React Icons** - Icon library (react-icons/fa for Font Awesome)
- **class-variance-authority (cva)** - Component variant management
- **clsx + tailwind-merge** - Conditional className utilities

## State Management
- **Zustand** - Lightweight state management with persistence middleware
- **Local Storage** - Automatic state persistence for training progress
- **Custom hooks** - useTrainingInit for module initialization

## Development & Testing
- **Vitest** - Fast unit testing framework (Jest-compatible)
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for tests
- **ESLint** - Code linting with TypeScript, React, and accessibility rules
- **TypeScript ESLint** - TypeScript-specific linting rules

## PDF Generation
- **jsPDF** - PDF document generation
- **html2canvas** - HTML to canvas conversion for certificates

## Common Commands

### Development
```bash
pnpm dev          # Start development server (http://localhost:5173)
pnpm build        # Build for production (TypeScript + Vite)
pnpm preview      # Preview production build locally
```

### Testing
```bash
pnpm test         # Run tests once
pnpm test:ui      # Run tests with UI
pnpm test:coverage # Run tests with coverage report
```

### Code Quality
```bash
pnpm lint         # Check code for issues
pnpm lint:fix     # Fix auto-fixable lint issues
```

## Path Aliases
- `@/*` maps to `./src/*` for clean imports
- Configured in both `tsconfig.json` and `vite.config.ts`

## Hot Module Replacement
- Vite HMR for instant updates during development
- Custom HMR handlers for JSON module files in training store