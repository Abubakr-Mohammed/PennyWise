from functools import wraps
from flask import request, jsonify, current_app
import jwt


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"status": "error", "message": "Token is missing"}), 401

        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token, current_app.environ['SECRET_KEY'], algorithms=["HS256"])
            user_id = payload.get('user_id')
        except Exception:
            return jsonify({"status": "error", "message": "Invalid token"}), 401

        return f(user_id=user_id, *args, **kwargs)

    return decorated
