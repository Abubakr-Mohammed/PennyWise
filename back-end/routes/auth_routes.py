from flask import Blueprint, request, jsonify
from models.user_model import User
from extensions import db, bcrypt

auth_bp = Blueprint('auth', __name__)

# ============================
# POST /register
# ============================
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    required_fields = ['username', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password,
        first_name=data['first_name'],
        last_name=data['last_name']
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        print("❌ Error during registration:", e)  # <-- Add this line
        db.session.rollback()
        return jsonify({"error": "Registration failed"}), 500


# ============================
# POST /login
# ============================
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(username=data.get('username')).first()
    if not user or not bcrypt.check_password_hash(user.password, data.get('password')):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful", "user_id": user.id, "username": user.username, "first_name": user.first_name, "last_name": user.last_name}), 200
