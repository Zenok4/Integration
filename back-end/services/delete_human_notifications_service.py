from database import get_mysql_connection, get_sqlserver_connection

def delete_human_notification(notification_id):
    # Xóa khỏi MySQL
    mysql_conn = get_mysql_connection()
    mysql_cursor = mysql_conn.cursor()
    mysql_cursor.execute("DELETE FROM human_notifications WHERE NotificationID = %s", (notification_id,))
    mysql_conn.commit()
    mysql_conn.close()

    # Xóa khỏi SQL Server
    sqlserver_conn = get_sqlserver_connection()
    sqlserver_cursor = sqlserver_conn.cursor()
    sqlserver_cursor.execute("DELETE FROM Human_Notifications WHERE NotificationID = ?", (notification_id,))
    sqlserver_conn.commit()
    sqlserver_conn.close()

    return {"success": True, "deleted_id": notification_id} 