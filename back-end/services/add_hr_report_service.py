from database import get_mysql_connection, get_sqlserver_connection
from datetime import datetime

def add_hr_report(data):
    # Thêm vào MySQL
    mysql_conn = get_mysql_connection()
    mysql_cursor = mysql_conn.cursor()
    mysql_sql = """
        INSERT INTO hr_report (Title, Content, CreatedAt)
        VALUES (%s, %s, %s)
    """
    created_at = data.get("created_at") or datetime.now().date()
    mysql_cursor.execute(mysql_sql, (data["title"], data["content"], created_at))
    mysql_conn.commit()
    report_id = mysql_cursor.lastrowid
    mysql_conn.close()

    # Thêm vào SQL Server
    sqlserver_conn = get_sqlserver_connection()
    sqlserver_cursor = sqlserver_conn.cursor()
    sql_sql = """
        INSERT INTO HR_Report (ReportID, Title, Content, CreatedAt)
        VALUES (?, ?, ?, ?)
    """
    sqlserver_cursor.execute(sql_sql, (report_id, data["title"], data["content"], created_at))
    sqlserver_conn.commit()
    sqlserver_conn.close()

    return {"success": True, "report_id": report_id} 