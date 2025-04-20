#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting servers..."

# Start Rasa server in the background
echo "🤖 Starting Rasa server..."
cd backend
.\venv\Scripts\activate
rasa run --enable-api --cors "*" --port 5005 &
RASA_PID=$!
cd ..

# Start backend server in the background
echo "🔧 Starting backend server..."
cd backend
python api.py &
BACKEND_PID=$!
cd ..

# Function to handle cleanup on script exit
cleanup() {
    echo "🛑 Stopping all servers..."
    taskkill //F //PID $RASA_PID
    taskkill //F //PID $BACKEND_PID
    exit
}

# Set up trap to catch script termination
trap cleanup SIGINT SIGTERM

echo "✅ Servers are running!"
echo "Press Ctrl+C to stop all servers"

# Keep the script running
wait 