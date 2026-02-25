# Monorepo Structure

This is a monorepo containing multiple applications and the shared ARYA Design System.

## Packages

### @arya/design-system
Centralized design system with reusable React components, styling, and design tokens.

**Location:** `packages/arya-design-system/`

**Runs on:** 
- Dev: http://localhost:5173 (Vite dev server)
- Prod: http://localhost:8080 (Nginx)

**Scripts:**
```bash
npm run dev:arya      # Start dev server
npm run build:arya    # Build for production
```

### empsurvey
Employee engagement and feedback survey application using ARYA components.

**Location:** `packages/empsurvey/`

**Runs on:** http://localhost:5174 (Vite dev server)

**Scripts:**
```bash
npm run dev:survey    # Start dev server
npm run build:survey  # Build for production
```

## Database

Shared Oracle Database (FREEPDB1) running in Docker.

**Connection Details:**
- Host: `localhost`
- Port: `1521`
- Service: `FREEPDB1`
- User: `arya`
- Tables: 
  - `APPLE_ACCOUNT_USERS` (User registration data)
  - `SURVEYS` (Survey definitions)
  - `SURVEY_RESPONSES` (Survey responses)

**Scripts:**
```bash
npm run db:up        # Start database container
npm run db:down      # Stop database container
```

## Development

### Start All Services
```bash
# Terminal 1: Start Database
npm run db:up

# Terminal 2: Start ARYA Design System
npm run dev:arya

# Terminal 3: Start EMPSurvey
npm run dev:survey
```

### Root-level Commands
```bash
npm install           # Install all packages
npm run dev           # Start all dev servers
npm run build         # Build all packages
npm run lint          # Lint all packages
```

## Docker Deployment

### Development
```bash
npm run docker:up    # Containers with hot reload
npm run docker:down  # Stop containers
```

### Production
```bash
npm run docker:prod      # Build and start production containers
npm run docker:prod:down # Stop production containers
```

## File Structure

```
ARYA-Monorepo/
├── packages/
│   ├── arya-design-system/
│   │   ├── src/
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── pages/           # Full-page components
│   │   │   ├── styles/          # Global styles
│   │   │   └── tokens/          # Design tokens
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── Dockerfile
│   │   ├── Dockerfile.prod
│   │   └── nginx.conf
│   │
│   └── empsurvey/
│       ├── src/
│       │   ├── pages/           # Survey pages
│       │   ├── components/      # Survey-specific components
│       │   └── services/        # API services
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
│
├── db/
│   └── init/
│       └── 01-schema.sql        # Database initialization
│
├── shared-db.config.ts          # Shared database configuration
├── docker-compose.yml           # Dev environment
├── docker-compose.prod.yml      # Production environment
├── docker-compose.db.yml        # Database container
└── package.json                 # Root workspace configuration
```

## Contributing

- Follow ARYA Design System pattern for styling
- Use shared components from @arya/design-system in empsurvey
- Keep database schema normalized and well-documented
- Test locally before pushing changes

## Shared Components Available

Import from `@arya/design-system`:
- `Input` - Text input with floating labels
- `Button` - Primary and secondary buttons
- `Select` - Dropdown select
- And more...

Example:
```tsx
import { Input, Button } from '@arya/design-system'

export function MyComponent() {
  return (
    <>
      <Input label="Name" />
      <Button>Submit</Button>
    </>
  )
}
```
