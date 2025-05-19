from models.dividends_models import Dividend # type: ignore
from database import db_session # type: ignore

def update_dividend(dividend_id, data):
    dividend = db_session.query(Dividend).filter_by(DividendID=dividend_id).first()
    if not dividend:
        return None

    if 'EmployeeID' in data:
        dividend.EmployeeID = data['EmployeeID']
    if 'DividendAmount' in data:
        dividend.DividendAmount = data['DividendAmount']
    if 'DividendDate' in data:
        dividend.DividendDate = data['DividendDate']

    db_session.commit()
    return dividend