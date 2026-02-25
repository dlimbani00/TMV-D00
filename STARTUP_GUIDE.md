# Quick Start Guide - Survey System with API

## Prerequisites
- Java 17 or higher (for Spring Boot)
- Maven 3.6+ (for building)
- Docker & Docker Compose (for database)
- Node.js 18+ (for React)

## Option 1: Quick Start (Local Development)

### Step 1: Start Oracle Database
```bash
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System
docker compose -f docker-compose.db.yml up -d
```

This starts Oracle Database on port 1521.

### Step 2: Start Spring Boot API
```bash
cd packages/empsurvey-api

# Build the project
mvn clean package

# Run the API
mvn spring-boot:run
```

The API will start on **http://localhost:8080/api**

You should see logs like:
```
Started EmpSurveyApplication in X seconds
```

### Step 3: Start React Frontend
In a new terminal:
```bash
cd packages/empsurvey
npm run dev
```

The app will start on **http://localhost:5176**

---

## Option 2: Docker Compose (Full Stack)

Run everything together:

```bash
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System
docker compose up --build
```

This starts:
- ✅ Oracle Database (port 1521)
- ✅ Spring Boot API (port 8080)
- ✅ React Frontend (port 5174)

---

## Verify Everything is Working

### Check API Health
```bash
curl http://localhost:8080/api/surveys
```

Should return an empty array or survey list (not connection refused)

### Check Database Connection
```bash
# The Spring Boot logs should show successful DB connection
# Look for: "Hibernate: select ... from SURVEYS"
```

### Check React App
- Open http://localhost:5176
- Click "Create Survey"
- Go through the form
- Click "Save" button
- You should see the Save Survey modal popup
- Enter a survey name
- Click "Save" button
- Should see success message

---

## Troubleshooting

### "Cannot connect to API" Error
1. Make sure Spring Boot is running: `mvn spring-boot:run`
2. Check if port 8080 is listening: `lsof -i :8080`
3. Verify .env file exists in `packages/empsurvey/`

### "Database connection failed"
1. Make sure Docker container is running: `docker ps | grep oracle`
2. Wait 30-60 seconds for database to initialize
3. Check Docker logs: `docker logs <container_id>`

### "No surveys found" but Save worked
- This is normal, check database logs to confirm it saved
- Use the API endpoint to fetch: `curl http://localhost:8080/api/surveys`

### Maven not found
```bash
# Install Maven on macOS
brew install maven

# Verify installation
mvn --version
```

---

## Project Structure
```
packages/
├── empsurvey/              # React Frontend
│   ├── src/
│   │   ├── pages/FormBuilder.tsx
│   │   ├── services/api.ts       # API Client
│   │   └── components/SaveSurveyModal.tsx
│   └── .env                        # ⭐ Environment variables
│
└── empsurvey-api/          # Spring Boot Backend
    ├── pom.xml
    ├── src/main/java/com/arya/empsurvey/
    │   ├── controller/SurveyController.java
    │   ├── service/SurveyService.java
    │   ├── repository/SurveyRepository.java
    │   ├── entity/Survey.java (+ Question, Option)
    │   └── dto/SurveyDTO.java (+ QuestionDTO, OptionDTO)
    └── src/main/resources/
        └── application.yml          # Database config
```

---

## API Endpoints
Base URL: `http://localhost:8080/api`

- `GET /surveys` - List all surveys
- `GET /surveys/{id}` - Get survey by ID
- `POST /surveys` - Create survey
- `PUT /surveys/{id}` - Update survey
- `DELETE /surveys/{id}` - Delete survey
- `POST /surveys/{id}/publish` - Publish survey

---

## Common Fixes

### Reset Everything
```bash
# Stop and remove all containers
docker compose down -v

# Clean Maven cache
cd packages/empsurvey-api
mvn clean

# Rebuild and start
mvn spring-boot:run
```

### Check Logs
```bash
# Spring Boot logs
tail -f /tmp/spring-boot.log

# Docker database logs
docker logs <oracle-container-id> -f
```

---

## Next Steps
Once working:
1. Test Save functionality
2. Check database to confirm data is saved: `SELECT * FROM SURVEYS;`
3. Test Publish functionality
4. List surveys from API: `curl http://localhost:8080/api/surveys`
