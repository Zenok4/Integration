from models.payroll_alerts_model import PayrollAlert
from database import db 
def update_payroll_alert(alert_id, data):
    alert = PayrollAlert.query.get(alert_id)
    if not alert:
        return None  #not found
    
    if 'alert_type' in data:
        alert.alert_type = data
    if 'details' in data:
        alert.details = data['details']
        
    db.session.commit()
    return alert.to_dict()