from flask import Blueprint, request, jsonify
from models.transaction_model import Transaction
from extensions import db

transaction_bp = Blueprint('transactions', __name__)

# Route: POST /api/transactions
# Description: Adds a new transaction to the database
@transaction_bp.route('/transactions', methods=['POST'])
def create_transactions():
    data = request.get_json()

    required_fields = ['description', 'amount', 'type', 'user_id']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        amount = float(data['amount'])

        # 🔥 Automatically handle negative value for expenses
        if data['type'] == 'expense':
            amount = -abs(amount)  # ensures it's always negative
        elif data['type'] == 'income':
            amount = abs(amount)   # ensures it's always positive
        else:
            return jsonify({"error": "Type must be 'income' or 'expense'"}), 400

    except (ValueError, TypeError):
        return jsonify({"error": "Amount must be a valid number"}), 400

    try:
        new_transaction = Transaction(
            description=data['description'],
            amount=amount,
            type=data['type'],
            date=data.get('date'),
            user_id=data['user_id']
        )

        db.session.add(new_transaction)
        db.session.commit()

        return jsonify({"message": "Transaction created successfully"}), 201

    except Exception as e:
        print("❌ Error in POST /transactions:", e)
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500

# Route: POST /api/transactions
# Description: Gets and displays transaction from database
@transaction_bp.route('/transactions', methods=['GET'])
def get_transactions():
    try:
        transactions = Transaction.query.all()
        result = [t.to_dict() for t in transactions]
        return jsonify(result), 200
    except Exception as e:
        print("❌ Error in GET /transactions:", e) 
        return jsonify({"error": "Failed to retrieve transactions"}), 500

@transaction_bp.route('/balance/<int:user_id>', methods=['GET'])
def get_user_balance(user_id):
    try:
        # Get all transactions for this user
        transactions = Transaction.query.filter_by(user_id=user_id).all()
        
        # Calculate total balance
        balance = sum(t.amount for t in transactions)

        return jsonify({
            "user_id": user_id,
            "balance": round(balance, 2)
        }), 200

    except Exception as e:
        print("❌ Error in GET /balance/<user_id>:", e)
        return jsonify({"error": "Failed to retrieve balance"}), 500

# Route: DELETE /api/transactions
# Description: Deletes transaction from database
@transaction_bp.route('/transactions/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    try:
        transaction = Transaction.query.get(id)

        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

        db.session.delete(transaction)
        db.session.commit()
        return jsonify({"message": "Transaction deleted successfully"}), 200

    except Exception as e:
        print("❌ Error in DELETE /transactions:", e)
        db.session.rollback()
        return jsonify({"error": "Failed to delete transaction"}), 500

@transaction_bp.route('/transactions/<int:id>', methods=['GET'])
def get_transaction_by_id(id):
    try:
        transaction = Transaction.query.get(id)
        
        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

        return jsonify(transaction.to_dict()), 200

    except Exception as e:
        print("❌ Error in GET /transactions/<id>:", e)
        return jsonify({"error": "Failed to retrieve transaction"}), 500
