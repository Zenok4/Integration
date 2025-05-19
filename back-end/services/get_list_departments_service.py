from database import get_mysql_connection, get_sqlserver_connection

def get_all_departments():
    # Lấy danh sách phòng ban từ MySQL
    # mysql_conn = get_mysql_connection()
    # mysql_cursor = mysql_conn.cursor(dictionary=True)
    # mysql_cursor.execute("SELECT * FROM departments")
    # mysql_departments = {dep["DepartmentID"]: dep for dep in mysql_cursor.fetchall()}
    # mysql_conn.close()

    # Lấy danh sách phòng ban từ SQL Server
    sqlserver_conn = get_sqlserver_connection()
    sqlserver_cursor = sqlserver_conn.cursor()
    sqlserver_cursor.execute("SELECT * FROM Departments")
    columns = [column[0] for column in sqlserver_cursor.description]
    sqlserver_departments = {row[0]: dict(zip(columns, row)) for row in sqlserver_cursor.fetchall()}
    sqlserver_conn.close()

    # Chỉ lấy những phòng ban có mặt trong cả hai database
    # common_ids = set(mysql_departments.keys()) & set(sqlserver_departments.keys())
    # department_list = []
    # for dep_id in common_ids:
    #     department_list.append({
    #         "department_id": dep_id,
    #         "mysql": mysql_departments[dep_id],
    #         "sqlserver": sqlserver_departments[dep_id]
    #     })

    return {
        "message": f"Found {len(sqlserver_departments)} departments",
        "departments": sqlserver_departments
    } 