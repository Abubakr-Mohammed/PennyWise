## models/transaction_model.py

"""
This file will contain SQLAlchemy database models
for representing tables like Transaction, User, etc.
Start by defining a Transaction model in Week 2.
"""
from app import db

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(10), nullable=False)  # income or expense
    date = db.Column(db.String(10), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
