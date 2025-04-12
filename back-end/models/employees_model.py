from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# 🔹 Model cho MySQL: payroll.employees
class EmployeeMySQL(Base):
    __tablename__ = "employees"
    __bind_key__ = "mysql_db"

    employee_id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.department_id"))
    position_id = Column(Integer, ForeignKey("positions.position_id"))
    status = Column(String(20), nullable=False)


# 🔹 Model cho SQL Server: HUMAN_2025.dbo.Employees
class EmployeeSQLServer(Base):
    __tablename__ = "Employees"
    __bind_key__ = "sqlserver_db"

    employee_id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(10), nullable=False)
    phone_number = Column(String(20))
    email = Column(String(100))
    hire_date = Column(Date, nullable=False)
    department_id = Column(Integer, ForeignKey("Departments.department_id"))
    position_id = Column(Integer, ForeignKey("Positions.position_id"))
    status = Column(String(20), nullable=False)
    created_at = Column(Date)
    updated_at = Column(Date)
