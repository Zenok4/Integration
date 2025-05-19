from database import get_mysql_connection, get_sqlserver_connection

def delete_employee(employee_id):
    
    if not employee_id:
        return {"message": "No employee ID provided", "success": False}

    try:
        # 1. Kiểm tra ràng buộc salaries trong MySQL
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor(dictionary=True)
        
        # Kiểm tra xem nhân viên có dữ liệu payroll không
        mysql_cursor.execute("SELECT COUNT(*) as count FROM salaries WHERE EmployeeID = %s", (employee_id,))
        salaries_count = mysql_cursor.fetchone()['count']
        
        if salaries_count > 0:
            mysql_conn.close()
            return {
                "message": "Cannot delete employee with existing salaries records",
                "success": False,
                "constraints": {
                    "salaries_records": salaries_count,
                }
            }

        # 2. Kiểm tra ràng buộc dividends trong SQL Server
        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()
        
        
        sqlserver_cursor.execute("SELECT COUNT(*) FROM Dividends WHERE EmployeeID = ?", (employee_id,))
        dividends_count = sqlserver_cursor.fetchone()[0]
        
        if dividends_count > 0:
            mysql_conn.close()
            sqlserver_conn.close()
            return {
                "message": "Cannot delete employee with existingdividends records",
                "success": False,
                "constraints": {
                    "dividends_records": dividends_count
                }
            }

        # 3. Nếu không có ràng buộc, tiến hành xóa
        # Xóa từ SQL Server trước
        sqlserver_cursor.execute("DELETE FROM Employees WHERE EmployeeID = ?", (employee_id,))
        sqlserver_conn.commit()
        
        # Sau đó xóa từ MySQL
        mysql_cursor.execute("DELETE FROM employees WHERE EmployeeID = %s", (employee_id,))
        mysql_conn.commit()
        
        return {
            "message": "Employee deleted successfully",
            "success": True,
            "employee_id": employee_id
        }

    except Exception as e:
        # Rollback nếu có lỗi
        if 'mysql_conn' in locals(): mysql_conn.rollback()
        if 'sqlserver_conn' in locals(): sqlserver_conn.rollback()
        return {
            "message": f"Error deleting employee: {str(e)}",
            "success": False
        }
    
    finally:
        # Đảm bảo đóng kết nối
        if 'mysql_conn' in locals(): mysql_conn.close()
        if 'sqlserver_conn' in locals(): sqlserver_conn.close()