#!/bin/bash

# Navigate to the React app directory and install dependencies
echo "Installing React dependencies..."
cd frontend
npm install

# Build the React app
echo "Building React app..."
npm run build

# Optionally, you can copy or move the build directory to the Flask app's static directory
# echo "Moving build to Flask static directory..."
mv build ../backend/static/

# Navigate to the Flask app directory and install Python dependencies
echo "Installing Flask dependencies..."
cd ../backend
pip install -r requirements.txt

echo "Build process completed."

