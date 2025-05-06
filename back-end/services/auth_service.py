from database import get_mysql_connection, get_sqlserver_connection
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token

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
    try:
        # ====== 1. Tạo nhân viên bên SQL Server ======
        sql_conn = get_sqlserver_connection()
        sql_cursor = sql_conn.cursor()

        insert_employee_sql = """
            INSERT INTO HUMAN_2025.dbo.Employees (
                FullName, DateOfBirth, Gender, PhoneNumber, Email, HireDate, DepartmentID, PositionID, Status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

        employee_values = (
            data["full_name"],
            data["date_of_birth"],
            data["gender"],
            data["phone_number"],
            data["email"],
            data["hire_date"],
            data["department_id"],
            data["position_id"],
            data.get("status", "active")
        )

        sql_cursor.execute(insert_employee_sql, employee_values)
        sql_conn.commit()

        # 🔎 Lấy ID của nhân viên vừa tạo
        sql_cursor.execute("SELECT SCOPE_IDENTITY()")
        employee_id = sql_cursor.fetchone()[0]

        # ====== 2. Tạo tài khoản bên MySQL ======
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor(dictionary=True)

        mysql_cursor.execute("SELECT * FROM users WHERE username = %s", (data["username"],))
        if mysql_cursor.fetchone():
            return {"error": "Username already exists"}

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
        if sql_conn:
            sql_conn.rollback()
        if mysql_conn:
            mysql_conn.rollback()
        return {"error": str(e)}

    finally:
        if sql_cursor: sql_cursor.close()
        if sql_conn: sql_conn.close()
        if mysql_cursor: mysql_cursor.close()
        if mysql_conn: mysql_conn.close()
