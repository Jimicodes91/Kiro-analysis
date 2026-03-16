#!/bin/bash

# Pylott Frontend - Ngrok Setup Script
# This script starts the Vite dev server and exposes it via ngrok

echo "🚀 Starting Pylott Frontend with Ngrok..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ Error: ngrok is not installed"
    echo ""
    echo "Please install ngrok first:"
    echo "  brew install ngrok"
    echo ""
    echo "Then configure your auth token:"
    echo "  ngrok config add-authtoken YOUR_TOKEN"
    echo ""
    echo "Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken"
    exit 1
fi

# Check if auth token is configured
if ! ngrok config check &> /dev/null; then
    echo "⚠️  Warning: ngrok auth token may not be configured"
    echo ""
    echo "If ngrok fails to start, configure your auth token:"
    echo "  ngrok config add-authtoken YOUR_TOKEN"
    echo ""
    echo "Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken"
    echo ""
fi

# Start Vite dev server in background
echo "📦 Starting Vite dev server on port 3000..."
npm run dev &
VITE_PID=$!

# Wait for Vite to start
echo "⏳ Waiting for Vite to start..."
sleep 5

# Start ngrok
echo "🌐 Starting ngrok tunnel..."
echo ""
echo "📱 Your app will be accessible at the ngrok URL shown below"
echo "🔗 Share this URL to access from any device/network"
echo ""
echo "Press Ctrl+C to stop both Vite and ngrok"
echo ""

# Trap Ctrl+C to kill both processes
trap "echo ''; echo '🛑 Stopping services...'; kill $VITE_PID; exit" INT

# Start ngrok (this will block until Ctrl+C)
ngrok http 3000

# Cleanup (in case ngrok exits without Ctrl+C)
kill $VITE_PID 2>/dev/null
