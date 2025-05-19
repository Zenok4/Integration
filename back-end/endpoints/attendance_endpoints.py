from flask import Blueprint, request, jsonify
from services.attendance_service import get_attendance_with_employee

attendance_bp = Blueprint("attendance", __name__)

@attendance_bp.route("/employee/<int:employee_id>", methods=["GET"])
def get_attendance_by_employee(employee_id):
    result = get_attendance_with_employee(employee_id=employee_id)
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result), 200

@attendance_bp.route("/month/<string:month>", methods=["GET"])
def get_attendance_by_month(month):
    result = get_attendance_with_employee(month=month)
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result), 200

@attendance_bp.route("/employee/<int:employee_id>/month/<string:month>", methods=["GET"])
def get_attendance_by_employee_and_month(employee_id, month):
    result = get_attendance_with_employee(employee_id=employee_id, month=month)
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result), 200
