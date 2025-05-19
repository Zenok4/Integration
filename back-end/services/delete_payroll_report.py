from models.payroll_report import PayrollReport # type: ignore
from database import db

def delete_payroll_report(report_id):
    report = PayrollReport.query.get(report_id)
    if not report:
        return None
    
    db.session.delete(report)
    db.session.commit()
    return True