from database import get_mysql_connection, get_sqlserver_connection
from datetime import datetime

def add_employee_service(data):
    mysql_conn = get_mysql_connection()
    mysql_cursor = mysql_conn.cursor(dictionary=True)
    sqlserver_conn = get_sqlserver_connection()
    sqlserver_cursor = sqlserver_conn.cursor()

    try:
        # Chuẩn bị dữ liệu chung
        full_name = data['full_name']
        department_id = int(data['department_id'])
        position_id = int(data['position_id'])
        hire_date = datetime.strptime(data['hire_date'], "%Y-%m-%d").date()
        dob = datetime.strptime(data['date_of_birth'], "%Y-%m-%d").date()
        gender = data['gender']
        phone = data['phone']
        email = data['email']
        status = data.get('status', 'active')
        created_at = datetime.now()
        updated_at = datetime.now()

        # 1. MySQL - Insert
        mysql_sql = """
            INSERT INTO employees (FullName, DepartmentID, PositionID, Status)
            VALUES (%s, %s, %s, %s)
        """
        mysql_data = (full_name, department_id, position_id, status)
        mysql_cursor.execute(mysql_sql, mysql_data)
        mysql_conn.commit()
        employee_id = mysql_cursor.lastrowid

        # 2. SQL Server - Insert đầy đủ
        sql_server_sql = """
            INSERT INTO Employees (
                EmployeeID, FullName, DateOfBirth, Gender, PhoneNumber, Email,
                HireDate, DepartmentID, PositionID, Status, CreatedAt, UpdatedAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        sql_data = (
            employee_id,
            full_name,
            dob,
            gender,
            phone,
            email,
            hire_date,
            department_id,
            position_id,
            status,
            created_at,
            updated_at
        )
        sqlserver_cursor.execute(sql_server_sql, sql_data)
        sqlserver_conn.commit()

        return {
            "message": "Employee added successfully",
            "employee_id": employee_id
        }

    except Exception as e:
        mysql_conn.rollback()
        sqlserver_conn.rollback()
        return {
            "error": str(e)
        }
    finally:
        mysql_cursor.close()
        mysql_conn.close()
        sqlserver_cursor.close()
        sqlserver_conn.close()
