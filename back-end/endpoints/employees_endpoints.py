from flask import Blueprint, request, jsonify
from services.get_list_employees_service import get_all_employees
from services.add_employee_service import add_employee_service
from services.delete_employee_service import delete_employee
# from services.get_employee_by_position_service import get_employees_by_position
from middlewares.auth_middleware import role_required
from services.get_employee_service import get_employee_byID
from services.update_employee_service import update_employee

employees_bp = Blueprint("employees", __name__)  # Khởi tạo Blueprint

@employees_bp.route("/", methods=["GET"])
def get_list_employees():
    employees = get_all_employees()
    return jsonify(employees)

@employees_bp.route('/add-employee', methods=['POST'])
def add_employee():
    REQUIRED_FIELDS = [
        "full_name",
        "email", "phone",
        "date_of_birth", "gender",
        "hire_date", "department_id",
        "position_id"
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
    
@employees_bp.route("/get-employee/<int:employee_id>", methods=["GET"])
def get_employee(employee_id):
    try:
        # Gọi service để lấy dữ liệu nhân viên
        result = get_employee_byID([employee_id])

        # Kiểm tra nếu không có nhân viên nào được tìm thấy
        if not result["employees"]:
            return jsonify({"error": "Employee not found"}), 404

        # Vì chỉ lấy 1 nhân viên nên trả về phần tử đầu tiên
        return jsonify(result["employees"][0]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@employees_bp.route('/delete-employee', methods=['DELETE'])
def delete_employee_endpoint():
    employee_id = request.args.get('employee_id', type=int)
    if not employee_id:
        return jsonify({"success": False, "message": "Missing employee_id"}), 400
    
    result = delete_employee(employee_id)
    if not result.get("success", False):
        return jsonify(result), 400
    
    return jsonify(result), 200

@employees_bp.route("/update/<int:employee_id>", methods=["PUT"])
def update_employee_endpoint(employee_id):
    data = request.get_json()

    # Kiểm tra dữ liệu đầu vào
    required_fields = ["full_name", "phone_number"]
    missing_fields = [field for field in required_fields if not data.get(field)]

    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    result = update_employee(employee_id, data)
    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 200

# @employees_bp.route('/by-position/<int:position_id>', methods=['GET'])
# def get_employees_by_position_endpoint(position_id):
#     result = get_employees_by_position(position_id)
#     if "error" in result:
#         return jsonify(result), 400
#     return jsonify(result), 200 