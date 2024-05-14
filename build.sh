#!/bin/bash

# Exit script on error
set -e

# Optionally, print commands and their arguments as they are executed
set -x

# Navigate to the React app directory and install dependencies
echo "Installing React dependencies..."
cd frontend
npm install || { echo 'npm install failed'; exit 1; }

# Build the React app
echo "Building React app..."
npm run build || { echo 'npm run build failed'; exit 1; }

# Optionally, you can copy or move the build directory to the Flask app's static directory
# echo "Moving build to Flask static directory..."
mv build ../backend/static/

# Navigate to the Flask app directory and install Python dependencies
echo "Installing Flask dependencies..."
cd ../backend
pip install -r requirements.txt || { echo 'pip install failed'; exit 1; }

echo "Build process completed."

