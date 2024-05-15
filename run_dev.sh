#!/bin/bash

# Exit on any error encountered
set -e

# Optionally, print commands and their arguments as they are executed
set -x

export FLASK_ENV=development
source backend/.env.development
source .secret.development > /dev/null 2>&1

# Navigate to the Flask app directory
cd backend

python app.py 

echo "Flask app is running."

