from database import get_sqlserver_connection

# 🔹 Lấy Positions từ SQL Server
def  get_all_positions():
    # Lấy danh sách phòng ban từ SQL Server
    sqlserver_conn = get_sqlserver_connection()
    sqlserver_cursor = sqlserver_conn.cursor()
    sqlserver_cursor.execute("SELECT * FROM Positions")
    columns = [column[0] for column in sqlserver_cursor.description]
    sqlserver_positions = {row[0]: dict(zip(columns, row)) for row in sqlserver_cursor.fetchall()}
    sqlserver_conn.close()

    return {
        "message": f"Found {len(sqlserver_positions)} positions",
        "positions": sqlserver_positions
    }
    