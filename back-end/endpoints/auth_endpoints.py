from flask import Blueprint, request, jsonify, session
from services.auth_service import login_user, create_user_with_employee
from middlewares.auth_middleware import role_required

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    result = login_user(username, password)

    if "error" in result:
        return jsonify(result), 401

    # Lưu session
    session.permanent = True
    session["user"] = {
        "id": result["user"]["id"],
        "username": result["user"]["username"],
        "role": result["user"]["role"],
        "employee_id": result["user"].get("employee_id")
    }

    return jsonify({
        "message": "Login successful",
        "user": session["user"],
        "access_token": result["access_token"]
    })

@auth_bp.route("/create-user", methods=["POST"])
@role_required(["admin", "hr_manager"])
def create_user():
    data = request.get_json()
    required_fields = [
        "username", "password", "full_name", "email", "date_of_birth", "gender",
        "phone_number", "hire_date", "department_id", "position_id"
    ]

    missing = [f for f in required_fields if f not in data or not data[f]]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    result = create_user_with_employee(data)
    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 201

@auth_bp.route("/me", methods=["GET"])
def current_user():
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401
    return jsonify({"user": user})

@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"})
