from openai import OpenAI
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import g
import logging 
import os
from helpers.util import is_dev, configure_logging
from helpers.middleware import apply_snake_case_middleware

def load_app(app):
    # import language_tool_python
 
    ## Setup the app with middleware
    # tool = language_tool_python.LanguageTool('en-US')

    apply_snake_case_middleware(app)
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    if not OPENAI_API_KEY:
        raise ValueError("OpenAI API key not found. Please ensure it's set in the environment variables.")
    client = OpenAI(api_key=OPENAI_API_KEY)
    limiter = Limiter(key_func=get_remote_address, app=app)

    ## Dev vs Prod setup
    if is_dev(): 
        # Enable CORS only for development mode
        configure_logging(logging.DEBUG)    
        app.logger.info("dev mode enabled")
        CORS(app)
    else:
        # Configure other settings for production mode if needed
        configure_logging(logging.WARNING)    
        app.logger.info("prod mode enabled")

    ## Add things to the app object
    app.openai_client = client
    app.limiter = limiter
