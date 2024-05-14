from flask import Flask, request, jsonify, send_from_directory, g
from openai import OpenAI
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import os
import constants as constants
from middleware import apply_snake_case_middleware
from util import system_message, generate_user_message_for_grading, current_model
import logging

app = Flask(__name__, static_folder='frontend/build/static', template_folder='frontend/build')

# import language_tool_python

def configure_logging(level):
    logging_level = logging.DEBUG if level == "development" else logging.WARNING
    logging.basicConfig(level=logging_level, format='%(asctime)s - %(levelname)s - %(message)s')

def load_env(dot_env_file):
    dotenv_path = os.path.join(os.path.dirname(__file__), dotenv_file)
    print(dotenv_path)
    load_dotenv()

## Load the dev env from the file system if we are in dev mode
env_config = os.getenv('FLASK_ENV', 'development')  # Default to 'development' if not specified
if env_config == 'development':
    configure_logging("development")    
    app.logger.info("loading dev env")
    dotenv_file = '.env.development'
    load_dotenv(dotenv_file)
else:
    configure_logging("production")    
    app.logger.info("loading production env")
    dotenv_file = '.env.production'
    load_dotenv(dotenv_file)
    
## Setup the app with middleware
# tool = language_tool_python.LanguageTool('en-US')
apply_snake_case_middleware(app)
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key not found. Please ensure it's set in the environment variables.")
client = OpenAI(api_key=OPENAI_API_KEY)

if os.getenv('FLASK_ENV') == 'development':
    # Enable CORS only for development mode
    app.logger.info("dev mode enabled")
    CORS(app)
else:
    # Configure other settings for production mode if needed
    app.logger.info("prod mode enabled")
    limiter = Limiter(
        app,
        key_func=get_remote_address,
        default_limits=["250 per day", "100 per hour"]
    )

def ask_openai(messages):
    try:
        response = client.chat.completions.create(
            model=current_model,
            messages=messages
        )
        return response
    except Exception as e:
        return {'error': str(e)}

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if app.debug:
        return "Running in development mode, please load React from the dev server"
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.template_folder, 'index.html')

@app.route('/health')
def health_check():
    return 'OK', 200

@app.route('/grade', methods=['POST'])
# @limiter.limit("10 per hour")
def grade():
    data = g.json_data
    essay = data['essay']
    question_type = data['question_type']
    question = data['question']
    
    ## responses = (constants.grades_hardcoded, constants.questions_hardcoded)
    responses = grade_text(question_type, question_type, question, essay)
    if isinstance(responses, tuple):
        grade_response, questions_response = responses
        return jsonify(score=grade_response, questions=questions_response)
    else:
        return jsonify(error=responses), 400

def grade_text(question_type, question, essay, test_type="IELTS"):
    try:
        messages=[system_message, generate_user_message_for_grading(test_type, question_type, question, essay)]

        response = ask_openai(messages)
        if 'error' in response:
            return response['error']

        grade_response = response.choices[0].message.content
        messages.append({"role": "system", "content": grade_response})

        messages.append({"role": "user", "content": "Provide grammar topics to study based on the essay the user submitted. \
                     Next, print places in the essay with very obvious grammatical mistakes, and how to fix them. \
                     Finally generate 5 basic multiple choice grammar questions based on the grammar topics you chose.\
                     "})
        response = ask_openai(messages)

        if 'error' in response:
            return response['error']

        questions_response = response.choices[0].message.content
        return (grade_response, questions_response)
    except Exception as e:
        return f"An error occurred: {str(e)}"


if __name__ == "__main__":
    app_host = os.getenv('FLASK_RUN_HOST')
    app_port = os.getenv('FLASK_RUN_PORT')
    print(app_host)
    print(app_port)
    app.run(host=app_host, port=app_port)
