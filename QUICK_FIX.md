# 🔍 Quick Diagnostic - "Load failed" Error Fix

## What This Error Means
"Load failed" = Your browser can't reach the API server at `http://localhost:8080/api/surveys`

**The API is NOT running or NOT accessible.**

---

## ✅ Quick Fix (5 minutes)

### Step 1: Check if API is Running
```bash
lsof -i :8080
```

**Expected output:**
```
java 12345 user  ... :8080 (LISTEN)
```

**If nothing shows**: Go to Step 2

### Step 2: Check if Database is Running
```bash
lsof -i :1521
```

**Expected output:**
```
docker ... :1521 (LISTEN)
```

**If nothing shows**: Run this:
```bash
docker compose -f docker-compose.db.yml up -d
```

### Step 3: Start the API
```bash
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System/packages/empsurvey-api
```

**First time only:**
```bash
mvn clean package
```

**Then run:**
```bash
mvn spring-boot:run
```

**Wait for message:** ✅ `Started EmpSurveyApplication in X seconds`

---

## 🔍 Then Test It

### In Browser Console (F12 → Console tab):
You should now see better error messages:

**If API is running:**
```
📡 API Request: POST http://localhost:8080/api/surveys
   Base URL: http://localhost:8080/api
✅ API Success: 201
```

**If API is not running:**
```
🔴 API Request FAILED: Failed to fetch
   URL: http://localhost:8080/api/surveys
   
⚠️  CONNECTION ERROR - The API server might not be running!
   ✅ Make sure to run: cd packages/empsurvey-api && mvn spring-boot:run
   ✅ Check if port 8080 is listening: lsof -i :8080
   ✅ API Base URL: http://localhost:8080/api
```

---

## 📋 Complete Checklist

### Services Must Be Running

| Service | Port | Check Command | Start Command |
|---------|------|---------------|---------------|
| Database | 1521 | `lsof -i :1521` | `docker compose -f docker-compose.db.yml up -d` |
| API | 8080 | `lsof -i :8080` | `cd packages/empsurvey-api && mvn spring-boot:run` |
| Frontend | 5176 | `lsof -i :5176` | `cd packages/empsurvey && npm run dev` |

### All three must show output from `lsof`!

```bash
# Check ALL three at once
lsof -i :1521
lsof -i :8080
lsof -i :5176
```

---

## 🆘 If Still Not Working

### Check .env File
```bash
cat packages/empsurvey/.env
```

Must contain:
```
VITE_API_URL=http://localhost:8080/api
```

If it's different or missing, fix it:
```bash
echo "VITE_API_URL=http://localhost:8080/api" > packages/empsurvey/.env
```

Then reload browser (Ctrl+Shift+R).

---

### Check API Server Logs
Look at the terminal where you ran `mvn spring-boot:run`

**You should see:**
```
... Started EmpSurveyApplication in 3.5 seconds
... JPA Initialized successfully
... Database connection: jdbc:oracle:thin:@localhost:1521/FREEPDB1
```

**If you see errors:**
- Database connection failed → Start database first
- Port 8080 already in use → Kill other Java process
- Maven build errors → Run `mvn clean package` first

---

## 🔧 Nuclear Option: Reset Everything

```bash
# 1. Kill everything
pkill -f "spring-boot:run"
pkill -f "npm run dev"
docker compose -f docker-compose.db.yml down -v

# 2. Wait 5 seconds
sleep 5

# 3. Rebuild
cd packages/empsurvey-api
mvn clean package

# 4. Start fresh (in different terminals)
# Terminal 1:
docker compose -f docker-compose.db.yml up -d

# Terminal 2 (wait 30 seconds for DB to start):
cd packages/empsurvey-api && mvn spring-boot:run

# Terminal 3:
cd packages/empsurvey && npm run dev
```

---

## 🎯 When It's Working

In browser console, you'll see:
```
📝 Saving survey: "Test"
📋 Questions count: 3
🚀 Sending to API...
📡 API Request: POST http://localhost:8080/api/surveys
   Base URL: http://localhost:8080/api
✅ API Success: 201
```

Then the success message appears! 🎉

---

## 📞 Still Stuck?

Copy the **entire error message from browser console (F12)** and follow these steps:

1. **If it says "Failed to fetch"** → API not running (see Step 3 above)
2. **If it says "HTTP 500"** → Database issue (see Check API Server Logs)
3. **If it says "HTTP 404"** → API endpoint doesn't exist (shouldn't happen)
4. **If it says "CORS error"** → Configuration issue (rare)

---

## ✨ Quick Command Reference

```bash
# Test database connection
nc -zv localhost 1521

# Test API connection
curl -X GET http://localhost:8080/api/surveys

# List all Java processes
ps aux | grep java

# Kill Java process by port
lsof -ti:8080 | xargs kill -9

# Check if Maven is installed
mvn --version

# View API server logs (if running in background)
tail -f /tmp/empsurvey-api.log
```

---

**Most likely fix**: Run `mvn spring-boot:run` in the API directory! 🚀

Let me know if you need help with any of these steps.
