from flask import Blueprint, request, jsonify
from services.get_list_human_notifications_service import get_all_human_notifications
from services.add_human_notifications_service import add_human_notification
from services.delete_human_notifications_service import delete_human_notification

notifications_bp = Blueprint("notifications", __name__)

@notifications_bp.route('/', methods=['GET'])
def get_list_human_notifications():
    notifications = get_all_human_notifications()
    return jsonify(notifications)

@notifications_bp.route('/add-human-notifications', methods=['POST'])
def add_human_notifications_endpoint():
    data = request.get_json()
    try:
        result = add_human_notification(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notifications_bp.route('/delete-human-notifications', methods=['DELETE'])
def delete_human_notifications_endpoint():
    notification_id = request.args.get('notification_id', type=int)
    result = delete_human_notification(notification_id)
    return jsonify(result) 