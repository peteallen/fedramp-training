# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FedRAMP Training LMS - A React-based Learning Management System for ClearTriage's internal FedRAMP compliance training. Built with TypeScript, Vite, and Tailwind CSS.

## Key Commands

### Development
- `pnpm dev` - Start development server with hot reload at http://localhost:5173
- `pnpm build` - Build for production (runs TypeScript compiler then Vite build)
- `pnpm preview` - Preview production build locally

### Testing
- `pnpm test` - Run all tests once
- `pnpm test:ui` - Run tests with interactive UI (development mode)
- `pnpm test:coverage` - Run tests with coverage report
- Run a specific test file: `pnpm test src/components/ModuleCard.test.tsx`

### Code Quality
- `pnpm lint` - Check code for linting errors
- `pnpm lint:fix` - Auto-fix linting errors where possible

**Important**: Always run `pnpm lint` and `pnpm test` before completing any task to ensure code quality.

## Architecture

### State Management
Uses Zustand stores with localStorage persistence:
- `trainingStore.ts` - Module progress, completion status, and quiz scores
- `userStore.ts` - User profile and onboarding state
- `certificateStore.ts` - Certificate generation and history
- `themeStore.ts` - Theme preferences (light/dark mode)

### Core Components
- `App.tsx` - Main entry point, handles routing between modules and welcome screen
- `ModuleViewer.tsx` - Displays module content with role-based filtering
- `WelcomeScreen.tsx` - User onboarding flow (name and role selection)
- `CertificateTemplate.tsx` - PDF certificate generation for completed training

### Module System
- Training content stored in `/src/data/modules/*.json`
- Hot-reload support in development for JSON content changes
- Role-based content filtering (CSO, Developer, General User)
- Progress tracked per module with quiz scoring

### Testing Strategy
- Component tests using Vitest and React Testing Library
- Integration tests for user workflows
- Accessibility testing included
- Test files colocated with components (e.g., `Component.test.tsx`)

### Key Patterns
- TypeScript with strict mode for type safety
- Tailwind CSS v4 for styling with dark mode support
- shadcn/ui components for consistent UI
- Responsive design with mobile-first approach
- WCAG accessibility compliance

## Important Rules from .cursor/rules/test-rules.mdc

1. Always update existing tests and/or create new tests when implementing or changing functionality
2. Run tests before and after performing work to ensure no new test failures are introduced