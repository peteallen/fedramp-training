# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FedRAMP Training LMS - A React-based Learning Management System for ClearTriage's internal FedRAMP compliance training. Built for a 6-person team to meet FedRAMP AT-1, AT-2, and AT-3 controls.

## Key Commands

### Development
- `pnpm dev` - Start development server with hot reload at http://localhost:5173
- `pnpm build` - Build for production (runs TypeScript compiler then Vite build)
- `pnpm preview` - Preview production build locally
- `pnpm start` - Start production server with basic auth (for Railway deployment)

### Testing
- `pnpm test` - Run all tests once
- `pnpm test:ui` - Run tests with interactive UI (development mode)
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test src/components/ModuleCard.test.tsx` - Run a specific test file

### Code Quality
- `pnpm lint` - Check code for linting errors
- `pnpm lint:fix` - Auto-fix linting errors where possible

**Important**: Always run `pnpm lint` and `pnpm test` before completing any task to ensure code quality.

## Architecture

### State Management
Uses Zustand stores with localStorage persistence:
- `trainingStore.ts` - Module progress, completion status, dynamic module loading from JSON files
- `userStore.ts` - User profile, onboarding state, name-based content filtering 
- `certificateStore.ts` - Certificate generation and history
- `themeStore.ts` - Theme preferences (light/dark mode)

### Core User Flow
1. **WelcomeScreen** - User selects their name from dropdown (Pete, Dave, Shelly, Savvy, Braden, Krista, or ScaleSec)
2. **App** - Filters modules based on `requiredForMembers` field to show only relevant content
3. **ModuleViewer** - Displays module sections with pagination and progress tracking
4. **CertificateButton** - Appears when user completes all their required modules (100% progress)

### Module System
- Module content stored in `/src/data/modules/{id}/module.json` and `/src/data/modules/{id}/sections/*.json`
- Dynamic loading via fetch() in `loadModuleMetadata` and `loadModuleSection` functions
- Modules filtered by `requiredForMembers` array matching user's name
- Progress calculated based on filtered modules only (users see 100% when they complete their required modules)
- Module IDs are hardcoded in `trainingStore.ts` (currently: [4], expand as needed)

### Testing Approach
- Component tests use mocked Zustand stores with selector support
- Integration tests mock the fetch-based module loading
- Key test utilities in `/src/test-utils/mockStores.ts`
- Tests expect TeamMemberSelector dropdown instead of text input for name
- When mocking `useTrainingStore`, must support selector pattern: `(selector) => selector ? selector(state) : state`

### UI Components
- Uses shadcn/ui components with Tailwind CSS v4
- Dark mode support with theme persistence
- Responsive design with mobile-first approach
- TeamMemberSelector replaces traditional name input with dropdown

## Important Testing Notes

When updating tests that interact with the WelcomeScreen:
- Name selection uses dropdown (`screen.getByRole('button', { name: /select your name/i })`)
- Must click dropdown first, then select name from list
- No longer uses `getByLabelText(/full name/i)` pattern

## Rules from .cursor/rules/test-rules.mdc

1. Always update existing tests and/or create new tests when implementing or changing functionality
2. Run tests before and after performing work to ensure no new test failures are introduced