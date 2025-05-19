from database import get_mysql_connection

def add_dividends(data):
    conn = get_mysql_connection()
    cursor = conn.cursor()
    sql = "INSERT INTO dividends (employee_id, amount, date, note) VALUES (%s, %s, %s, %s)"
    values = (
        data.get("employee_id"),
        data.get("amount"),
        data.get("date"),
        data.get("note")
    )
    cursor.execute(sql, values)
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"success": True, "id": new_id} 