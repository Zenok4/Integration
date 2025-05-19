from flask import Blueprint, jsonify
from services.get_list_departments_service import get_all_departments
# from services.get_employee_by_department_service import get_employees_by_department

departments_bp = Blueprint("departments", __name__)

@departments_bp.route('/', methods=['GET'])
def get_list_departments():
    departments = get_all_departments()
    return jsonify(departments)

# @departments_bp.route('/<int:department_id>/employees', methods=['GET'])
# def get_department_employees(department_id):
#     result = get_employees_by_department(department_id)
#     if "error" in result:
#         return jsonify(result), 400
#     return jsonify(result), 200 