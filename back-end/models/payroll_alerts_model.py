from database import db 

class PayrollAlert(db.Model):
    __tablename__ = 'payroll_alerts'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    employee_id = db.Column(db.Integer, nullable=True)
    alert_type = db.Column(db.Enum('leave_exceed', 'salary_discrepany'), nullable = False)
    details = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default = db.fb.func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'alert_type': self.alert_type,
            'details': self.details,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }