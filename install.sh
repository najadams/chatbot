#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting installation process..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Setup backend virtual environment and install dependencies
echo "🐍 Setting up Python virtual environment..."
cd backend
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Deactivate virtual environment
deactivate
cd ..

echo "✅ Installation completed successfully!"
echo "To start the application, run: ./run.sh" 