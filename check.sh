#!/bin/bash

echo "🔍 ARYA Survey System - Diagnostic Check"
echo "========================================"
echo ""

# Check Java
echo "1️⃣  Checking Java..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | grep 'version' | head -1)
    echo "   ✅ Java found: $JAVA_VERSION"
else
    echo "   ❌ Java not found. Install Java 17+"
fi
echo ""

# Check Maven
echo "2️⃣  Checking Maven..."
if command -v mvn &> /dev/null; then
    MVN_VERSION=$(mvn --version 2>&1 | head -1)
    echo "   ✅ Maven found: $MVN_VERSION"
else
    echo "   ❌ Maven not found. Install with: brew install maven"
fi
echo ""

# Check Docker
echo "3️⃣  Checking Docker..."
if command -v docker &> /dev/null; then
    echo "   ✅ Docker found"
    if docker ps &> /dev/null; then
        echo "   ✅ Docker daemon running"
    else
        echo "   ❌ Docker daemon not running"
    fi
else
    echo "   ❌ Docker not found"
fi
echo ""

# Check ports
echo "4️⃣  Checking Ports..."
echo "   Database (1521):"
if lsof -i :1521 &> /dev/null; then
    echo "   ✅ Port 1521 is open (Database)"
else
    echo "   ⏸️  Port 1521 is closed (Database not running)"
fi

echo "   API (8080):"
if lsof -i :8080 &> /dev/null; then
    echo "   ✅ Port 8080 is open (API)"
else
    echo "   ⏸️  Port 8080 is closed (API not running)"
fi

echo "   Frontend (5176):"
if lsof -i :5176 &> /dev/null; then
    echo "   ✅ Port 5176 is open (Frontend)"
else
    echo "   ⏸️  Port 5176 is closed (Frontend not running)"
fi
echo ""

# Check .env file
echo "5️⃣  Checking Configuration..."
if [ -f "packages/empsurvey/.env" ]; then
    echo "   ✅ .env file exists"
    API_URL=$(grep VITE_API_URL packages/empsurvey/.env | cut -d'=' -f2)
    echo "   API URL: $API_URL"
else
    echo "   ❌ .env file not found in packages/empsurvey/"
fi
echo ""

# Test API connection
echo "6️⃣  Testing API Connection..."
if command -v curl &> /dev/null; then
    RESPONSE=$(curl -s http://localhost:8080/api/surveys 2>&1)
    if [[ $RESPONSE == \[* ]] || [[ $RESPONSE == \{* ]]; then
        echo "   ✅ API is responding: http://localhost:8080/api"
    else
        echo "   ❌ API not responding or connection error"
        echo "   Response: $RESPONSE"
    fi
else
    echo "   ⏸️  curl not available to test API"
fi
echo ""

# Summary
echo "========================================"
echo "📋 SUMMARY"
echo ""
echo "To get started, run these commands:"
echo "1. Start Database: docker compose -f docker-compose.db.yml up -d"
echo "2. Start API: cd packages/empsurvey-api && mvn spring-boot:run"
echo "3. Start Frontend: cd packages/empsurvey && npm run dev"
echo ""
echo "Then access: http://localhost:5176"
echo ""
