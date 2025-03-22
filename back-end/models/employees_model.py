from sqlalchemy import Column, Integer, String, Date, DECIMAL, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# 🔹 Model cho MySQL
class EmployeeMySQL(Base):
    __tablename__ = "employees"
    __bind_key__ = "mysql_db"  # Dùng để kết nối MySQL

    employee_id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20))
    hire_date = Column(Date, nullable=False)
    department_id = Column(Integer)
    job_id = Column(Integer)
    salary = Column(DECIMAL(10, 2))
    status = Column(String(20))  # Bổ sung cột status

# 🔹 Model cho SQL Server
class EmployeeSQLServer(Base):
    __tablename__ = "employees"
    __bind_key__ = "sqlserver_db"  # Dùng để kết nối SQL Server

    employee_id = Column(Integer, primary_key=True, autoincrement=True)
    applicant_id = Column(Integer)
    department_id = Column(Integer, ForeignKey("departments.department_id"))
    hire_date = Column(Date, nullable=False)
    salary = Column(DECIMAL(18, 2))
    status = Column(String(20))
