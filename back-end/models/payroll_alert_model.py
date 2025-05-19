from sqlalchemy import Column, Integer, Enum, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class PayrollAlert(Base):
    __tablename__ = 'payroll_alerts'
    __bind_key__ = 'mysql_db'  # nếu bạn dùng bind_key

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.EmployeeID"), nullable=False)
    alert_type = Column(Enum("leave_exceed", "salary_discrepancy"), nullable=False)
    details = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)