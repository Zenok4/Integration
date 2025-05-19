from flask import Blueprint, request, jsonify
from services.get_list_payroll_service import get_all_payroll
from services.get_payroll_service import get_payroll_by_employee, get_salaries_by_employee_and_month, get_average_salary_by_department
from services.delete_payroll_service import delete_payroll_by_id
from services.add_payroll_service import add_payroll
from services.update_payroll_service import update_payroll

payroll_bp = Blueprint("salaries", __name__)

@payroll_bp.route("/", methods=["GET"])
def get_list_payroll():
    salaries = get_all_payroll()
    return jsonify(salaries)

@payroll_bp.route("/delete-payroll", methods=["DELETE"])
def delete_payroll():
    salary_id = request.args.get("salary_id", type=int)

    if salary_id is None:
        return jsonify({"message": "Missing salary_id", "success": False}), 400

    result = delete_payroll_by_id(salary_id)
    
    if not result["success"]:
        return jsonify(result), 404

    return jsonify(result), 200

@payroll_bp.route("/add-payroll", methods=['POST'])
def add_payroll_endpoint():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "message": "Invalid JSON body"}), 400

    result = add_payroll(data)

    if not result["success"]:
        return jsonify(result), 400

    return jsonify(result), 201

@payroll_bp.route("/update-payroll", methods=["PUT"])
def update_payroll_endpoint():
    data = request.get_json()
    salary_id = data.get("salary_id")  

    if not salary_id or not data:
        return jsonify({"success": False, "message": "Thiếu salary_id hoặc dữ liệu"}), 400

    result = update_payroll(salary_id, data)  

    if not result["success"]:
        return jsonify(result), 400

    return jsonify(result), 200

@payroll_bp.route("/employee/<int:employee_id>", methods=["GET"])
def get_employee_payroll(employee_id):
    """
    Endpoint: Lấy bảng lương của một nhân viên.
    """
    result = get_payroll_by_employee(employee_id)

    if "error" in result:
        return jsonify({"error": result["error"]}), 500

    return jsonify(result), 200

@payroll_bp.route("/employee/<int:employee_id>/month/<string:month>", methods=["GET"])
def get_salaries(employee_id, month):
    """
    Lấy dữ liệu lương theo EmployeeID và Tháng
    """
    result = get_salaries_by_employee_and_month(employee_id, month)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 200

@payroll_bp.route("/average", methods=["GET"])
def get_average_salary():
    """
    Tính lương trung bình mỗi phòng ban
    """
    result = get_average_salary_by_department()

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 200