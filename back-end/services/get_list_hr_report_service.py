from database import get_mysql_connection, get_sqlserver_connection

def get_all_hr_report():

    # Lấy danh sách báo cáo từ SQL Server
    sqlserver_conn = get_sqlserver_connection()
    sqlserver_cursor = sqlserver_conn.cursor()
    sqlserver_cursor.execute("SELECT * FROM HR_Report")
    columns = [column[0] for column in sqlserver_cursor.description]
    sqlserver_reports = {row[0]: dict(zip(columns, row)) for row in sqlserver_cursor.fetchall()}
    sqlserver_conn.close()

    return {
        "message": f"Found {len(sqlserver_reports)} synced reports",
        "reports": sqlserver_reports
    } 