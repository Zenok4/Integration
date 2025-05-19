from database import get_mysql_connection
from datetime import datetime

def get_attendance_with_employee(employee_id=None, month=None):
    """
    Lấy dữ liệu chấm công kèm thông tin nhân viên.
    Nếu có `employee_id` thì lọc theo EmployeeID.
    Nếu có `month` thì lọc theo tháng (YYYY-MM).
    """
    try:
        mysql_conn = get_mysql_connection()
        cursor = mysql_conn.cursor(dictionary=True)

        query = """
            SELECT 
                a.AttendanceID,
                a.EmployeeID,
                a.WorkDays,
                a.AbsentDays,
                a.LeaveDays,
                a.AttendanceMonth,
                a.CreatedAt,
                e.FullName,
                e.DepartmentID,
                e.PositionID
            FROM attendance a
            LEFT JOIN employees e ON a.EmployeeID = e.EmployeeID
            WHERE 1 = 1
        """

        params = []

        if employee_id:
            query += " AND a.EmployeeID = %s"
            params.append(employee_id)

        if month:
            try:
                # Kiểm tra định dạng tháng
                datetime.strptime(month, "%Y-%m")
                query += " AND DATE_FORMAT(a.AttendanceMonth, '%Y-%m') = %s"
                params.append(month)
            except ValueError:
                return {"error": "Invalid month format. Expected YYYY-MM"}

        cursor.execute(query, tuple(params))
        records = cursor.fetchall()

        cursor.close()
        mysql_conn.close()

        return {"message": "Attendance data retrieved", "data": records}

    except Exception as e:
        return {"error": str(e)}
