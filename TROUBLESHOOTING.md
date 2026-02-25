# 🛠️ Troubleshooting Guide - Survey Save Issues

## Quick Diagnostic
When you try to save a survey, **open your browser's Developer Console (F12)** and look for one of these scenarios:

---

## Scenario 1: "Cannot connect to API" / "Failed to fetch"

### Symptoms
```
🔴 API Request failed: Failed to fetch
   URL: http://localhost:8080/api/surveys
```

### Solution
The Spring Boot API is **not running**. You need to start it:

```bash
# Terminal 1: Start the database
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System
docker compose -f docker-compose.db.yml up -d

# Terminal 2: Start the API
cd packages/empsurvey-api
mvn spring-boot:run
```

Wait for the message: `Started EmpSurveyApplication in X seconds`

Then test the API:
```bash
curl http://localhost:8080/api/surveys
```

Should return: `[]` (empty array)

---

## Scenario 2: "HTTP 500: Internal Server Error"

### Symptoms
```
❌ API Error: HTTP 500: Internal Server Error
```

### Solution
The API crashed. Check the API logs:

```bash
# Look for error in API terminal output
# Or check the log file:
tail -f /tmp/empsurvey-api.log
```

**Most likely causes:**
1. **Database not running** - Start it: `docker compose -f docker-compose.db.yml up -d`
2. **Database connection failed** - Check: `docker ps | grep oracle`
3. **Table doesn't exist** - The database schema needs to be initialized

### Fix Database Connection
```bash
# Verify database is running and accessible
lsof -i :1521

# If not running, start it:
docker compose -f docker-compose.db.yml up -d

# Wait 30-60 seconds for it to initialize
# Check Docker logs:
docker ps  # Get container ID
docker logs <container-id> | tail -20
```

---

## Scenario 3: "HTTP 404: Not Found"

### Symptoms
```
❌ API Error: HTTP 404: Not Found
```

### Solution
The API endpoint doesn't exist or the URL is wrong.

Check your `.env` file:
```bash
cat packages/empsurvey/.env
```

Should contain:
```
VITE_API_URL=http://localhost:8080/api
```

If it says something different, update it:
```bash
echo "VITE_API_URL=http://localhost:8080/api" > packages/empsurvey/.env
```

Then reload your browser (Ctrl+Shift+R to clear cache).

---

## Scenario 4: "CORS policy" Error

### Symptoms
```
Access to XMLHttpRequest at 'http://localhost:8080/api/surveys' 
from origin 'http://localhost:5176' has been blocked by CORS policy
```

### Solution
The API CORS configuration needs to allow port 5176.

Check file: `packages/empsurvey-api/src/main/java/com/arya/empsurvey/config/WebConfig.java`

Should look like:
```java
.allowedOrigins(
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5176"  // ← Must include your port
)
```

If it's missing, add it and restart the API.

---

## Scenario 5: Network/Connection Issues in Docker

### Symptoms
```
Connection refused to http://localhost:8080/api
(or works locally but not in Docker)
```

### Solution
In Docker containers, use the service name instead of localhost:

**Local development ✅**
```
http://localhost:8080/api
```

**Docker containers ✅**
```
http://empsurvey-api:8080/api
```

The `.env` and `docker-compose.yml` are already configured correctly:
- Local: `packages/empsurvey/.env` → `http://localhost:8080/api`
- Docker: `docker-compose.yml` → `http://empsurvey-api:8080/api`

---

## Step-by-Step Manual Testing

### Test 1: Database Connection
```bash
# Check if database is running
docker ps

# Check if reachable
nc -zv localhost 1521
```

### Test 2: API Response
```bash
# Get all surveys (should return empty array [])
curl -X GET http://localhost:8080/api/surveys

# Create a test survey
curl -X POST http://localhost:8080/api/surveys \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Survey",
    "description": "Test",
    "templateType": "CUSTOM",
    "status": "DRAFT",
    "createdBy": "admin",
    "isAnonymous": false,
    "questions": []
  }'
```

### Test 3: Frontend Console Logging
1. Open **http://localhost:5176**
2. Press **F12** to open Developer Console
3. Go to **Console** tab
4. Create and save a survey
5. You should see logs like:
```
📝 Saving survey: "My Survey"
📡 API Request: POST http://localhost:8080/api/surveys
✅ API Success: 201
```

---

## Complete Startup Procedure

### If Starting from Fresh
```bash
# 1. Go to project root
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System

# 2. Start database (Terminal 1)
docker compose -f docker-compose.db.yml up -d

# 3. Wait 30 seconds for DB to initialize

# 4. Start API (Terminal 2)
cd packages/empsurvey-api
mvn clean package
mvn spring-boot:run

# 5. Start Frontend (Terminal 3)
cd packages/empsurvey
npm install  # Only if needed
npm run dev

# 6. Open http://localhost:5176
```

### If Using Docker Compose (Simpler)
```bash
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System

# One command to start everything:
docker compose up --build

# Services start at:
# - Database: localhost:1521
# - API: localhost:8080
# - Frontend: localhost:5174  (or 5176 if npm run dev)
```

---

## Verify Everything is Working

### All Green ✅
```
✅ Database running on port 1521
✅ API responding on http://localhost:8080/api
✅ Frontend running on http://localhost:5176
✅ Can create and save surveys to database
```

### Check Each Component
```bash
# Database
lsof -i :1521 && echo "✅ Database OK" || echo "❌ Database DOWN"

# API
curl -s http://localhost:8080/api/surveys && echo "✅ API OK" || echo "❌ API DOWN"

# Frontend
curl -s http://localhost:5176 | grep -q "html" && echo "✅ Frontend OK" || echo "❌ Frontend DOWN"
```

---

## Emergency Reset

If everything is broken and you want to start over:

```bash
# 1. Kill all processes
pkill -f "spring-boot:run"
pkill -f "npm run dev"

# 2. Stop and remove Docker containers
docker compose -f docker-compose.db.yml down -v
docker compose down -v

# 3. Clean Maven cache
cd packages/empsurvey-api
mvn clean

# 4. Start fresh
# Follow "Complete Startup Procedure" above
```

---

## Still Not Working?

1. **Check the Console Logs** - Press F12 in browser, expand each error message
2. **Check API Server Logs** - Look at the terminal where `mvn spring-boot:run` is running
3. **Check Database Logs** - Run `docker logs <container-id>`
4. **Create a GitHub Issue** with:
   - The exact error message from console (F12)
   - Output of: `mvn --version` and `java --version`
   - Output of: `docker ps`
   - API server log (last 20 lines)

---

## Key Files to Check

```
✅ Configuration Files:
- packages/empsurvey/.env  (API URL)
- packages/empsurvey-api/src/main/resources/application.yml  (DB config)
- docker-compose.yml  (Service URLs)

✅ Source Files:
- packages/empsurvey/src/services/api.ts  (API client)
- packages/empsurvey/src/pages/FormBuilder.tsx  (Save logic)
- packages/empsurvey/src/components/SaveSurveyModal.tsx  (Modal)
- packages/empsurvey-api/src/main/java/.../SurveyController.java  (API endpoints)
```

---

## Quick Reference Commands

```bash
# Check ports in use
lsof -i -P -n | grep LISTEN

# Check specific port
lsof -i :8080    # API
lsof -i :1521    # Database
lsof -i :5176    # Frontend

# View logs
tail -f /tmp/empsurvey-api.log
tail -f /tmp/empsurvey-frontend.log
docker logs <container-id> -f

# Kill process by port
lsof -ti:8080 | xargs kill -9
lsof -ti:1521 | xargs kill -9
```

---

**Need Help?** Check the [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) for detailed setup instructions.
