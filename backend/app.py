from flask import Flask, jsonify, send_from_directory, g
from dotenv import load_dotenv
import os
from helpers.middleware import conditional_limiter
from routes.grade import grade_text
from helpers.setup import load_app

app = Flask(__name__, static_folder='frontend/build/static', template_folder='frontend/build')
load_dotenv()
load_app(app)

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
