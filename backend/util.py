import re

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

current_model = "ft:gpt-3.5-turbo-0125:personal::9ODUhuCx"
### current_model = "ft:gpt-3.5-turbo-0125:personal::9Lgy9k53"