# Project Structure

## Root Directory Organization
```
fedramp-training/
├── src/                    # Source code
├── public/                 # Static assets
├── dist/                   # Production build output
├── .kiro/                  # Kiro configuration and specs
├── node_modules/           # Dependencies
└── config files            # Build and tool configurations
```

## Source Code Structure (`src/`)
```
src/
├── components/             # React components
│   ├── ui/                # shadcn/ui base components
│   ├── ModuleCard.tsx     # Training module cards
│   ├── ModuleViewer.tsx   # Module content viewer
│   ├── ThemeProvider.tsx  # Theme context provider
│   ├── ThemeToggle.tsx    # Light/dark mode toggle
│   └── ConfirmDialog.tsx  # Confirmation dialogs
├── stores/                # Zustand state stores
│   ├── trainingStore.ts   # Training progress and modules
│   └── themeStore.ts      # Theme preferences
├── hooks/                 # Custom React hooks
│   └── useTrainingInit.ts # Module initialization logic
├── services/              # Business logic services
│   └── certificateService.ts # PDF certificate generation
├── data/                  # Static data and schemas
│   ├── modules/           # Individual module JSON files
│   ├── modules.json       # Module index
│   └── modules.schema.json # JSON schema validation
├── types/                 # TypeScript type definitions
│   └── certificate.ts     # Certificate-related types
├── lib/                   # Utility functions
│   └── utils.ts           # Common utilities (cn function)
├── test/                  # Test configuration
│   └── setup.ts           # Vitest setup
├── App.tsx                # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles and Tailwind imports
```

## Component Architecture Patterns

### UI Components (`src/components/ui/`)
- **shadcn/ui components** - Base UI primitives (Button, etc.)
- **Radix UI integration** - Accessible, unstyled components
- **Variant-based styling** - Using class-variance-authority (cva)
- **Compound component pattern** - For complex UI elements

### Feature Components (`src/components/`)
- **Single responsibility** - Each component has one clear purpose
- **Props interface** - TypeScript interfaces for all component props
- **Event handling** - Callback props for parent communication
- **Accessibility** - ARIA labels, keyboard navigation, semantic HTML

### State Management Pattern
- **Zustand stores** - Centralized state with actions
- **Persistence middleware** - Automatic localStorage sync
- **Computed values** - Derived state (completedCount, overallProgress)
- **Action-based updates** - Pure functions for state mutations

## Data Organization

### Module Data (`src/data/`)
- **Modular JSON files** - Each training module in separate file
- **Index file** - Central registry of available modules
- **Schema validation** - JSON schema for data structure validation
- **Hot reload support** - Vite HMR for development

### Type Definitions (`src/types/`)
- **Domain-specific types** - Business logic type definitions
- **Interface segregation** - Small, focused interfaces
- **Export consistency** - Named exports for all types

## Testing Structure
- **Co-located tests** - Test files next to source files (`.test.tsx`)
- **Test utilities** - Shared setup in `src/test/setup.ts`
- **Component testing** - React Testing Library patterns
- **Unit testing** - Vitest for business logic

## Configuration Files
- **TypeScript** - Project references with app/node configs
- **ESLint** - Flat config with React, TypeScript, accessibility rules
- **Tailwind** - v4 configuration with typography plugin
- **Vite** - React plugin with path aliases
- **Package.json** - ESM module type, comprehensive scripts

## Import Conventions
- **Path aliases** - Use `@/` for src imports
- **Relative imports** - For same-directory files
- **Named exports** - Prefer named over default exports
- **Import grouping** - External, internal, relative (ESLint enforced)