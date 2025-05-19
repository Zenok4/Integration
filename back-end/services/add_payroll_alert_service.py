from database import get_mysql_connection

def add_payroll_alert(data):
    employee_id = data.get("employee_id")
    alert_type = data.get("alert_type")
    details = data.get("details")

    if not employee_id or not alert_type:
        return {"success": False, "message": "Missing required fields (employee_id, alert_type)"}

    if alert_type not in ["leave_exceed", "salary_discrepancy"]:
        return {"success": False, "message": "Invalid alert_type"}

    conn = get_mysql_connection()
    cursor = conn.cursor()

    try:
        sql = """
            INSERT INTO payroll_alerts (employee_id, alert_type, details)
            VALUES (%s, %s, %s)
        """
        cursor.execute(sql, (employee_id, alert_type, details))
        conn.commit()

        return {"success": True, "message": "Payroll alert added successfully"}

    except Exception as e:
        conn.rollback()
        return {"fail": False, "message": str(e)}

    finally:
        cursor.close()
        conn.close()