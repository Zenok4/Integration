from database import get_mysql_connection

def delete_payroll_alert(alert_id):
    conn = get_mysql_connection()
    cursor = conn.cursor()
    
    try:
        sql = "DELETE FROM payroll_alerts WHERE id = %s"
        cursor.execute(sql, (alert_id,))
        conn.commit()
        affected = cursor.rowcount
        return {"success": affected > 0, "deleted": affected}
    
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()