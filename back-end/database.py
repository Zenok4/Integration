import mysql.connector
import pyodbc
from config import DB_CONFIG

# Kết nối MySQL (PAYROLL)
def get_mysql_connection():
    return mysql.connector.connect(
        host=DB_CONFIG["MYSQL"]["host"],
        user=DB_CONFIG["MYSQL"]["user"],
        password=DB_CONFIG["MYSQL"]["password"],
        database=DB_CONFIG["MYSQL"]["database"]
    )

# Kết nối SQL Server (HUMAN_2025) bằng Windows Authentication
def get_sqlserver_connection():
    conn_str = (
        f"DRIVER={DB_CONFIG['SQLSERVER']['driver']};"
        f"SERVER={DB_CONFIG['SQLSERVER']['host']};"
        f"DATABASE={DB_CONFIG['SQLSERVER']['database']};"
        f"Trusted_Connection=yes;"  # Sử dụng Windows Authentication
    )
    return pyodbc.connect(conn_str)
