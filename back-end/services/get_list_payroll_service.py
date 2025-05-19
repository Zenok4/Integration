from database import get_mysql_connection, get_sqlserver_connection

def get_all_payroll():
    mysql_conn = get_mysql_connection()
    mysql_cursor = mysql_conn.cursor(dictionary=True)
    mysql_cursor.execute("SELECT * FROM salaries")
    payroll_list = mysql_cursor.fetchall()
    mysql_conn.close()
    return {"message": "Payroll found", "payroll": payroll_list}