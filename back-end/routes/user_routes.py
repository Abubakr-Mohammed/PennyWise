from flask import Blueprint, jsonify
from models.user_model import User
from utils.decorator import token_required

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/user/<int:user_id>', methods=['GET'])
@token_required
def get_user_profile(user_id, **kwargs):
    # Get the authenticated user's ID from the token
    authenticated_user_id = kwargs.get('authenticated_user_id')
    
    # Only allow users to access their own profile
    if authenticated_user_id != user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized to access this profile"
        }), 403

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