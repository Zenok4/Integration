from database import get_mysql_connection

def delete_attendance(attendance_id):
    conn = get_mysql_connection()
    cursor = conn.cursor()
    sql = "DELETE FROM attendance WHERE id = %s"
    cursor.execute(sql, (attendance_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return {"success": affected > 0, "deleted": affected} 