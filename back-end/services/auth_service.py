from database import get_mysql_connection, get_sqlserver_connection
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from flask import session
from datetime import datetime

def login_user(username, password):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return {"error": "Invalid username or password"}

    # Tạo access token
    access_token = create_access_token(identity={
        "id": user['id'],
        "username": user['username'],
        "role": user['role'],
        "employee_id": user.get('employee_id')
    })

    return {
        "access_token": access_token,
        "user": {
            "id": user['id'],
            "username": user['username'],
            "role": user['role'],
            "full_name": user['full_name'],
            "employee_id": user.get('employee_id')
        }
    }

def create_user_with_employee(data):
    sql_conn = None
    sql_cursor = None
    mysql_conn = None
    mysql_cursor = None
    employee_id = None

    try:
        # ===== 1. Thêm nhân viên vào SQL Server =====
        sql_conn = get_sqlserver_connection()
        sql_cursor = sql_conn.cursor()

        # Chuyển đổi định dạng ngày tháng
        date_of_birth = datetime.strptime(data["date_of_birth"], "%d-%m-%Y").strftime("%Y-%m-%d")
        hire_date = datetime.strptime(data["hire_date"], "%d-%m-%Y").strftime("%Y-%m-%d")

        insert_sqlserver = """
            INSERT INTO Employees (
                FullName, DateOfBirth, Gender, PhoneNumber, Email,
                HireDate, DepartmentID, PositionID, Status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

        department_id = None if data.get("department_id") == "" else data.get("department_id")
        position_id = None if data.get("position_id") == "" else data.get("position_id")

        sqlserver_values = (
            data["full_name"],
            date_of_birth,
            data["gender"],
            data["phone_number"],
            data["email"],
            hire_date,
            department_id,
            position_id,
            data.get("status", "active")
        )

        # Thực hiện INSERT
        sql_cursor.execute(insert_sqlserver, sqlserver_values)

        # Sử dụng @@IDENTITY để lấy EmployeeID
        sql_cursor.execute("SELECT @@IDENTITY AS EmployeeID")
        result = sql_cursor.fetchone()
        if not result or result[0] is None:
            raise Exception("Failed to retrieve EmployeeID from SQL Server using @@IDENTITY")
        employee_id = result[0]
        print(f"Retrieved EmployeeID: {employee_id}")  # Gỡ lỗi

        sql_conn.commit()
        print("SQL Server commit successful")  # Gỡ lỗi

        # ===== 2. Thêm nhân viên vào MySQL =====
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor(dictionary=True)

        insert_mysql_employee = """
            INSERT INTO employees (
                EmployeeID, FullName, DepartmentID, PositionID, Status
            ) VALUES (%s, %s, %s, %s, %s)
        """
        mysql_employee_values = (
            employee_id,
            data["full_name"],
            department_id,
            position_id,
            data.get("status", "active")
        )

        mysql_cursor.execute(insert_mysql_employee, mysql_employee_values)

        # ===== 3. Kiểm tra username đã tồn tại =====
        mysql_cursor.execute("SELECT * FROM users WHERE username = %s", (data["username"],))
        if mysql_cursor.fetchone():
            mysql_conn.rollback()
            return {"error": "Username already exists"}

        # ===== 4. Tạo user mới =====
        password_hash = generate_password_hash(data["password"])

        insert_user_sql = """
            INSERT INTO users (username, password_hash, full_name, email, role, employee_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        user_values = (
            data["username"],
            password_hash,
            data["full_name"],
            data["email"],
            data.get("role", "employee"),
            employee_id
        )

        mysql_cursor.execute(insert_user_sql, user_values)
        mysql_conn.commit()

        return {
            "message": "User and employee created successfully",
            "employee_id": employee_id
        }

    except Exception as e:
        if sql_conn: sql_conn.rollback()
        if mysql_conn: mysql_conn.rollback()
        return {"error": str(e)}

    finally:
        if sql_cursor: sql_cursor.close()
        if sql_conn: sql_conn.close()
        if mysql_cursor: mysql_cursor.close()
        if mysql_conn: mysql_conn.close()