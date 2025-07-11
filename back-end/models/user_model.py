from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique user ID (auto-increment)
    username = db.Column(db.String(80), unique=True, nullable=False)  # User's unique username
    email = db.Column(db.String(120), unique=True, nullable=False)  # User's unique email address
    password = db.Column(db.String(128), nullable=False)  # Hashed user password (secure, irreversible version of the original password)
    first_name = db.Column(db.String(80), nullable=False)  # User's first name
    last_name = db.Column(db.String(80), nullable=False)  # User's last name

