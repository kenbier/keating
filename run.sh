#!/bin/bash

# Navigate to the Flask app directory
cd backend

# Start the Flask app using Gunicorn
echo "Starting Flask app with Gunicorn..."
gunicorn "app:app" --bind 0.0.0.0:8000

echo "Flask app is running."

