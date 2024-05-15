#!/bin/bash

# Exit on any error encountered
set -e

# Optionally, print commands and their arguments as they are executed
set -x

export FLASK_ENV=production
source backend/.env.production
source .secret.production > /dev/null 2>&1

# Navigate to the Flask app directory
cd backend

# Check for gunicorn in the virtual environment
if ! which gunicorn > /dev/null; then
    echo "Error: gunicorn not found in the PATH."
    exit 1
fi

# Start the Flask app using Gunicorn
echo "Starting Flask app with Gunicorn..."
gunicorn "app:app" --bind 0.0.0.0:8000

echo "Flask app is running."

