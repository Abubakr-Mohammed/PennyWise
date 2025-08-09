from flask import Blueprint, jsonify
from models.user_model import User
from utils.decorator import token_required

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/user', methods=['GET'])
@token_required
def get_user_profile(user_id):

    user = User.query.get(user_id)
    if not user:
        return jsonify({
            "status": "error",
            "message": "User not found"
        }), 404

    return jsonify({
        "status": "success",
        "data": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }), 200
