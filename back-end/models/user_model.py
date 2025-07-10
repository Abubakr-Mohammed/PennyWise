from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ✅ Corrected
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
