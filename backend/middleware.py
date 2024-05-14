from flask import request, g
from util import camel_to_snake

def convert_keys_to_snake(data):
    if isinstance(data, dict):
        return {camel_to_snake(k): convert_keys_to_snake(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_keys_to_snake(elem) for elem in data]
    else:
        return data

def apply_snake_case_middleware(app):
    @app.before_request
    def before_request_func():
        if request.is_json:
            # Convert request JSON data to snake_case
            data = request.get_json()
            print(convert_keys_to_snake(data))
            g.json_data = convert_keys_to_snake(data)

