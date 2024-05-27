from flask import Flask, jsonify, send_from_directory, g, request
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
from helpers.util import is_dev, configure_logging, is_prod, hash_sha256
from helpers.middleware import apply_snake_case_middleware, conditional_limiter
import requests

import language_tool_python

from gramformer import Gramformer
import torch
import difflib
import spacy


def set_seed(seed):
  nlp = spacy.load('en_core_web_sm')
  torch.manual_seed(seed)
  if torch.cuda.is_available():
    torch.cuda.manual_seed_all(seed)


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


    meta_token = os.getenv('META_TOKEN')
    meta_pixel = os.getenv('META_PIXEL')

    ## Add things to the app object
    app.openai_client = client
    app.limiter = limiter
    app.meta_token = meta_token
    app.meta_pixel = meta_pixel

    app.tool = language_tool_python.LanguageTool('en-US')
    app.tool.disable_spellchecking()
    app.tool.disabled_rules = ['WHITESPACE_RULE']

    set_seed(1212)
    app.gf = Gramformer(models = 1, use_gpu=False) # 1=corrector, 2=detector
    return app

load_dotenv()
app = create_app()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.template_folder, 'index.html')

@app.route('/health')
def health_check():
    return 'OK', 200

@app.errorhandler(500)
def handle_500(error):
    response = jsonify({
        "error": "Internal Server Error",
        "message": str(error)  # Including the error message if any
    })
    response.status_code = 500
    return response

@app.route('/track', methods=['POST'])
def track_event():
    data = g.json_data
    em = data['user_data']['em']
    data['user_data']['em'] = hash_sha256(em)
    data['user_data']['client_ip_address'] = request.remote_addr  # Capture the IP address
    pixel = app.meta_pixel
    response = requests.post(
        f'https://graph.facebook.com/v12.0/{pixel}/events',
        json={
            'data': [data],
            'access_token': app.meta_token
        }
    )
    return jsonify(response.json()), response.status_code


def fix_essay(tool, essay):
    matches = tool.check(essay)
    ## corrected_text = essay

    corrections = []
    # Collect all corrections in reverse order to avoid offset issues
    for match in sorted(matches, key=lambda m: m.offset, reverse=True):
        start_pos = match.offset
        end_pos = start_pos + match.errorLength
        original_text = essay[start_pos:end_pos]
        correction = {
            "start": start_pos,
            "end": end_pos,
            "replacement": f'<strong><u>{match.replacements[0] if match.replacements else original_text}</u></strong>'
        }
        corrections.append(correction)

    # Apply corrections
    for correction in corrections:
        corrected_text = essay[:correction["start"]] + correction["replacement"] + essay[correction["end"]:]

    explanations = [
        {
            "original": match.context,
            "correction": match.replacements,
            "explanation": match.message
        } for match in matches
    ]

    return (corrected_text, explanations)

def fix_essay_with_gramformer(gf, original_text):
    paragraphs = original_text.split('\n\n')
    corrected_paragraphs = []
    explanations = []
    for paragraph in paragraphs:
        if paragraph.strip():  # Ensure the paragraph is not just whitespace
            sentences = paragraph.split('. ')
            corrected_sentences = []

            for sentence in sentences:
                if not sentence.endswith('.'):
                    sentence += '.'
                original_sentence = sentence
                corrected = list(gf.correct(sentence, max_candidates=1))
                corrected_sentence = corrected[0] if corrected else sentence

                # Append the corrected sentence
                corrected_sentences.append(corrected_sentence)

                # Generate explanations and apply highlighting
                s = difflib.SequenceMatcher(None, original_sentence, corrected_sentence)
                highlighted_sentence = ""
                for tag, i1, i2, j1, j2 in s.get_opcodes():
                    if tag == 'equal':
                        highlighted_sentence += corrected_sentence[j1:j2]
                    elif tag == 'replace':
                        highlighted_sentence += f"<strong><u>{corrected_sentence[j1:j2]}</u></strong>"
                        explanations.append(f"<strong>Changed</strong> from '{original_sentence[i1:i2]}' to '<strong>{corrected_sentence[j1:j2]}</strong>'")
                    elif tag == 'insert':
                        highlighted_sentence += f"<strong><u>{corrected_sentence[j1:j2]}</u></strong>"
                        explanations.append(f"<strong>Added</strong> '{corrected_sentence[j1:j2]}'")
                    elif tag == 'delete':
                        explanations.append(f"<strong>Deleted</strong> '{original_sentence[i1:i2]}'")

                # Replace the original corrected sentence with the highlighted version
                corrected_sentences[-1] = highlighted_sentence

            # Join the corrected (and highlighted) sentences
            corrected_paragraph = ' '.join(corrected_sentences)
            corrected_paragraphs.append(f"<p>{corrected_paragraph}</p>")
        else:
            corrected_paragraphs.append("<p><br><br></p>")  # Add empty paragraphs to maintain structure

    # Join corrected paragraphs back into a single text with highlights
    corrected_text = '\n\n'.join(corrected_paragraphs)
    return (corrected_text, explanations)


@app.route('/grade', methods=['POST'])
@conditional_limiter(app.limiter, "10 per hour")
def grade():
    data = g.json_data
    essay = data['essay']
    question_type = data['question_type']
    question = data['question']

    responses = grade_text(app.openai_client, question_type, question_type, question, essay)
    try:
        ## corrected_text, explanations = fix_essay(app.tool, essay)
        corrected_text, explanations = fix_essay_with_gramformer(app.gf, essay)
    except Exception as e:
        corrected_text, explanations = essay, "Error, try again later."

    if isinstance(responses, tuple):
        grade_response, questions_response = responses
        return jsonify(score=grade_response, questions=questions_response, corrected=corrected_text, explanations=explanations, original=essay)
    else:
        return jsonify(error=responses), 400

if __name__ == "__main__":
    app_host = os.getenv('FLASK_RUN_HOST')
    app_port = os.getenv('FLASK_RUN_PORT')
    app.run(host=app_host, port=app_port)

