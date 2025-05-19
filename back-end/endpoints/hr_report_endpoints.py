from flask import Blueprint, request, jsonify
from services.get_list_hr_report_service import get_all_hr_report
from services.add_hr_report_service import add_hr_report
from services.delete_hr_report_service import delete_hr_report

hr_report_bp = Blueprint("hr_reports", __name__)

@hr_report_bp.route('/', methods=['GET'])
def get_list_hr_report():
    try:
        reports = get_all_hr_report()
        return jsonify(reports), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@hr_report_bp.route('/add-hr-report', methods=['POST'])
def add_hr_report_endpoint():
    data = request.get_json()
    result = add_hr_report(data)
    return jsonify(result)

@hr_report_bp.route('/delete-hr-report', methods=['DELETE'])
def delete_hr_report_endpoint():
    report_id = request.args.get('report_id', type=int)
    result = delete_hr_report(report_id)
    return jsonify(result) 