from flask import Blueprint, request, jsonify # type: ignore
from back_end.services.update_dividend_service import update_dividend # type: ignore

dividend_bp = Blueprint('dividend', __name__)

@dividend_bp.route('/update-dividends', methods=['PUT'])
def update_dividends():
    data = request.get_json()
    dividend_id = data.get('DividendID')

    if not dividend_id:
        return jsonify({'error': 'Missing DividendID'}), 400

    updated = update_dividend(dividend_id, data)
    if not updated:
        return jsonify({'error': 'Dividend not found'}), 404

    return jsonify({'message': 'Dividend updated successfully'}), 200