from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_session import Session
from database import get_mysql_connection, get_sqlserver_connection
from endpoints.employees_endpoints import employees_bp
from endpoints.auth_endpoints import auth_bp
from endpoints.payroll_endpoints import payroll_bp
from endpoints.notification_endpoints import notification_bp
from endpoints.department_endpoints import departments_bp
from endpoints.positions_endpoint import positions_bp
from endpoints.attendance_endpoints import attendance_bp
from endpoints.payroll_alerts_endpoint import alerts_bp
from endpoints.human_notifications_endpoints import notifications_bp
from config import JWT_SECRET_KEY

app = Flask(__name__)

# Cấu hình session
app.secret_key = "63f4945d921d599f27ae4fdf5bada3f1"

app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False  # Đặt True nếu dùng HTTPS
Session(app)

app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
jwt = JWTManager(app)
CORS(app, supports_credentials=True)

app.register_blueprint(employees_bp, url_prefix="/employees")
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(payroll_bp, url_prefix="/salaries")
app.register_blueprint(notification_bp, url_prefix="/notification")
app.register_blueprint(departments_bp, url_prefix="/departments")
app.register_blueprint(positions_bp, url_prefix="/positions")
app.register_blueprint(attendance_bp, url_prefix="/attendance")
app.register_blueprint(alerts_bp, url_prefix="/payroll-alerts")
app.register_blueprint(notifications_bp, url_prefix="/human-notifications")

# ========== TEST CONNECTION FUNCTION ==========
def test_connection():
    try:
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor()
        mysql_cursor.execute("SELECT COUNT(*) FROM employees")
        mysql_cursor.fetchone()
        mysql_conn.close()

        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()
        sqlserver_cursor.execute("SELECT COUNT(*) FROM Employees")
        sqlserver_cursor.fetchone()
        sqlserver_conn.close()

        return {"status": "success", "message": "Database connections successful!"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}

# ========== BEFORE REQUEST ==========
@app.before_request
def check_db_before_request():
    # Bỏ qua một số route nhất định hoặc method OPTIONS
    bypass_paths = ["/test-connection"]
    if request.method == "OPTIONS" or any(request.path.startswith(p) for p in bypass_paths):
        return

    result = test_connection()
    if result["status"] == "failed":
        return jsonify({"message": "Database connection failed!", "error": result["error"]}), 500

# ========== TEST API ==========
@app.route("/test-connection", methods=["GET"])
def test_connection_api():
    return jsonify(test_connection())

# ========== RUN ==========
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
