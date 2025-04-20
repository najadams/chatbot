#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting all servers..."

# Start Rasa server in the background
echo "🤖 Starting Rasa server..."
cd backend
source venv/bin/activate
rasa run --enable-api --cors "*" --port 5005 &
RASA_PID=$!
cd ..

# Start backend server in the background
echo "🔧 Starting backend server..."
cd backend
python api.py &
BACKEND_PID=$!
cd ..

# Start frontend development server
echo "🌐 Starting frontend development server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

# Function to handle cleanup on script exit
cleanup() {
    echo "🛑 Stopping all servers..."
    kill $RASA_PID $BACKEND_PID $FRONTEND_PID
    exit
}

# Set up trap to catch script termination
trap cleanup SIGINT SIGTERM

echo "✅ All servers are running!"
echo "Press Ctrl+C to stop all servers"

# Keep the script running
wait 