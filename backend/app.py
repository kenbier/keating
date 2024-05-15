from flask import Flask, jsonify, send_from_directory, g
from dotenv import load_dotenv
import os
from routes.grade import grade_text
from openai import OpenAI
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import g
import logging
import os
from helpers.util import is_dev, configure_logging, is_prod
from helpers.middleware import apply_snake_case_middleware, conditional_limiter

def create_app():
    # import language_tool_python

    ## Setup the app with middleware
    # tool = language_tool_python.LanguageTool('en-US')

    static_folder='frontend/build/static'
    template_folder='frontend/build'

    if is_prod():
        static_folder='build/static'
        template_folder='build'

    app = Flask(__name__, static_folder=static_folder, template_folder=template_folder)

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

    return app

load_dotenv()
app = create_app()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    app.logger.info("Requested path:", path)
    full_path = os.path.join(app.static_folder, path)
    app.logger.info("Full path:", full_path)
    app.logger.info("Exists:", os.path.exists(full_path))

    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.template_folder, 'index.html')

@app.route('/health')
def health_check():
    return 'OK', 200

@app.route('/grade', methods=['POST'])
@conditional_limiter(app.limiter, "10 per hour")
def grade():
    data = g.json_data
    essay = data['essay']
    question_type = data['question_type']
    question = data['question']

    responses = grade_text(app.openai_client, question_type, question_type, question, essay)
    if isinstance(responses, tuple):
        grade_response, questions_response = responses
        return jsonify(score=grade_response, questions=questions_response)
    else:
        return jsonify(error=responses), 400


if __name__ == "__main__":
    app_host = os.getenv('FLASK_RUN_HOST')
    app_port = os.getenv('FLASK_RUN_PORT')
    app.run(host=app_host, port=app_port)
