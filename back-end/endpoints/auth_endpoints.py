from flask import Blueprint, request, jsonify, session
from services.auth_service import login_user, create_user_with_employee, get_all_users, update_user_and_employee, delete_user_and_employee, update_user_role, change_password, update_profile
from middlewares.auth_middleware import role_required
from datetime import timedelta

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

    # Thiết lập thời gian tồn tại của session
    session.permanent = True

    # Lưu session
    session["user"] = {
        "id": result["user"]["id"],
        "username": result["user"]["username"],
        "role": result["user"]["role"],
        "employee_id": result["user"].get("employee_id")
    }

    print(f"Session lưu: {session['user']}")  # Debug

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
        "phone_number", "hire_date",
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

@auth_bp.route("/users", methods=["GET"])
def get_users():
    """
    API lấy danh sách tài khoản kèm thông tin nhân viên.
    """
    try:
        result = get_all_users()
        if "error" in result:
            return jsonify(result), 500
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@auth_bp.route("/users/update/<int:user_id>", methods=["PUT"])
@role_required(["admin"])
def update_user(user_id):
    """
    API cập nhật thông tin user và nhân viên, bao gồm cả mật khẩu.
    """
    data = request.get_json()

    # Kiểm tra yêu cầu
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    result = update_user_and_employee(user_id, data)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 200
    
@auth_bp.route("/users/delete/<int:user_id>", methods=["DELETE"])
@role_required(["admin"])
def delete_user(user_id):
    """
    API xóa user và nhân viên liên quan.
    """
    result = delete_user_and_employee(user_id)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 200

@auth_bp.route("/users/update-role/<int:user_id>", methods=["PUT"])
@role_required(["admin"])
def update_role(user_id):
    """
    API cập nhật vai trò của user.
    """
    data = request.get_json()
    new_role = data.get("role")

    if not new_role:
        return jsonify({"error": "Role is required"}), 400

    result = update_user_role(user_id, new_role)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 200

@auth_bp.route("/change-password", methods=["POST"])
def change_user_password():
    """
    API thay đổi mật khẩu người dùng.
    """
    data = request.get_json()
    
    # Kiểm tra dữ liệu đầu vào
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not current_password or not new_password:
        return jsonify({"error": "Both current and new passwords are required"}), 400

    # Lấy thông tin người dùng từ session
    user = session.get("user")
    if not user:
        return jsonify({"error": "User not logged in"}), 401

    user_id = user["id"]

    # Thay đổi mật khẩu
    result = change_password(user_id, current_password, new_password)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 200

@auth_bp.route("/profile/update", methods=["PUT"])
def update_user_profile():
    """
    Cập nhật thông tin profile người dùng.
    """
    try:
        # Kiểm tra session
        user = session.get("user")
        if not user:
            return jsonify({"error": "Not logged in"}), 401

        user_id = user["id"]
        data = request.json

        required_fields = ["full_name", "email", "phone_number"]
        missing_fields = [field for field in required_fields if field not in data or not data[field]]

        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "missing_fields": missing_fields
            }), 400

        result = update_profile(user_id, data)

        if "error" in result:
            return jsonify(result), 400

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500