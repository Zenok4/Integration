from models.payroll_report import PayrollReport # type: ignore
from database import db
from datetime import datetime

def add_payroll_report(data):
    new_report = PayrollReport(
        report_type=data.get('report_type'),
        group_value=data.get('group_value'),
        salary=data.get('salary'),
        updated_at=datetime.utcnow()
    )
    db.session.add(new_report)
    db.session.commit()
    return new_report