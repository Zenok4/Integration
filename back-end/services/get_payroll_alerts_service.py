from database import get_mysql_connection, get_sqlserver_connection

def get_all_payroll_alerts():
    # Lấy dữ liệu payroll_alerts từ MySQL
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            pa.*, 
            e.FullName, 
            e.DepartmentID, 
            d.DepartmentName, 
            e.PositionID, 
            p.PositionName, 
            s.BaseSalary, 
            s.Bonus, 
            s.Deductions, 
            s.NetSalary
        FROM payroll_alerts pa
        JOIN employees e ON pa.employee_id = e.EmployeeID
        JOIN salaries s ON pa.employee_id = s.EmployeeID
        LEFT JOIN departments d ON e.DepartmentID = d.DepartmentID
        LEFT JOIN positions p ON e.PositionID = p.PositionID
    """
    cursor.execute(query)
    alerts = cursor.fetchall()
    cursor.close()
    conn.close()

    # Lấy Employees từ SQL Server
    sql_conn = get_sqlserver_connection()
    sql_cursor = sql_conn.cursor()
    sql_cursor.execute("SELECT * FROM Employees")
    columns = [column[0] for column in sql_cursor.description]
    employees_sqlserver = {row[0]: dict(zip(columns, row)) for row in sql_cursor.fetchall()}  # EmployeeID là cột đầu tiên

    # Lấy Human_Notifications từ SQL Server
    sql_cursor.execute("SELECT * FROM Human_Notifications")
    notif_columns = [column[0] for column in sql_cursor.description]
    notifications_sqlserver = {}
    for row in sql_cursor.fetchall():
        notif = dict(zip(notif_columns, row))
        emp_id = notif.get("EmployeeID")
        if emp_id:
            if emp_id not in notifications_sqlserver:
                notifications_sqlserver[emp_id] = []
            notifications_sqlserver[emp_id].append(notif)
    sql_cursor.close()
    sql_conn.close()

    # Mapping thêm thông tin từ SQL Server vào từng alert
    for alert in alerts:
        emp_id = alert['employee_id']
        alert['sqlserver_info'] = employees_sqlserver.get(emp_id)
        alert['notifications'] = notifications_sqlserver.get(emp_id, [])

    return alerts