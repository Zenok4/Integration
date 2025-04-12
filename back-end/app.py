from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from database import get_mysql_connection, get_sqlserver_connection
from endpoints.employees_endpoints import employees_bp
from config import JWT_SECRET_KEY

app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
jwt = JWTManager(app)

app.register_blueprint(employees_bp, url_prefix="/api/employees")

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
