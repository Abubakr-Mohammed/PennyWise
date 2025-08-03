from functools import wraps
from flask import request, jsonify

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"status": "error", "message": "Token is missing"}), 401

        try:
            # Extract token (user_id for now)
            token = auth_header.split(" ")[1]
            user_id = int(token)  # In real apps, decode JWT instead
        except Exception:
            return jsonify({"status": "error", "message": "Invalid token"}), 401

        return f(user_id=user_id, *args, **kwargs)

    return decorated
