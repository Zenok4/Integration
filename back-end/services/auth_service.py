from database import get_mysql_connection
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

# ======= ĐĂNG NHẬP ========
def login_user(username, password):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return {"error": "Invalid username or password"}

    # Gắn thêm employee_id nếu có
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

def register_user(data):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    username = data.get("username")
    password = data.get("password")
    full_name = data.get("full_name")
    email = data.get("email")
    role = data.get("role", "employee")
    employee_id = data.get("employee_id")  # Có thể None

    # Kiểm tra trùng username
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    if cursor.fetchone():
        conn.close()
        return {"error": "Username already exists"}

    # Băm mật khẩu
    password_hash = generate_password_hash(password)

    # Thêm user mới
    cursor.execute("""
        INSERT INTO users (username, password_hash, full_name, email, role, employee_id)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (username, password_hash, full_name, email, role, employee_id))
    conn.commit()
    conn.close()

    return {"message": "User registered successfully"}
