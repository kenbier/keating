#!/bin/bash

# Exit on any error encountered
set -e

# Optionally, print commands and their arguments as they are executed
set -x

export FLASK_ENV=development
source backend/.env.development
source .secret.development

# Navigate to the Flask app directory
cd backend

echo "FLASK_ENV: $FLASK_RUN_HOST"

python app.py 

echo "Flask app is running."

