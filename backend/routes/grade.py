
from helpers.util import system_message, generate_user_message_for_grading, current_model, is_dev, is_prod 


def ask_openai(client, messages):
    try:
        response = client.chat.completions.create(
            model=current_model,
            messages=messages
        )
        return response
    except Exception as e:
        return {'error': str(e)}
def grade_text(client, question_type, question, essay, test_type="IELTS"):
    try:
        messages=[system_message, generate_user_message_for_grading(test_type, question_type, question, essay)]

        response = ask_openai(client, messages)
        if 'error' in response:
            return response['error']

        grade_response = response.choices[0].message.content
        messages.append({"role": "system", "content": grade_response})

        messages.append({"role": "user", "content": "Provide grammar topics to study based on the essay the user submitted. \
                     Next, print places in the essay with very obvious grammatical mistakes, and how to fix them. \
                     Finally generate 5 basic multiple choice grammar questions based on the grammar topics you chose.\
                     "})
        response = ask_openai(client, messages)

        if 'error' in response:
            return response['error']

        questions_response = response.choices[0].message.content
        return (grade_response, questions_response)
    except Exception as e:
        return f"An error occurred: {str(e)}"