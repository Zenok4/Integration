from database import get_mysql_connection, get_sqlserver_connection

def delete_hr_report(report_id):
    # Xóa khỏi MySQL
    mysql_conn = get_mysql_connection()
    mysql_cursor = mysql_conn.cursor()
    mysql_cursor.execute("DELETE FROM hr_report WHERE ReportID = %s", (report_id,))
    mysql_conn.commit()
    mysql_conn.close()

    # Xóa khỏi SQL Server
    sqlserver_conn = get_sqlserver_connection()
    sqlserver_cursor = sqlserver_conn.cursor()
    sqlserver_cursor.execute("DELETE FROM HR_Report WHERE ReportID = ?", (report_id,))
    sqlserver_conn.commit()
    sqlserver_conn.close()

    return {"success": True, "deleted_id": report_id} 