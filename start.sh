#!/bin/bash

set -e

echo "🚀 Starting ARYA Survey System..."
echo ""

PROJECT_ROOT="/Users/keyur/AI Projects/ARYA Design System"
cd "$PROJECT_ROOT"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to wait for port to be available
wait_for_port() {
    PORT=$1
    SERVICE=$2
    echo "${BLUE}⏳ Waiting for $SERVICE to start (port $PORT)...${NC}"
    
    for i in {1..30}; do
        if lsof -i :$PORT &> /dev/null; then
            echo "${GREEN}✅ $SERVICE is ready!${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
    done
    
    echo "${YELLOW}⚠️  $SERVICE did not start within 30 seconds${NC}"
    return 1
}

# Step 1: Start Database
echo "${BLUE}1️⃣  Starting Oracle Database...${NC}"
docker compose -f docker-compose.db.yml up -d
wait_for_port 1521 "Database"
echo ""

# Step 2: Build and Start API
echo "${BLUE}2️⃣  Building Spring Boot API...${NC}"
cd "$PROJECT_ROOT/packages/empsurvey-api"
mvn clean package -q
echo "${GREEN}✅ API Built${NC}"
echo ""

echo "${BLUE}3️⃣  Starting Spring Boot API (background process)...${NC}"
mvn spring-boot:run > /tmp/empsurvey-api.log 2>&1 &
API_PID=$!
echo "   PID: $API_PID"
wait_for_port 8080 "API"
echo ""

# Step 3: Start Frontend
echo "${BLUE}4️⃣  Starting React Frontend (background process)...${NC}"
cd "$PROJECT_ROOT/packages/empsurvey"
npm run dev > /tmp/empsurvey-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   PID: $FRONTEND_PID"
wait_for_port 5176 "Frontend"
echo ""

# Success message
echo "${GREEN}============================================${NC}"
echo "${GREEN}✅ All services started successfully!${NC}"
echo "${GREEN}============================================${NC}"
echo ""
echo "🌐 Access the Application:"
echo "   Frontend: ${BLUE}http://localhost:5176${NC}"
echo "   API: ${BLUE}http://localhost:8080/api${NC}"
echo ""
echo "📊 Running Services:"
echo "   Database PID: docker (port 1521)"
echo "   API PID: $API_PID (port 8080)"
echo "   Frontend PID: $FRONTEND_PID (port 5176)"
echo ""
echo "📝 Logs:"
echo "   API: tail -f /tmp/empsurvey-api.log"
echo "   Frontend: tail -f /tmp/empsurvey-frontend.log"
echo ""
echo "🛑 To stop all services, run:"
echo "   pkill -f 'spring-boot:run' && pkill -f 'npm run dev' && docker compose -f docker-compose.db.yml down"
echo ""
