from flask import request, g
from helpers.util import camel_to_snake, is_prod
from functools import wraps

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
            g.json_data = convert_keys_to_snake(data)

def conditional_limiter(limiter, limit_value):
    def decorator(f):
        if is_prod():
            # Apply the actual rate limiting in production
            return limiter.limit(limit_value)(f)
        else:
            # Return the original function if not in production
            @wraps(f)
            def wrapped(*args, **kwargs):
                return f(*args, **kwargs)
            return wrapped
    return decorator
