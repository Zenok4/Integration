from database import get_mysql_connection, get_sqlserver_connection

def get_payroll(payroll_ids=None):
    """Chỉ lấy lương có trong cả MySQL và SQL Server"""
    if not payroll_ids:
        return {"message": "No payroll IDs provided", "payroll": []}

    # 🔹 Lấy danh sách lương từ MySQL
    mysql_conn = get_mysql_connection()
    mysql_cursor = mysql_conn.cursor(dictionary=True)

    format_strings = ','.join(['%s'] * len(payroll_ids))
    mysql_cursor.execute(
        f"SELECT * FROM salaries WHERE SalaryID IN ({format_strings})",
        tuple(payroll_ids)
    )
    mysql_payroll = {pr["SalaryID"]: pr for pr in mysql_cursor.fetchall()}
    mysql_conn.close()

def get_payroll_by_employee(employee_id):
    """
    Lấy thông tin bảng lương của một nhân viên theo EmployeeID.
    """
    conn = None
    cursor = None

    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT EmployeeID, SalaryMonth, BaseSalary, Bonus, Deductions, NetSalary 
            FROM salaries 
            WHERE EmployeeID = %s
        """
        cursor.execute(query, (employee_id,))
        payroll_records = cursor.fetchall()

        if not payroll_records:
            return {"message": "No payroll records found for the employee.", "data": []}

        return {"message": "Payroll records retrieved successfully.", "data": payroll_records}

    except Exception as e:
        return {"error": str(e)}

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def get_salaries_by_employee_and_month(employee_id, salary_month):
    """
    Lấy dữ liệu lương theo EmployeeID và SalaryMonth
    """
    mysql_conn = None
    mysql_cursor = None

    try:
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor(dictionary=True)

        query = """
            SELECT 
                pr.EmployeeID,
                e.FullName,
                e.DepartmentID,
                e.PositionID,
                pr.SalaryMonth,
                pr.BaseSalary,
                pr.Bonus,
                pr.Deductions,
                pr.NetSalary
            FROM salaries pr
            INNER JOIN employees e ON pr.EmployeeID = e.EmployeeID
            WHERE pr.EmployeeID = %s AND DATE_FORMAT(pr.SalaryMonth, '%Y-%m') = %s
        """

        # Chuyển định dạng tháng thành YYYY-MM
        formatted_month = salary_month[:7]

        mysql_cursor.execute(query, (employee_id, formatted_month))
        salaries = mysql_cursor.fetchall()

        return {"message": "Salaries retrieved successfully", "data": salaries}

    except Exception as e:
        return {"error": str(e)}

    finally:
        if mysql_cursor:
            mysql_cursor.close()
        if mysql_conn:
            mysql_conn.close()

def get_average_salary_by_department():
    """
    Tính lương trung bình mỗi phòng ban dựa trên bảng salaries.
    """
    mysql_conn = None
    mysql_cursor = None

    try:
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor(dictionary=True)

        query = """
            SELECT 
                e.DepartmentID,
                d.DepartmentName,
                COUNT(s.EmployeeID) AS EmployeeCount,
                AVG(s.NetSalary) AS AvgSalary
            FROM salaries s
            INNER JOIN employees e ON s.EmployeeID = e.EmployeeID
            INNER JOIN departments d ON e.DepartmentID = d.DepartmentID
            GROUP BY e.DepartmentID, d.DepartmentName
        """

        mysql_cursor.execute(query)
        result = mysql_cursor.fetchall()

        return {
            "message": "Average salary per department calculated successfully",
            "data": result
        }

    except Exception as e:
        return {"error": str(e)}

    finally:
        if mysql_cursor:
            mysql_cursor.close()
        if mysql_conn:
            mysql_conn.close()