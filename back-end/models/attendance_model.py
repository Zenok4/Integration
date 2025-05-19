from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Model cho MySQL: payroll.attendance
class AttendanceMySQL(Base):
    __tablename__ = "attendance"
    __bind_key__ = "mysql_db"

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id"))
    date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False)

# Model cho SQL Server: HUMAN_2025.dbo.Attendance
class AttendanceSQLServer(Base):
    __tablename__ = "Attendance"
    __bind_key__ = "sqlserver_db"

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("Employees.employee_id"))
    date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False) 