from sqlalchemy import Column, Integer, String, Date, DECIMAL, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# 🔹 Model cho MySQL: payroll.salaries
class SalaryMySQL(Base):
    __tablename__ = "salaries"
    __bind_key__ = "mysql_db"

    SalaryID = Column(Integer, primary_key=True, autoincrement=True)
    EmployeeID = Column(Integer, ForeignKey("employees.EmployeeID"))
    SalaryMonth = Column(Date, nullable=False)
    BaseSalary = Column(DECIMAL(12, 2), nullable=False)
    Bonus = Column(DECIMAL(12, 2), nullable=True)
    Deductions = Column(DECIMAL(12, 2), nullable=True)
    NetSalary = Column(DECIMAL(12, 2), nullable=False)
    CreatedAt = Column(Date, nullable=False)
