from database import get_mysql_connection

def get_payroll_report():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT SalaryID, EmployeeID, SalaryMonth, NetSalary, CreatedAt FROM salaries")
    report = cursor.fetchall()
    conn.close()
    return report