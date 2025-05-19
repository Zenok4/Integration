from database import get_mysql_connection
from datetime import datetime

def add_payroll(data):
    employee_id = data.get("employee_id")
    salary_month = data.get("salary_month")
    base_salary = data.get("base_salary")
    bonus = data.get("bonus", 0)
    deductions = data.get("deductions", 0)

    # Kiểm tra dữ liệu đầu vào
    if not all([employee_id, salary_month, base_salary]):
        return {"success": False, "message": "Missing required fields"}

    try:
        net_salary = float(base_salary) + float(bonus) - float(deductions)
    except ValueError:
        return {"success": False, "message": "Invalid number format"}

    conn = get_mysql_connection()
    cursor = conn.cursor()

    try:
        sql = """
            INSERT INTO salaries (
                EmployeeID, SalaryMonth, BaseSalary, Bonus,
                Deductions, NetSalary, CreatedAt
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            employee_id,
            salary_month,
            base_salary,
            bonus,
            deductions,
            net_salary,
            datetime.now()
        )

        cursor.execute(sql, values)
        conn.commit()

        return {"success": True, "message": "Payroll added successfully"}

    except Exception as e:
        conn.rollback()
        return {"success": False, "message": str(e)}

    finally:
        cursor.close()
        conn.close()