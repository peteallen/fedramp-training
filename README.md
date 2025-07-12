# ClearTriage FedRAMP Training LMS

A modern, light-weight browser-based Learning Management System (LMS) built for ClearTriage's internal employee FedRAMP training materials. Features interactive training modules, progress tracking, and a responsive design with light/dark mode support.

## ✨ Features

- **🎓 Interactive Training Modules** - Four comprehensive FedRAMP training modules
- **📊 Progress Tracking** - Real-time progress visualization and completion tracking
- **🌙 Light/Dark Mode** - Automatic browser preference detection with manual toggle
- **📱 Responsive Design** - Mobile-first design that works on all devices
- **⚡ Fast Performance** - Built with Vite for lightning-fast development and builds
- **♿ Accessibility** - WCAG compliant with proper ARIA labels and keyboard navigation
- **🎨 Modern UI** - Clean, professional interface using shadcn/ui components

## 🛠️ Technology Stack

### Core Framework
- **[React 19](https://react.dev/)** - Component-based UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Next-generation frontend build tool

### Styling & UI
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable components built with Radix UI
- **[React Icons](https://react-icons.github.io/react-icons/)** - Popular icon library

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **Local Storage Persistence** - Automatic state persistence

### Development & Testing
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Simple and complete testing utilities
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or later)
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fedramp-training
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm test` | Run tests once |
| `pnpm test:ui` | Run tests with UI |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm lint` | Check code for issues |
| `pnpm lint:fix` | Fix auto-fixable lint issues |

## 🏗️ Project Structure

```
fedramp-training/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   ├── stores/             # Zustand state stores
│   │   ├── trainingStore.ts
│   │   └── themeStore.ts
│   ├── test/               # Test utilities and setup
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── dist/                   # Production build output
└── package.json            # Project dependencies and scripts
```

## 🧪 Testing

The project includes comprehensive test coverage using Vitest and React Testing Library:

- **Unit Tests** - Component behavior and state management
- **Integration Tests** - User interactions and workflows
- **Accessibility Tests** - ARIA compliance and keyboard navigation

Run tests with:
```bash
# Run all tests
pnpm test

# Run tests in watch mode (development)
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

## 🎨 Theming

The application supports both light and dark themes:

- **Automatic Detection** - Respects user's browser/OS preference
- **Manual Toggle** - Sun/moon button in the top-right corner
- **Persistent State** - Remembers user's choice across sessions
- **Dynamic Updates** - Automatically updates when system theme changes

## 🏢 Training Modules

The LMS includes four core FedRAMP training modules:

1. **🛡️ FedRAMP Basics** - Introduction to FedRAMP fundamentals
2. **📖 Security Controls** - Understanding security control frameworks
3. **📊 Assessment Process** - FedRAMP assessment procedures
4. **👥 Compliance Management** - Managing ongoing compliance requirements

Each module features:
- Interactive progress tracking
- Visual completion indicators
- Accessible design patterns
- Responsive layout

## 🔧 Configuration

### Environment Variables

No environment variables are required for basic functionality. The application works out of the box.

### Customization

- **Theme Colors** - Modify `src/index.css` for custom color schemes
- **Components** - Extend shadcn/ui components in `src/components/ui/`
- **Content** - Update training modules in `src/stores/trainingStore.ts`

## 🏗️ Development

### Code Style

- **TypeScript** - Strict type checking enabled
- **ESLint** - Configured for React, TypeScript, and accessibility
- **Prettier** - Automatic code formatting (via ESLint)
- **Import Organization** - Automatic import sorting

### Git Workflow

1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Run tests: `pnpm test`
4. Check linting: `pnpm lint`
5. Build for production: `pnpm build`
6. Create pull request

## 📈 Performance

- **Fast Builds** - Vite's ES modules for instant HMR
- **Small Bundle** - Tree-shaking and code splitting
- **Optimized Images** - Automatic image optimization
- **CSS Purging** - Unused styles removed in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is for internal use at ClearTriage. All rights reserved.

## 🆘 Support

For questions or issues, please contact the development team or create an issue in the repository.

---

Built with ❤️ by the ClearTriage development team