from flask import Blueprint, request, jsonify
from services.get_list_employees_service import get_all_employees
from services.add_employee_service import add_employee_service

employees_bp = Blueprint("employees", __name__)  # Khởi tạo Blueprint

@employees_bp.route("/", methods=["GET"])
def get_list_employees():
    employees = get_all_employees()
    return jsonify(employees)

@employees_bp.route('/add-employee', methods=['POST'])
def add_employee():
    REQUIRED_FIELDS = [
    "first_name", "last_name", "email", "phone",
    "hire_date", "department_id", "job_id", "salary", "applicant_id", "status"
    ]
    
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Kiểm tra thiếu trường
        missing_fields = [field for field in REQUIRED_FIELDS if field not in data or data[field] is None]
        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "missing_fields": missing_fields
            }), 400

        result = add_employee_service(data)

        if 'error' in result:
            return jsonify(result), 400

        return jsonify(result), 201

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500