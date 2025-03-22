from flask import Blueprint, request, jsonify
from services.get_list_employees_service import get_all_employees

employees_bp = Blueprint("employees", __name__)  # Khởi tạo Blueprint

@employees_bp.route("/", methods=["GET"])
def get_list_employees():
    employees = get_all_employees()
    return jsonify(employees)
