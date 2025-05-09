from database import get_mysql_connection, get_sqlserver_connection

def get_employee_byID(employee_ids=None):
    """Chỉ lấy nhân viên có trong cả MySQL và SQL Server"""

    # 🔹 Lấy danh sách nhân viên từ MySQL
    mysql_conn = get_mysql_connection()
    mysql_cursor = mysql_conn.cursor(dictionary=True)
    format_strings = ','.join(['%s'] * len(employee_ids))
    mysql_cursor.execute(f"SELECT * FROM employees WHERE EmployeeID IN ({format_strings})", tuple(employee_ids))
    mysql_employees = {emp["EmployeeID"]: emp for emp in mysql_cursor.fetchall()}
    mysql_conn.close()

    # 🔹 Lấy danh sách nhân viên từ SQL Server
    sqlserver_conn = get_sqlserver_connection()
    sqlserver_cursor = sqlserver_conn.cursor()
    placeholders = ', '.join(['?'] * len(employee_ids))
    sqlserver_cursor.execute(f"SELECT * FROM Employees WHERE EmployeeID IN ({placeholders})", employee_ids)
    columns = [column[0] for column in sqlserver_cursor.description]
    sqlserver_employees = {row[0]: dict(zip(columns, row)) for row in sqlserver_cursor.fetchall()}
    sqlserver_conn.close()

    # 🔹 Chỉ giữ lại những nhân viên có trong cả hai database
    common_ids = set(mysql_employees.keys()) & set(sqlserver_employees.keys())
    common_employees = [
        {
            "employee_id": emp_id,
            "mysql": mysql_employees[emp_id],
            "sqlserver": sqlserver_employees[emp_id]
        }
        for emp_id in common_ids
    ]

    return {"message": "Employees found", "employees": common_employees}
