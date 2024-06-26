import re
import os
import logging
import hashlib

def camel_to_snake(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()



system_message = {
        "role": "system",
        "content": "You are an English tutor grading written essays. These can include IELTS, OET, CAE, TOEFL, etc."
    }

def generate_user_message_for_grading(test_type, question_type, question, essay):

    question_content = {
        "Task Type": question_type,
        "Test Type": test_type,
        "Question": question,
        "Essay": essay,
    }

    return {
        "role": "user",
        "content": "\n".join([f"{key}: {value}" for key, value in question_content.items()])
    }

additional_feedback_message = {"role": "user", "content": "Provide grammar topics to study based on the essay the user submitted. \
                     Next, print places in the essay with very obvious grammatical mistakes, and explain how to fix them. \
                     Make sure the edited sentence is not the same as the original.\
                     Finally generate 5 basic multiple choice grammar questions based on the grammar topics you chose.\
                     "}

current_model = "ft:gpt-3.5-turbo-0125:personal::9ODUhuCx"

def is_prod():
    return os.getenv('FLASK_ENV') == 'production'

def is_dev():
    return not is_prod()

def configure_logging(logging_level):
    logging.basicConfig(level=logging_level, format='%(asctime)s - %(levelname)s - %(message)s')

def hash_sha256(data):
    """Hash the given data using SHA256 and return the hexadecimal representation."""
    return hashlib.sha256(data.encode()).hexdigest()