from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database import get_mysql_connection, get_sqlserver_connection
from config import JWT_SECRET_KEY

app = Flask(__name__)
CORS(app)  # Cho phép frontend gọi API từ domain khác
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY  # Cấu hình JWT
jwt = JWTManager(app)

# Đăng ký các route

# ======== TEST DATABASE CONNECTION =========
@app.route('/test-connection', methods=['GET'])
def test_connection():
    try:
        # Kiểm tra kết nối MySQL
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor()
        mysql_cursor.execute("SELECT COUNT(*) FROM employees")  # Giả sử có bảng employees
        mysql_count = mysql_cursor.fetchone()[0]
        mysql_conn.close()

        # Kiểm tra kết nối SQL Server
        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()
        sqlserver_cursor.execute("SELECT COUNT(*) FROM employees")  # Giả sử có bảng employees
        sqlserver_count = sqlserver_cursor.fetchone()[0]
        sqlserver_conn.close()

        return jsonify({
            "message": "Database connections successful!",
            "mysql_total_employees": mysql_count,
            "sqlserver_total_employees": sqlserver_count
        })
        # print("Connection successful")
    except Exception as e:
        return jsonify({"message": "Database connection failed!", "error": str(e)}), 500
        # print("Connection failed:", str(e))

# ======== CHẠY ỨNG DỤNG =========
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
