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

def get_all_users():
    """
    Lấy danh sách tài khoản kèm thông tin chi tiết nhân viên từ MySQL và SQL Server.
    """
    try:
        # 🔷 Lấy danh sách tài khoản từ MySQL
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor(dictionary=True)

        mysql_cursor.execute("""
            SELECT 
                u.id, u.username, u.email, u.role, u.employee_id, u.created_at,
                e.FullName, e.DepartmentID, e.PositionID, e.Status
            FROM users u
            LEFT JOIN employees e ON u.employee_id = e.EmployeeID
        """)
        users = mysql_cursor.fetchall()
        mysql_conn.close()

        # 🔷 Lấy thông tin chi tiết từ SQL Server
        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()

        sqlserver_cursor.execute("""
            SELECT 
                EmployeeID, FullName, DateOfBirth, Gender, PhoneNumber, Email,
                HireDate, DepartmentID, PositionID, Status
            FROM Employees
        """)
        columns = [column[0] for column in sqlserver_cursor.description]
        sqlserver_employees = {row[0]: dict(zip(columns, row)) for row in sqlserver_cursor.fetchall()}
        sqlserver_conn.close()

        # 🔷 Kết hợp dữ liệu
        for user in users:
            employee_id = user["employee_id"]
            # Nếu có thông tin nhân viên từ SQL Server, kết hợp dữ liệu
            if employee_id in sqlserver_employees:
                user["employee_details"] = sqlserver_employees[employee_id]

        return {"message": "Users fetched successfully", "users": users}

    except Exception as e:
        return {"error": str(e)}
    
def update_user_and_employee(user_id, data):
    """
    Cập nhật thông tin tài khoản và nhân viên.
    """
    sql_conn = None
    sql_cursor = None
    mysql_conn = None
    mysql_cursor = None

    try:
        # Lấy employee_id từ bảng users
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor(dictionary=True)
        mysql_cursor.execute("SELECT employee_id FROM users WHERE id = %s", (user_id,))
        user = mysql_cursor.fetchone()

        if not user:
            return {"error": "User not found"}

        employee_id = user["employee_id"]

        # ====== 1. Cập nhật thông tin tài khoản trong MySQL ======
        update_user_fields = []
        update_user_values = []

        # Kiểm tra mật khẩu
        if data.get("password"):
            password_hash = generate_password_hash(data["password"])
            update_user_fields.append("password_hash = %s")
            update_user_values.append(password_hash)

        # Cập nhật các trường khác
        if data.get("username"):
            update_user_fields.append("username = %s")
            update_user_values.append(data["username"])

        if data.get("email"):
            update_user_fields.append("email = %s")
            update_user_values.append(data["email"])

        if data.get("role"):
            update_user_fields.append("role = %s")
            update_user_values.append(data["role"])

        # Nếu có trường để cập nhật
        if update_user_fields:
            update_user_sql = f"""
                UPDATE users
                SET {', '.join(update_user_fields)}
                WHERE id = %s
            """
            update_user_values.append(user_id)
            mysql_cursor.execute(update_user_sql, update_user_values)
            mysql_conn.commit()

        # ====== 2. Cập nhật thông tin nhân viên trong MySQL ======
        update_mysql_employee = """
            UPDATE employees
            SET FullName = %s, DepartmentID = %s, PositionID = %s, Status = %s
            WHERE EmployeeID = %s
        """
        mysql_cursor.execute(update_mysql_employee, (
            data.get("full_name"),
            data.get("department_id"),
            data.get("position_id"),
            data.get("status", "active"),
            employee_id
        ))
        mysql_conn.commit()

        # ====== 3. Cập nhật thông tin nhân viên trong SQL Server ======
        sql_conn = get_sqlserver_connection()
        sql_cursor = sql_conn.cursor()

        update_sqlserver_employee = """
            UPDATE Employees
            SET FullName = ?, DateOfBirth = ?, Gender = ?, PhoneNumber = ?, Email = ?, 
                HireDate = ?, DepartmentID = ?, PositionID = ?, Status = ?
            WHERE EmployeeID = ?
        """
        sqlserver_values = (
            data.get("full_name"),
            data.get("date_of_birth"),
            data.get("gender"),
            data.get("phone_number"),
            data.get("email"),
            data.get("hire_date"),
            data.get("department_id"),
            data.get("position_id"),
            data.get("status", "active"),
            employee_id
        )
        sql_cursor.execute(update_sqlserver_employee, sqlserver_values)
        sql_conn.commit()

        return {"message": "User and employee information updated successfully"}

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

def delete_user_and_employee(user_id):
    """
    Xóa user và thông tin nhân viên liên quan.
    """
    sql_conn = None
    sql_cursor = None
    mysql_conn = None
    mysql_cursor = None

    try:
        # ====== 1. Kiểm tra sự tồn tại của user và lấy employee_id ======
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor(dictionary=True)

        mysql_cursor.execute("SELECT employee_id FROM users WHERE id = %s", (user_id,))
        user = mysql_cursor.fetchone()

        if not user:
            return {"error": "User not found"}

        employee_id = user["employee_id"]

        # ====== 2. Xóa thông tin nhân viên trong SQL Server ======
        sql_conn = get_sqlserver_connection()
        sql_cursor = sql_conn.cursor()

        delete_sqlserver_employee = """
            DELETE FROM Employees WHERE EmployeeID = ?
        """
        sql_cursor.execute(delete_sqlserver_employee, (employee_id,))
        sql_conn.commit()

        # ====== 3. Xóa thông tin nhân viên trong MySQL ======
        delete_mysql_employee = """
            DELETE FROM employees WHERE EmployeeID = %s
        """
        mysql_cursor.execute(delete_mysql_employee, (employee_id,))
        mysql_conn.commit()

        # ====== 4. Xóa thông tin user trong MySQL ======
        delete_user_sql = """
            DELETE FROM users WHERE id = %s
        """
        mysql_cursor.execute(delete_user_sql, (user_id,))
        mysql_conn.commit()

        return {"message": "User and employee deleted successfully"}

    except Exception as e:
        if mysql_conn:
            mysql_conn.rollback()
        if sql_conn:
            sql_conn.rollback()
        return {"error": str(e)}

    finally:
        if sql_cursor:
            sql_cursor.close()
        if sql_conn:
            sql_conn.close()
        if mysql_cursor:
            mysql_cursor.close()
        if mysql_conn:
            mysql_conn.close()

def update_user_role(user_id, new_role):
    """
    Cập nhật vai trò của user trong bảng users.
    """
    mysql_conn = None
    mysql_cursor = None

    try:
        # ====== 1. Kiểm tra sự tồn tại của user ======
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor(dictionary=True)

        mysql_cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
        user = mysql_cursor.fetchone()

        if not user:
            return {"error": "User not found"}

        # ====== 2. Cập nhật vai trò ======
        update_role_sql = """
            UPDATE users
            SET role = %s
            WHERE id = %s
        """
        mysql_cursor.execute(update_role_sql, (new_role, user_id))
        mysql_conn.commit()

        return {"message": f"User {user_id} role updated to {new_role}"}

    except Exception as e:
        if mysql_conn:
            mysql_conn.rollback()
        return {"error": str(e)}

    finally:
        if mysql_cursor:
            mysql_cursor.close()
        if mysql_conn:
            mysql_conn.close()

def change_password(user_id, current_password, new_password):
    """
    Thay đổi mật khẩu người dùng.
    """
    mysql_conn = None
    mysql_cursor = None

    try:
        # Kết nối đến MySQL
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor(dictionary=True)

        # Lấy thông tin người dùng
        mysql_cursor.execute("SELECT password_hash FROM users WHERE id = %s", (user_id,))
        user = mysql_cursor.fetchone()

        if not user:
            return {"error": "User not found"}

        # Kiểm tra mật khẩu cũ
        if not check_password_hash(user["password_hash"], current_password):
            return {"error": "Current password is incorrect"}

        # Tạo hash cho mật khẩu mới
        new_password_hash = generate_password_hash(new_password)

        # Cập nhật mật khẩu mới
        update_password_sql = """
            UPDATE users SET password_hash = %s WHERE id = %s
        """
        mysql_cursor.execute(update_password_sql, (new_password_hash, user_id))
        mysql_conn.commit()

        return {"message": "Password updated successfully"}

    except Exception as e:
        if mysql_conn:
            mysql_conn.rollback()
        return {"error": str(e)}

    finally:
        if mysql_cursor:
            mysql_cursor.close()
        if mysql_conn:
            mysql_conn.close()

def update_profile(user_id, data):
    """
    Cập nhật thông tin profile người dùng.
    """
    mysql_conn = None
    mysql_cursor = None
    sql_conn = None
    sql_cursor = None

    try:
        # 1. Kết nối MySQL và lấy thông tin employee_id
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor(dictionary=True)

        mysql_cursor.execute("SELECT employee_id FROM users WHERE id = %s", (user_id,))
        user = mysql_cursor.fetchone()

        if not user:
            return {"error": "User not found"}

        employee_id = user["employee_id"]

        # 2. Cập nhật thông tin trong bảng `users` (MySQL)
        update_user_sql = """
            UPDATE users
            SET full_name = %s, email = %s
            WHERE id = %s
        """
        mysql_cursor.execute(update_user_sql, (
            data.get("full_name"),
            data.get("email"),
            user_id
        ))
        mysql_conn.commit()

        # 3. Cập nhật thông tin trong bảng `employees` (MySQL)
        update_mysql_employee = """
            UPDATE employees
            SET FullName = %s, Status = %s
            WHERE EmployeeID = %s
        """
        mysql_cursor.execute(update_mysql_employee, (
            data.get("full_name"),
            data.get("status", "active"),
            employee_id
        ))
        mysql_conn.commit()

        # 4. Cập nhật thông tin trong bảng `Employees` (SQL Server)
        sql_conn = get_sqlserver_connection()
        sql_cursor = sql_conn.cursor()

        update_sqlserver_employee = """
            UPDATE Employees
            SET FullName = ?, PhoneNumber = ?, Email = ?
            WHERE EmployeeID = ?
        """
        sqlserver_values = (
            data.get("full_name"),
            data.get("phone_number"),
            data.get("email"),
            employee_id
        )

        sql_cursor.execute(update_sqlserver_employee, sqlserver_values)
        sql_conn.commit()

        return {"message": "Profile updated successfully"}

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