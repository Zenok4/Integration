from database import get_sqlserver_connection

def get_all_human_notifications():
    try:
        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()
        sqlserver_cursor.execute("""
            SELECT n.*, e.FullName, e.Email
            FROM Human_Notifications n
            LEFT JOIN Employees e ON n.EmployeeID = e.EmployeeID
        """)
        columns = [column[0] for column in sqlserver_cursor.description]
        notifications = [dict(zip(columns, row)) for row in sqlserver_cursor.fetchall()]
        sqlserver_conn.close()

        return notifications
    except Exception as e:
        return {"error": f"SQL Server error: {str(e)}"}