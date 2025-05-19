from database import get_sqlserver_connection
from datetime import datetime

def add_human_notification(data):
    anniversary_date = data.get("AnniversaryDate")
    if isinstance(anniversary_date, str):
        # Chuyển đổi định dạng thành YYYY-MM-DD HH:MM:SS
        anniversary_date = datetime.fromisoformat(anniversary_date.replace("Z", "+00:00")).strftime("%Y-%m-%d %H:%M:%S")

    sqlserver_conn = None
    sqlserver_cursor = None
    notification_id = None
    response = {"success": False, "message": "", "notification_id": None}

    try:
        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()

        insert_query = '''
            INSERT INTO Human_Notifications (EmployeeID, AnniversaryDate, TargetType, Message)
            VALUES (?, ?, ?, ?)
        '''
        sqlserver_cursor.execute(insert_query, (
            data.get("EmployeeID"),
            anniversary_date,
            data.get("TargetType"),
            data.get("message"),
        ))

        sqlserver_cursor.execute("SELECT SCOPE_IDENTITY()")
        notification_id = sqlserver_cursor.fetchone()[0]

        sqlserver_conn.commit()
        response["success"] = True
        response["message"] = "Notification added successfully."
        response["notification_id"] = notification_id

    except Exception as e:
        if sqlserver_conn:
            sqlserver_conn.rollback()
        response["message"] = f"Failed to add notification: {str(e)}"
        raise e
    finally:
        if sqlserver_cursor:
            sqlserver_cursor.close()
        if sqlserver_conn:
            sqlserver_conn.close()

    return response
