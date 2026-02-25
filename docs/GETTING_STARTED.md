# ARYA Design System - Getting Started

## Installation

```bash
npm install @arya/design-system
# or
yarn add @arya/design-system
# or
pnpm add @arya/design-system
```

## Quick Start

### 1. Import Components

```tsx
import { Button, Card, Input } from '@arya/design-system';
```

### 2. Import Styles

Import the CSS in your app entry point:

```tsx
import '@arya/design-system/dist/styles.css';
```

### 3. Use Components

```tsx
function App() {
  return (
    <Card>
      <h2>Welcome to ARYA</h2>
      <Input placeholder="Enter your name" />
      <Button variant="primary">Get Started</Button>
    </Card>
  );
}
```

## Project Structure

```
arya-design-system/
├── src/
│   ├── components/        # React components
│   │   ├── Button/
│   │   ├── Card/
│   │   └── Input/
│   ├── tokens/           # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   ├── radius.ts
│   │   └── transitions.ts
│   ├── utils/            # Utility functions
│   └── index.ts          # Main export
├── docs/                 # Documentation
├── package.json
└── README.md
```

## Development

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd arya-design-system
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173 to view the demo

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Storybook (coming soon)
npm run storybook       # Start Storybook
npm run build-storybook # Build Storybook

# Testing (coming soon)
npm test               # Run tests
npm run test:watch    # Run tests in watch mode

# Linting
npm run lint          # Run ESLint
```

## Features

✅ **Apple-Inspired Design**
- Authentic iOS/macOS aesthetics
- SF Pro typography system
- Native-feeling animations

✅ **Dark Mode**
- Automatic system preference detection
- Carefully adjusted colors
- Seamless transitions

✅ **Accessibility**
- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- Focus management

✅ **TypeScript**
- Full type safety
- IntelliSense support
- Better developer experience

✅ **Customizable**
- Design tokens
- CSS custom properties
- Variant system

✅ **Production Ready**
- Tree-shakable
- Small bundle size
- Optimized performance

## What's Included

### Components (v1.0)
- ✅ Button
- ✅ Card
- ✅ Input
- 🚧 Select (coming soon)
- 🚧 Checkbox (coming soon)
- 🚧 Radio (coming soon)
- 🚧 Switch (coming soon)
- 🚧 Modal (coming soon)
- 🚧 Toast (coming soon)
- 🚧 Dropdown (coming soon)

### Design Tokens
- ✅ Colors (light & dark)
- ✅ Typography
- ✅ Spacing
- ✅ Shadows & Effects
- ✅ Border Radius
- ✅ Transitions
- ✅ Breakpoints
- ✅ Z-Index

## Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © ARYA Design System

## Resources

- [Documentation](./docs)
- [Component Examples](./docs/COMPONENTS.md)
- [Design Principles](./docs/DESIGN_PRINCIPLES.md)
- [GitHub Repository](#)

## Support

- 📧 Email: support@arya-design.com
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](#)

---

Built with ❤️ inspired by Apple's design excellence
