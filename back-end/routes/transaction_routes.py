from flask import Blueprint, request, jsonify
from models.transaction_model import Transaction
from utils.decorator import token_required
from extensions import db

transaction_bp = Blueprint('transactions', __name__)

# Route: POST /api/transactions
# Description: Adds a new transaction to the database
@transaction_bp.route('/transactions', methods=['POST'])
@token_required # gives access to authenticated user_id
def create_transactions(user_id):
    data = request.get_json()

    required_fields = ['description', 'amount', 'type', 'date']
    for field in required_fields:
        if field not in data:
            return jsonify({"status": "error", "message": f"Missing field: {field}"}), 400

    try:
        amount = float(data['amount'])

        # 🔥 Automatically handle negative value for expenses
        if data['type'] == 'expense':
            amount = -abs(amount)  # ensures it's always negative
        elif data['type'] == 'income':
            amount = abs(amount)   # ensures it's always positive
        else:
            return jsonify({"status": "error", "message": "Type must be 'income' or 'expense'"}), 400

    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Amount must be a valid number"}), 400

    try:
        new_transaction = Transaction(
            description=data['description'],
            amount=amount,
            type=data['type'],
            date=data['date'],
            user_id=user_id
        )

        db.session.add(new_transaction)
        db.session.commit()

        return jsonify({"status": "success", "message": "Transaction created successfully"}), 201

    except Exception:
        db.session.rollback()
        return jsonify({"status": "error", "message": "Server error occurred"}), 500

# Route: POST /api/transactions
# Description: Gets and displays transaction from database
@transaction_bp.route('/transactions', methods=['GET'])
@token_required
def get_transactions(user_id):
    try:
        transactions = Transaction.query

        id = request.args.get('id')
        description = request.args.get('description')
        amount = request.args.get('amount')
        type = request.args.get('type')
        date = request.args.get('date')

        if id:
            transactions = transactions.filter_by(id=id)

        if description:
            transactions = transactions.filter_by(description=description)

        if amount:
            transactions = transactions.filter_by(amount=amount)

        if type:
            transactions = transactions.filter_by(type=type)

        if date:
            transactions = transactions.filter_by(date=date)

        transactions = transactions.filter_by(user_id=user_id)

        result = [t.to_dict() for t in transactions]
        return jsonify({"status": "success", "message": "Retrieved Transactions", "data": result}), 200
    except Exception:
        return jsonify({"status": "error", "message": "Failed to retrieve transactions"}), 500

@transaction_bp.route('/balance', methods=['GET'])
@token_required
def get_user_balance(user_id):
    try:
        # Get all transactions for this user
        transactions = Transaction.query.filter_by(user_id=user_id).all()
        
        # Calculate total balance
        balance = sum(t.amount for t in transactions)

        return jsonify({
            "status": "success",
            "message": "Balance retrieved",
            "user_id": user_id,
            "balance": round(balance, 2)
        }), 200

    except Exception:
        return jsonify({"status": "error", "message": "Failed to retrieve balance"}), 500

# Route: DELETE /api/transactions
# Description: Deletes transaction from database
@transaction_bp.route('/transactions/<int:id>', methods=['DELETE'])
@token_required
def delete_transaction(id, user_id):
    transaction = Transaction.query.get(id)

    if not transaction:
        return jsonify({"status": "error", "message": "Transaction not found"}), 404
    
    if transaction.user_id != user_id:
        return jsonify({"status": "error", "message": "Forbidden: You cannot delete this transaction"}), 403
    
    try:
        db.session.delete(transaction)
        db.session.commit()
        return jsonify({"status": "success", "message": "Transaction deleted successfully"}), 200

    except Exception:
        db.session.rollback()
        return jsonify({"status": "error", "message": "Failed to delete transaction"}), 500

@transaction_bp.route('/transactions/<int:id>', methods=['GET'])
@token_required
def get_transaction_by_id(id, user_id):
    try:
        transaction = Transaction.query.get(id)
        
        if not transaction:
            return jsonify({"status": "error", "message": "Transaction not found"}), 404
        
        if transaction.user_id != user_id:
            return jsonify({"status": "error", "message": "Forbidden: You cannot delete this transaction"}), 403

        return jsonify({"status": "success", "message": "Transaction Retrieved", "data": transaction.to_dict()}), 200

    except Exception:
        return jsonify({"status": "error", "message": "Failed to retrieve transaction"}), 500
