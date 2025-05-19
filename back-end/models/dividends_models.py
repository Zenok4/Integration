from sqlalchemy import Column, Integer, DECIMAL, Date, DateTime, ForeignKey # type: ignore
from sqlalchemy.ext.declarative import declarative_base # type: ignore

Base = declarative_base()

class Dividend(Base):
    __tablename__= 'Dividends'
    
    
    DividendID = Column(Integer, primary_key=True, autoincrement=True)
    EmployeeID = Column(Integer, ForeignKey('Employees.EmployeeID'), nullable=True)
    DividendAmount = Column(DECIMAL(12, 2), nullable=False)
    DividendDate = Column(Date, nullable=False)
    CreatedAt = Column(DateTime)