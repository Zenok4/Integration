from flask import Blueprint, request, jsonify
# from services.update_notification_service import update_notification
from services.get_list_human_notifications_service import get_all_human_notifications
from database import get_sqlserver_connection

notification_bp = Blueprint("notification", __name__)

# @notification_bp.route("/update-human-notification", methods=["PUT"])
# def update_notification():
#     data = request.json
#     result = update_notification_service(data) # type: ignore
#     if 'error' in result:
#         return jsonify(result), 400
#     return jsonify(result)

@notification_bp.route("/", methods=["GET"])
def get_notifications():
    try:
        data = get_all_human_notifications()
        # Trả về trực tiếp mảng notifications
        return jsonify(data.get("notifications", [])), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notification_bp.route("/<int:notification_id>", methods=["GET"])
def get_notification_detail(notification_id):
    conn = get_sqlserver_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT n.NotificationID, n.EmployeeID, n.AnniversaryDate, n.TargetType, n.Message, n.CreatedAt,
               e.FullName, e.Email
        FROM Human_Notifications n
        LEFT JOIN Employees e ON n.EmployeeID = e.EmployeeID
        WHERE n.NotificationID = ?
    """, (notification_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return jsonify({"error": "Notification not found"}), 404
    keys = ["NotificationID", "EmployeeID", "AnniversaryDate", "TargetType", "Message", "CreatedAt", "FullName", "Email"]
    data = dict(zip(keys, row))
    # Đóng gói thông tin nhân viên vào trường Employee
    data["Employee"] = {"FullName": data.pop("FullName"), "Email": data.pop("Email")}
    return jsonify(data)