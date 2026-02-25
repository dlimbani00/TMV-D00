# Survey System - Complete Setup Documentation

## 📋 What Has Been Created

### ✅ Backend (Spring Boot API)
```
packages/empsurvey-api/
├── src/main/java/com/arya/empsurvey/
│   ├── EmpSurveyApplication.java
│   ├── controller/
│   │   └── SurveyController.java          ← REST API endpoints
│   ├── service/
│   │   └── SurveyService.java             ← Business logic
│   ├── repository/
│   │   └── SurveyRepository.java          ← Database queries
│   ├── entity/                            ← JPA entities
│   │   ├── Survey.java
│   │   ├── SurveyQuestion.java
│   │   └── SurveyOption.java
│   ├── dto/                               ← Data transfer objects
│   │   ├── SurveyDTO.java
│   │   ├── QuestionDTO.java
│   │   └── OptionDTO.java
│   ├── config/
│   │   └── WebConfig.java                 ← CORS configuration
│   └── exception/
│       └── GlobalExceptionHandler.java    ← Error handling
├── pom.xml                                ← Maven dependencies
├── Dockerfile                             ← Docker container
└── README.md                              ← API documentation
```

### ✅ Frontend (React + TypeScript)
```
packages/empsurvey/
├── src/
│   ├── pages/
│   │   └── FormBuilder.tsx                ← Main form builder
│   ├── components/
│   │   └── SaveSurveyModal.tsx            ← Save dialog modal
│   ├── services/
│   │   └── api.ts                         ← API client
│   ├── vite-env.d.ts                      ← TypeScript env types
│   └── .env                               ← Environment variables
├── Dockerfile                             ← Docker container
└── .env.example                           ← Template for .env
```

### ✅ Documentation
```
Documentation files created:
├── QUICK_START.md                         ← Start here! ⭐
├── STARTUP_GUIDE.md                       ← Detailed setup
├── TROUBLESHOOTING.md                     ← Common issues & fixes
├── start.sh                               ← Auto startup script
└── check.sh                               ← Diagnostic script
```

---

## 🎯 How The Save Flow Works

### User Action
```
User clicks "Save" → Modal popup appears
       ↓
User enters survey name (e.g., "Employee Satisfaction Survey")
       ↓
User clicks "Save" button in modal
```

### Frontend Logic
```typescript
FormBuilder.tsx:
  handleSaveClick() → Opens SaveSurveyModal
       ↓
SaveSurveyModal.tsx:
  User enters name and clicks Save
       ↓
handleSaveConfirm(title: string):
  1. Validates survey name (required, min 3 chars)
  2. Transforms questions array to API format:
     Question → SurveyQuestion
     options → SurveyOption[]
  3. Creates Survey object with metadata
  4. Calls surveyAPI.createSurvey()
```

### API Client
```typescript
api.ts:
  surveyAPI.createSurvey(surveyData)
       ↓
Sends: POST http://localhost:8080/api/surveys
With: { title, description, questions: [...], template, etc }
```

### Backend Processing
```java
SurveyController.java (@RestController):
  POST /surveys → createSurvey(@RequestBody SurveyDTO)
       ↓
SurveyService.java (@Service):
  createSurvey(SurveyDTO) {
    1. Convert DTO to Entity
    2. Call repository to save to database
    3. Return saved Survey as DTO
  }
       ↓
SurveyRepository.java (@Repository):
  save(survey) → Hibernate persists to Oracle Database
       ↓
Database (Oracle):
  INSERT INTO SURVEYS (title, description, ...)
  INSERT INTO SURVEY_QUESTIONS (...)
  INSERT INTO SURVEY_OPTIONS (...)
```

### Response
```
Backend: Returns 201 CREATED with Survey object including ID
       ↓
Frontend: Receives saved survey, closes modal
       ↓
User: Sees success message, survey ID is stored for updates
```

---

## 🔌 API Endpoints

**Base URL**: `http://localhost:8080/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/surveys` | List all surveys |
| GET | `/surveys/{id}` | Get survey by ID |
| POST | `/surveys` | Create new survey |
| PUT | `/surveys/{id}` | Update survey |
| DELETE | `/surveys/{id}` | Delete survey |
| POST | `/surveys/{id}/publish` | Publish survey |

### Example: Create Survey
```bash
curl -X POST http://localhost:8080/api/surveys \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Customer Feedback",
    "description": "Quick feedback survey",
    "templateType": "CUSTOM",
    "status": "DRAFT",
    "createdBy": "admin",
    "isAnonymous": false,
    "questions": [
      {
        "questionText": "How satisfied are you?",
        "questionType": "choice",
        "sortOrder": 1,
        "isRequired": true,
        "options": [
          {"optionText": "Very Satisfied", "optionValue": "very_satisfied", "sortOrder": 1},
          {"optionText": "Satisfied", "optionValue": "satisfied", "sortOrder": 2}
        ]
      }
    ]
  }'
```

### Response
```json
{
  "surveyId": 1,
  "title": "Customer Feedback",
  "description": "Quick feedback survey",
  "templateType": "CUSTOM",
  "status": "DRAFT",
  "createdBy": "admin",
  "isAnonymous": false,
  "questions": [...]
}
```

---

## 🔌 Database Schema

### SURVEYS Table
```sql
CREATE TABLE SURVEYS (
  SURVEY_ID NUMBER PRIMARY KEY,
  TITLE VARCHAR2(255) NOT NULL,
  DESCRIPTION VARCHAR2(1000),
  TEMPLATE_TYPE VARCHAR2(50),
  STATUS VARCHAR2(20),
  CREATED_BY VARCHAR2(100),
  START_DATE DATE,
  END_DATE DATE,
  IS_ANONYMOUS NUMBER(1),
  CREATED_AT TIMESTAMP,
  UPDATED_AT TIMESTAMP
)
```

### SURVEY_QUESTIONS Table
```sql
CREATE TABLE SURVEY_QUESTIONS (
  QUESTION_ID NUMBER PRIMARY KEY,
  SURVEY_ID NUMBER REFERENCES SURVEYS,
  QUESTION_TEXT VARCHAR2(1000),
  QUESTION_TYPE VARCHAR2(50),
  SORT_ORDER NUMBER,
  IS_REQUIRED NUMBER(1)
)
```

### SURVEY_OPTIONS Table
```sql
CREATE TABLE SURVEY_OPTIONS (
  OPTION_ID NUMBER PRIMARY KEY,
  QUESTION_ID NUMBER REFERENCES SURVEY_QUESTIONS,
  OPTION_TEXT VARCHAR2(500),
  OPTION_VALUE VARCHAR2(100),
  SORT_ORDER NUMBER
)
```

---

## 🚀 Running the System

### Option 1: Local Development (Recommended)

**Terminal 1 - Database:**
```bash
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System
docker compose -f docker-compose.db.yml up -d
```

**Terminal 2 - API:**
```bash
cd packages/empsurvey-api
mvn clean package
mvn spring-boot:run
```

**Terminal 3 - Frontend:**
```bash
cd packages/empsurvey
npm run dev
```

**Access**: http://localhost:5176

---

### Option 2: Docker Compose (One Command)

```bash
docker compose up --build
```

**Access**: http://localhost:5174

---

## 🧪 Testing the Save Feature

1. Open browser → http://localhost:5176
2. Create survey flow:
   - Choose template
   - Go through questions
   - Click "Save" button
3. Modal appears asking for survey name
4. Enter name: "Test Survey"
5. Click "Save" in modal
6. Open **Developer Console (F12 → Console tab)**

You should see:
```
📝 Saving survey: "Test Survey"
📡 API Request: POST http://localhost:8080/api/surveys
✅ API Success: 201
```

---

## 📊 Features Implemented

### Frontend
- ✅ Survey form builder
- ✅ Save Survey modal with name input
- ✅ Validation (survey name required, min 3 chars)
- ✅ API client with detailed logging
- ✅ Error handling and user feedback
- ✅ Loading states during save
- ✅ Keyboard support (Enter/Escape)
- ✅ Smooth animations

### Backend
- ✅ REST API with 6 endpoints
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Publish functionality
- ✅ CORS configuration
- ✅ Global exception handling
- ✅ Data validation
- ✅ Transaction management
- ✅ Hibernation with Oracle DB

### Database
- ✅ Oracle Database container
- ✅ Automatic schema initialization
- ✅ Relationship modeling
- ✅ Cascading deletes

---

## 🔍 Debugging

### Enable Console Logging
Open browser → Press F12 → Console tab

You'll see:
```
📝 Saving survey: "Survey Name"
📋 Questions count: 3
🚀 Sending to API...
📡 API Request: POST http://localhost:8080/api/surveys
✅ API Success: 201
```

### Check API Response
```bash
curl http://localhost:8080/api/surveys | jq
```

### View Database Tables
```bash
# Use Oracle SQL Developer or:
sqlplus ARYA/arya123@localhost:1521/FREEPDB1

SQL> SELECT * FROM SURVEYS;
SQL> SELECT * FROM SURVEY_QUESTIONS;
```

---

## 📁 Key Configuration Files

| File | Purpose | Status |
|------|---------|--------|
| `packages/empsurvey/.env` | Frontend env vars | ✅ Created |
| `packages/empsurvey-api/pom.xml` | Maven dependencies | ✅ Complete |
| `packages/empsurvey-api/src/main/resources/application.yml` | Spring Boot config | ✅ Complete |
| `docker-compose.yml` | Multi-service Docker setup | ✅ Updated |
| `docker-compose.db.yml` | Database-only Docker setup | ✅ Using existing |

---

## ✨ Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080/api
VITE_DB_HOST=localhost
VITE_DB_PORT=1521
VITE_DB_SERVICE=FREEPDB1
VITE_DB_USER=ARYA
```

### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@${DB_HOST:localhost}:${DB_PORT:1521}/${DB_SERVICE:FREEPDB1}
    username: ${DB_USER:ARYA}
    password: ${DB_PASSWORD:arya123}
```

---

## 🛠️ Troubleshooting Quick Links

- **"Cannot connect to API"** → See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#scenario-1)
- **"HTTP 500 Error"** → See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#scenario-2)
- **"CORS Error"** → See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#scenario-4)
- **General setup issues** → See [QUICK_START.md](./QUICK_START.md)

---

## 📞 Support

For issues:
1. Check [QUICK_START.md](./QUICK_START.md) for simple setup
2. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
3. Open browser console (F12) and read error messages
4. Check API logs in the terminal where `mvn spring-boot:run` is running

---

**You're all set!** Ready to start building surveys that save to the database. 🎉
