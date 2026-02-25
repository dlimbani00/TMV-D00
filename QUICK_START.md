# ⚡ QUICK START - Copy & Paste Commands

## Prerequisites Check
```bash
java -version    # Should be Java 17+
mvn --version    # Should be Maven 3.6+
docker --version # Should exist
```

If any are missing, install them first.

---

## 🚀 Option A: Run Everything Locally (Recommended for Development)

### Terminal 1: Start Database
```bash
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System
docker compose -f docker-compose.db.yml up -d
```
Wait for message: `[+] Running` and `oracle` container is up

### Terminal 2: Start API Server
```bash
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System/packages/empsurvey-api
mvn clean package
mvn spring-boot:run
```
Wait for message: ✅ `Started EmpSurveyApplication`

### Terminal 3: Start React Frontend
```bash
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System/packages/empsurvey
npm run dev
```
Wait for message: ✅ `Local: http://localhost:5176`

### Then Open
```
http://localhost:5176
```

---

## 🐳 Option B: Run with Docker Compose (One Command)

```bash
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System
docker compose up --build
```

Then open:
```
http://localhost:5174
```

(Or if running npm run dev locally: http://localhost:5176)

---

## ✅ Test That It's Working

### Browser Console (F12)
1. Create a survey
2. Click "Save" button
3. Enter survey name: "Test Survey"
4. Click "Save" button
5. **Look in Console (F12 → Console tab)**

You should see:
```
📝 Saving survey: "Test Survey"
📋 Questions count: 3
🚀 Sending to API...
📡 API Request: POST http://localhost:8080/api
✅ API Success: 201
✅ Survey created successfully! ID: 1
```

**SUCCESS!** ✨ Your survey was saved to the database!

---

## 🛑 Stop Everything

```bash
# Kill API and Frontend
pkill -f "spring-boot:run"
pkill -f "npm run dev"

# Stop database
docker compose -f docker-compose.db.yml down
```

---

## 📱 Verify Services Are Running

```bash
# Check database (should show open port 1521)
lsof -i :1521

# Check API (should show open port 8080)
lsof -i :8080

# Check frontend (should show open port 5176 or 5174)
lsof -i :5176
lsof -i :5174

# Or test API in terminal
curl http://localhost:8080/api/surveys
```

Expected output: `[]` (empty array)

---

## 🎯 What This Does

### Option A (Terminal Commands)
- **Terminal 1**: Starts Oracle Database in Docker container
- **Terminal 2**: Builds and runs Spring Boot API (port 8080)
- **Terminal 3**: Starts Vite dev server for React (port 5176)

### Option B (Docker Compose)
- One command starts all 3 services in containers
- API accessible at: http://localhost:8080/api
- Frontend: http://localhost:5174

---

## 📋 Save Flow

1. Click **Save** button → Modal popup appears
2. Type survey name → Name gets validated
3. Click **Save** button in modal → API call sent
4. **API creates/updates** survey in database
5. Success message displayed → Modal closes

---

## 🆘 If It Doesn't Work

See **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for:
- "Cannot connect to API" → API not running
- "HTTP 500 Error" → Database issue
- "CORS error" → Port configuration
- And many more scenarios with solutions

---

## 🔑 Key URLs

```
Frontend:  http://localhost:5176  (dev) or http://localhost:5174 (docker)
API Base:  http://localhost:8080/api
Database:  localhost:1521/FREEPDB1 (Oracle)
```

---

## 📝 Notes

- `.env` file is already created in `packages/empsurvey/`
- Database schema is initialized automatically
- API documentation available at the endpoints
- All surveys are stored in Oracle Database
- Check browser console (F12) for detailed logs

---

**You're ready! Pick Option A or B and start the services.** 🚀
