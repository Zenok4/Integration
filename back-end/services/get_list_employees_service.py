from database import get_mysql_connection, get_sqlserver_connection

def get_all_employees():
    """Lấy toàn bộ danh sách nhân viên từ MySQL & SQL Server, chỉ giữ những nhân viên có trên cả hai hệ thống"""
    
    # 🔹 Lấy danh sách nhân viên từ MySQL
    mysql_conn = get_mysql_connection()
    mysql_cursor = mysql_conn.cursor(dictionary=True)

    mysql_cursor.execute("SELECT * FROM employees")
    mysql_employees = {emp["employee_id"]: emp for emp in mysql_cursor.fetchall()} #fetchall() là method lấy toàn bộ hàng
    mysql_conn.close()

    # 🔹 Lấy danh sách nhân viên từ SQL Server
    sqlserver_conn = get_sqlserver_connection()
    sqlserver_cursor = sqlserver_conn.cursor()

    sqlserver_cursor.execute("SELECT * FROM employees")
    columns = [column[0] for column in sqlserver_cursor.description]
    sqlserver_employees = {row[0]: dict(zip(columns, row)) for row in sqlserver_cursor.fetchall()}
    sqlserver_conn.close()

    # 🔹 Chỉ lấy những nhân viên có mặt trong cả hai database
    common_ids = set(mysql_employees.keys()) & set(sqlserver_employees.keys()) #Lọc employees được đồng bộ trong cả hai database

    employee_list = [
        {
            "employee_id": emp_id,
            "mysql": mysql_employees[emp_id],
            "sqlserver": sqlserver_employees[emp_id]
        }
        for emp_id in common_ids
    ]

    return {"message": "Employees found", "employees": employee_list}
