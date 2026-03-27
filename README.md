

A modern, accessible design system with integrated Survey Management System.

## 📋 Quick Navigation

### 🎯 **Getting Started** (Pick One)
- **⚡ Just run it**: [QUICK_START.md](./QUICK_START.md) - Copy-paste commands
- **🔧 Detailed setup**: [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) - Step by step
- **🆘 Something broken**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues

### 📚 **Understanding**
- **What was built**: [WHAT_WAS_BUILT.md](./WHAT_WAS_BUILT.md) - Complete summary
- **API Integration**: [API_INTEGRATION.md](./API_INTEGRATION.md) - Deep dive
- **API README**: [packages/empsurvey-api/README.md](./packages/empsurvey-api/README.md) - Backend docs

---



A modern, accessible design system inspired by Apple's design language. Built with React, TypeScript, and thoughtful attention to detail.

### Features
- 🎨 **Apple-inspired Design Tokens**
- 🧩 **Comprehensive Components**
- ♿ **Accessibility First** - WCAG 2.1 AA compliant
- 🎭 **Dark Mode** support
- 📱 **Responsive** - Mobile-first approach
- 🔧 **TypeScript** - Fully typed API
- 📖 **Storybook** - Interactive documentation

---

## 📦 Project Structure

This is a **monorepo** with multiple packages:

```
ARYA Design System/
├── packages/
│   ├     ← Design system components
│   ├── empsurvey/               ← React Survey Frontend ✨
│   └── empsurvey-api/           ← Spring Boot API Backend ✨
├── db/                          ← Database initialization scripts
├── docker-compose.yml           ← Multi-service Docker setup
├── 📄 QUICK_START.md            ← START HERE!
├── 📄 STARTUP_GUIDE.md
├── 📄 TROUBLESHOOTING.md
├── 📄 API_INTEGRATION.md
└── 📄 WHAT_WAS_BUILT.md
```

### Key Packages

| Package | Purpose | Status |
|---------|---------|--------|
| `arya-design-system` | Reusable UI components | ✅ Core system |
| `empsurvey` | Survey builder UI | ✅ React frontend |
| `empsurvey-api` | REST API backend | ✨ **NEW** |

---

## 🚀 Getting Started

### Option 1: Quick Start (Recommended)
```bash
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System

# Terminal 1: Database
docker compose -f docker-compose.db.yml up -d

# Terminal 2: API
cd packages/empsurvey-api && mvn spring-boot:run

# Terminal 3: Frontend
cd packages/empsurvey && npm run dev

# Open: http://localhost:5176
```

### Option 2: Docker Compose
```bash
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System
docker compose up --build

# Open: http://localhost:5174
```

---

## 🎯 Survey System Features

### Frontend (React + TypeScript)
- ✅ Professional survey form builder
- ✅ Workflow diagram editor
- ✅ Save survey modal with validation
- ✅ API client with error handling
- ✅ Detailed browser console logging
- ✅ Smooth animations and transitions

### Backend (Spring Boot)
- ✅ REST API with 6 endpoints
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Publish functionality
- ✅ CORS configuration
- ✅ Global exception handling
- ✅ Database persistence

### Database (Oracle)
- ✅ Automatic schema initialization
- ✅ Relationship modeling
- ✅ Cascading operations
- ✅ Docker containerized

---

## 📊 Save Survey Flow

1. **User**: Clicks "Save" button
2. **Frontend**: Opens modal dialog with name input
3. **User**: Enters survey name and clicks Save
4. **Frontend**: Validates input (required, min 3 chars)
5. **API**: Transforms data and sends to REST endpoint
6. **Backend**: Validates and persists to database
7. **Success**: Returns saved survey with auto-generated ID

```
User Input → Validation → API Call → Database Store → Success Message
```

---

## 🔌 API Endpoints

**Base URL**: `http://localhost:8080/api`

```
GET    /surveys              List all surveys
GET    /surveys/{id}         Get by ID
POST   /surveys              Create new
PUT    /surveys/{id}         Update
DELETE /surveys/{id}         Delete
POST   /surveys/{id}/publish Publish
```

### Example: Create Survey
```bash
curl -X POST http://localhost:8080/api/surveys \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Employee Survey",
    "description": "Annual feedback",
    "templateType": "CUSTOM",
    "status": "DRAFT",
    "createdBy": "admin",
    "isAnonymous": false,
    "questions": []
  }'
```

---

## 🛠️ Technology Stack

### Frontend
- React 18+ with TypeScript
- Vite (fast dev server)
- React Router
- React Portal (for modals)

### Backend
- Spring Boot 3.2.2
- Spring Data JPA
- Hibernate ORM
- Spring Web (REST)
- Lombok (boilerplate reduction)

### Database
- Oracle Database (Free Edition)
- Running in Docker
- Auto-initialized schema

### DevOps
- Docker & Docker Compose
- Multi-stage builds
- Environment-based configuration

---

## 🧪 Testing the System

### Browser Console (F12)
```
📝 Saving survey: "My Survey"
📋 Questions count: 3
🚀 Sending to API...
📡 API Request: POST http://localhost:8080/api/surveys
✅ API Success: 201
```

### API Test
```bash
curl http://localhost:8080/api/surveys
# Response: [] (or list of surveys)
```

### Database Check
```bash
docker ps
# See Oracle container running

# View surveys
sqlplus ARYA/arya123@localhost:1521/FREEPDB1
SQL> SELECT * FROM SURVEYS;
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `packages/empsurvey/.env` | Frontend API URL config |
| `packages/empsurvey-api/application.yml` | Database config |
| `docker-compose.yml` | Service orchestration |
| `packages/empsurvey/src/services/api.ts` | API client |
| `packages/empsurvey/src/components/SaveSurveyModal.tsx` | Save modal |

---

## 🔍 Troubleshooting

### Components
- Button
- Card
- Input
- Select
- Checkbox
- Radio
- Switch
- Modal
- Dropdown
- Toast
- And more...

## 🛠 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run Storybook
npm run storybook

# Build for production
npm run build

# Run tests
npm test
```

## 📚 Documentation

Visit our [Storybook](http://localhost:6006) for interactive component documentation and examples.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## 📄 License

MIT © ARYA Design System
