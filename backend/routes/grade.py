
from helpers.util import system_message, generate_user_message_for_grading, current_model, additional_feedback_message


def ask_openai(client, messages):
    try:
        response = client.chat.completions.create(
            model=current_model,
            messages=messages,
            temperature=0.3,
            top_p=0.7
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
        messages.append({"role": "assistant", "content": grade_response})
        messages.append(additional_feedback_message)
        response = ask_openai(client, messages)

        if 'error' in response:
            return response['error']

        questions_response = response.choices[0].message.content
        return (grade_response, questions_response)
    except Exception as e:
        return f"An error occurred: {str(e)}"