from database import get_mysql_connection

def delete_payroll_by_id(salary_id):
    conn = get_mysql_connection()
    cursor = conn.cursor()

    try:
        # Kiểm tra xem bản ghi có tồn tại không
        check_sql = "SELECT * FROM salaries WHERE SalaryID = %s"
        cursor.execute(check_sql, (salary_id,))
        record = cursor.fetchone()

        if not record:
            return {"message": "Salary record not found", "success": False}

        # Xoá bản ghi
        delete_sql = "DELETE FROM salaries WHERE SalaryID = %s"
        cursor.execute(delete_sql, (salary_id,))
        conn.commit()

        return {"message": "Payroll deleted successfully", "success": True}

    except Exception as e:
        conn.rollback()
        return {"message": str(e), "success": False}

    finally:
        cursor.close()
        conn.close()