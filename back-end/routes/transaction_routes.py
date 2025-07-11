from flask import Blueprint, request, jsonify
from models.transaction_model import Transaction
from extensions import db

transaction_bp = Blueprint('transactions', __name__)

@transaction_bp.route('/transactions', methods=['POST'])
def create_transactions() :
    data = request.get_json()
    transaction = Transaction(
        description=data['description'],
        amount=data['amount'],
        type=data['type'],
        date=data['date'],
        user_id=data['user_id'])

    try:
        db.session.add(transaction)
        db.session.commit()
        return jsonify({"message": "Transaction created", "data": transaction.to_dict()}), 201
    
    except Exception as e:
        return jsonify({"message": "Error creating transaction", "error": str(e)}), 400
    
@transaction_bp.route('/transactions', methods=['GET'])
def get_transactions():
    try:
        transactions = Transaction.query.all()
        requests = [t.to_dict() for t in transactions]
        return jsonify({"message": "Retrieved Transactions", "data": requests}), 200

    except Exception as e:
        return jsonify({"message": "Error getting transactions", "error": str(e)}), 500

@transaction_bp.route('/transactions/<int:id>', methods=['DELETE'])
def delete_transactions(id):
    try:
        transaction = Transaction.query.get(id)

        if not transaction:
            return jsonify({"message": "Transaction not found"}), 404
        
        db.session.delete(transaction)
        db.session.commit()

        return jsonify({"message": "Transaction deleted"}), 200

    except Exception as e:
        db.session.rollback()  # very important to keep session clean
        return jsonify({"message": "Error deleting transactions", "error": str(e)}), 500