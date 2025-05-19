from database import get_mysql_connection, get_sqlserver_connection
from datetime import datetime

def update_employee(employee_id, data):
    """
    Cập nhật thông tin nhân viên trong cả MySQL và SQL Server.
    """
    mysql_conn = None
    mysql_cursor = None
    sql_conn = None
    sql_cursor = None

    try:
        # Kiểm tra dữ liệu đầu vào
        if "date_of_birth" in data:
            try:
                data["date_of_birth"] = datetime.strptime(data["date_of_birth"], "%d-%m-%Y").strftime("%Y-%m-%d")
            except ValueError:
                return {"error": "Invalid date format for date_of_birth. Expected format: DD-MM-YYYY"}

        if "hire_date" in data:
            try:
                data["hire_date"] = datetime.strptime(data["hire_date"], "%d-%m-%Y").strftime("%Y-%m-%d")
            except ValueError:
                return {"error": "Invalid date format for hire_date. Expected format: DD-MM-YYYY"}

        # ====== 1. Cập nhật MySQL ======
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor(dictionary=True)

        update_mysql_query = """
            UPDATE employees 
            SET FullName = %s, DepartmentID = %s, PositionID = %s 
            WHERE EmployeeID = %s
        """
        mysql_values = (
            data.get("full_name"),
            data.get("department_id"),
            data.get("position_id"),
            employee_id
        )
        mysql_cursor.execute(update_mysql_query, mysql_values)
        mysql_conn.commit()

        # ====== 2. Cập nhật SQL Server ======
        sql_conn = get_sqlserver_connection()
        sql_cursor = sql_conn.cursor()

        update_sqlserver_query = """
            UPDATE Employees 
            SET FullName = ?, DepartmentID = ?, PositionID = ?, 
                PhoneNumber = ?, DateOfBirth = ?, HireDate = ?,
                Gender = ?
            WHERE EmployeeID = ?
        """
        sqlserver_values = (
            data.get("full_name"),
            data.get("department_id"),
            data.get("position_id"),
            data.get("phone_number"),
            data.get("date_of_birth"),
            data.get("hire_date"),
            data.get("gender"),
            employee_id
        )
        sql_cursor.execute(update_sqlserver_query, sqlserver_values)
        sql_conn.commit()

        return {"message": "Employee updated successfully"}

    except Exception as e:
        if mysql_conn:
            mysql_conn.rollback()
        if sql_conn:
            sql_conn.rollback()
        return {"error": str(e)}

    finally:
        if mysql_cursor:
            mysql_cursor.close()
        if mysql_conn:
            mysql_conn.close()
        if sql_cursor:
            sql_cursor.close()
        if sql_conn:
            sql_conn.close()