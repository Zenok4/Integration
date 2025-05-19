from flask import Blueprint, jsonify # type: ignore
from flask import request # type: ignore
from services.get_payroll_alerts_service import get_all_payroll_alerts
from services.add_payroll_alert_service import add_payroll_alert
from services.delete_payroll_alert_service import delete_payroll_alert

alerts_bp = Blueprint('alerts', __name__)

@alerts_bp.route('/', methods=['GET'])
def get_alerts():
    try: 
        alert = get_all_payroll_alerts()
        return jsonify(alert), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@alerts_bp.route('/update-payroll-alerts', methods=['PUT'])
def update_alert():
    try: 
        data = request.get_json()
        alert_id = data.get('id')
        if not alert_id:
            return jsonify({'error': 'Missing alerts ID'}), 400
        
        update_alert = update_payroll_alert(alert_id, data)  # type: ignore
        if not update_alert:
            return jsonify({'error': 'Alert not found'}), 404
    
        return jsonify(update_alert), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@alerts_bp.route("/add-payroll-arlert", methods=["POST"])
def add_payroll_arlert():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "message": "Invalid JSON body"}), 400

    result = add_payroll_alert(data)

    if not result["success"]:
        return jsonify(result), 400

    return jsonify(result), 201

@alerts_bp.route("/delete-payroll-alerts", methods=["DELETE"])
def delete_payroll_alerts_endpoint():
    alert_id = request.args.get("alert_id", type=int)
    if not alert_id:
        return jsonify({"success": False, "message": "Missing alert_id"}), 400
    result = delete_payroll_alert(alert_id)
    if not result["success"]:
        return jsonify(result), 404
    return jsonify(result), 200 