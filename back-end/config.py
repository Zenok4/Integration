DB_CONFIG = {
    "MYSQL": {
        "host": "localhost",
        "user": "root",
        "password": "dung29062004",  # Không dùng mật khẩu
        "database": "PAYROLL"
    },
    "SQLSERVER": {
        "host": r"LAPTOP-7MQNI9Q0\SQLEXPRESS",
        "database": "HUMAN_2025",
        "driver": "{ODBC Driver 17 for SQL Server}"  # Đảm bảo driver này được cài đặt
    }
}

# Cấu hình JWT cho xác thực người dùng
JWT_SECRET_KEY = "H43odUyagb462Ght"
JWT_ALGORITHM = "HS256"
