from flask import Blueprint, request, jsonify, session
from services.auth_service import login_user, register_user

auth_bp = Blueprint("auth", __name__)

# 🔐 ĐĂNG NHẬP
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

    # ✅ Lưu thông tin đăng nhập vào session
    session.permanent = True
    session["user"] = {
        "id": result["user"]["id"],
        "username": result["user"]["username"],
        "role": result["user"]["role"],
        "employee_id": result["user"].get("employee_id")
    }

    return jsonify({"message": "Login successful", "user": session["user"]})

# 🔍 XEM NGƯỜI DÙNG HIỆN TẠI (TỪ SESSION)
@auth_bp.route("/me", methods=["GET"])
def current_user():
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401
    return jsonify({"user": user})

# 📝 ĐĂNG KÝ
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    required_fields = ["username", "password", "full_name", "email"]

    # Kiểm tra thiếu trường
    missing = [f for f in required_fields if f not in data or not data[f]]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    result = register_user(data)
    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 201

# 🚪 ĐĂNG XUẤT
@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"})
