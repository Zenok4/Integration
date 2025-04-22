from functools import wraps
from flask import session, jsonify

def role_required(allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user = session.get("user")
            if not user:
                return jsonify({"error": "Unauthorized"}), 401
            if user.get("role") not in allowed_roles:
                return jsonify({"error": "Forbidden – insufficient permissions"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
