# Contributing to ARYA Design System

Thank you for your interest in contributing to ARYA! We welcome contributions from the community.

## Code of Conduct

Please be respectful and considerate of others. We aim to maintain a welcoming and inclusive environment.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](#)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, etc.)

### Suggesting Features

1. Check existing issues/discussions
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Mockups or examples if possible

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push and create a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/arya-design-system.git

# Install dependencies
npm install

# Run development server
npm run dev

# Build
npm run build

# Test (when available)
npm test
```

## Coding Standards

### TypeScript
- Use TypeScript for all components
- Provide proper types and interfaces
- Export types alongside components

### React
- Use functional components with hooks
- Forward refs for interactive components
- Use proper prop types

### CSS
- Follow BEM naming convention
- Use CSS custom properties for theming
- Support both light and dark modes
- Ensure responsive design

### Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Test with screen readers

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Follow existing patterns

## Component Checklist

When creating a new component:

- [ ] TypeScript implementation
- [ ] CSS styles (light & dark mode)
- [ ] Prop types and documentation
- [ ] Accessibility features
- [ ] Responsive design
- [ ] Tests (when testing is set up)
- [ ] Storybook story (when available)
- [ ] Documentation in COMPONENTS.md
- [ ] Export from index files

## Documentation

- Update relevant documentation
- Add JSDoc comments
- Include usage examples
- Document props and variants

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add Switch component
fix: button loading state alignment
docs: update installation guide
style: improve card hover effect
refactor: simplify input validation
```

## Questions?

Feel free to ask questions in:
- GitHub Discussions
- Discord community
- Issue comments

Thank you for contributing! 🎉
