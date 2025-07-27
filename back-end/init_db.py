from app import app, db
from models.user_model import User
from models.transaction_model import Transaction

print("Starting DB initialization")

with app.app_context():
    db.create_all()
    print("Database created successfully!")
