from datetime import datetime
from database import db

class PayrollReport(db.Model):
    __tablename__ = 'payroll_report'

    id = db.Column(db.Integer, primary_key=True)
    report_type = db.Column(db.String(50))
    group_value = db.Column(db.String(100))
    salary = db.Column(db.Numeric(18, 2))
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)