#!/bin/bash

echo "🔍 Testing Smart Attendance System Backend..."
echo ""

# Test if backend is running
echo "1️⃣ Checking if backend is running on port 5000..."
if curl -s http://localhost:5000/ > /dev/null 2>&1; then
    echo "✅ Backend is running!"
    curl -s http://localhost:5000/ | jq . 2>/dev/null || curl -s http://localhost:5000/
else
    echo "❌ Backend is NOT running!"
    echo ""
    echo "💡 To start backend:"
    echo "   cd backend"
    echo "   npm run dev"
    echo ""
    exit 1
fi

echo ""
echo "2️⃣ Testing signup endpoint..."
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"employee"}')

if echo "$SIGNUP_RESPONSE" | grep -q "token"; then
    echo "✅ Signup endpoint working!"
else
    echo "⚠️  Signup response:"
    echo "$SIGNUP_RESPONSE" | jq . 2>/dev/null || echo "$SIGNUP_RESPONSE"
fi

echo ""
echo "3️⃣ Testing login endpoint..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo "✅ Login endpoint working!"
else
    echo "⚠️  Login response:"
    echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"
fi

echo ""
echo "✅ Backend test complete!"
