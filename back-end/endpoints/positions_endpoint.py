from flask import Blueprint, jsonify
from services.get_list_positions_service import get_all_positions

positions_bp = Blueprint('positions_pb', __name__)

@positions_bp.route('/', methods=['GET'])
def get_positions():
    try:
        data = get_all_positions()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500