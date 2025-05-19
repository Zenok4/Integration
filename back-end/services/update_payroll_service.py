from database import get_mysql_connection
from datetime import datetime

def update_payroll(salary_id, data):
    conn = get_mysql_connection()
    cursor = conn.cursor()
    sql = """
        UPDATE salaries SET
            EmployeeID = %s,
            SalaryMonth = %s,
            BaseSalary = %s,
            Bonus = %s,
            Deductions = %s,
            NetSalary = %s,
            CreatedAt = %s
        WHERE SalaryID = %s
    """
    
    base_salary = float(data.get("base_salary", 0))
    bonus = float(data.get("bonus", 0))
    deductions = float(data.get("deductions", 0))
    net_salary = base_salary + bonus - deductions

    values = (
        data.get("employee_id"),
        data.get("salary_month"),
        base_salary,
        bonus,
        deductions,
        net_salary,
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        salary_id
    )

    cursor.execute(sql, values)
    conn.commit()
    affected = cursor.rowcount
    conn.close()

    return {"success": affected > 0, "updated": affected}