from flask import Blueprint, request, jsonify
from models.transaction_model import Transaction
from extensions import db
from utils.decorator import token_required
from sqlalchemy import extract, func
from datetime import datetime

transaction_bp = Blueprint('transactions', __name__)

# Route: POST /api/transactions
@transaction_bp.route('/transactions', methods=['POST'])
@token_required
def create_transactions(user_id):
    data = request.get_json()

    required_fields = ['description', 'amount', 'type']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        amount = float(data['amount'])
        if data['type'] == 'expense':
            amount = -abs(amount)
        elif data['type'] == 'income':
            amount = abs(amount)
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
            user_id=user_id
        )

        db.session.add(new_transaction)
        db.session.commit()
        return jsonify({"message": "Transaction created successfully"}), 201

    except Exception as e:
        print("❌ Error in POST /transactions:", e)
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500

# Route: GET /api/transactions
@transaction_bp.route('/transactions', methods=['GET'])
@token_required
def get_transactions(user_id):
    try:
        limit = request.args.get('limit', type=int)  # Optional ?limit=5 param
        query = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.date.desc())

        if limit:
            query = query.limit(limit)

        transactions = query.all()

        return jsonify({
            "status": "success",
            "data": [t.to_dict() for t in transactions]
        }), 200

    except Exception as e:
        print("❌ Error in GET /transactions:", e)
        return jsonify({"status": "error", "message": "Failed to retrieve transactions"}), 500

# Route: GET /api/balance
@transaction_bp.route('/balance', methods=['GET'])
@token_required
def get_user_balance(user_id):
    try:
        transactions = Transaction.query.filter_by(user_id=user_id).all()
        balance = sum(t.amount for t in transactions)

        return jsonify({
            "user_id": user_id,
            "balance": round(balance, 2)
        }), 200

    except Exception as e:
        print("❌ Error in GET /balance:", e)
        return jsonify({"error": "Failed to retrieve balance"}), 500

# Route: DELETE /api/transactions/<id>
@transaction_bp.route('/transactions/<int:id>', methods=['DELETE'])
@token_required
def delete_transaction(user_id, id):
    try:
        transaction = Transaction.query.filter_by(id=id, user_id=user_id).first()
        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

        db.session.delete(transaction)
        db.session.commit()
        return jsonify({"message": "Transaction deleted successfully"}), 200

    except Exception as e:
        print("❌ Error in DELETE /transactions:", e)
        db.session.rollback()
        return jsonify({"error": "Failed to delete transaction"}), 500

# Route: GET /api/transactions/<id>
@transaction_bp.route('/transactions/<int:id>', methods=['GET'])
@token_required
def get_transaction_by_id(user_id, id):
    try:
        transaction = Transaction.query.filter_by(id=id, user_id=user_id).first()
        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

        return jsonify(transaction.to_dict()), 200

    except Exception as e:
        print("❌ Error in GET /transactions/<id>:", e)
        return jsonify({"error": "Failed to retrieve transaction"}), 500

@transaction_bp.route('/transactions/grouped/month', methods=['GET'])
@token_required
def get_transactions_grouped_by_month(user_id):
    try:
        current_year = datetime.now().year
        current_month = datetime.now().month

        # Decide range: first or last 6 months
        if current_month <= 6:
            months_range = range(1, 7)  # Jan to Jun
        else:
            months_range = range(7, 13) # Jul to Dec

        # Query total balance per month in the range
        results = (
            db.session.query(
                extract('month', Transaction.date).label('month'),
                func.sum(Transaction.amount).label('total')
            )
            .filter(Transaction.user_id == user_id)
            .filter(extract('year', Transaction.date) == current_year)
            .filter(extract('month', Transaction.date).in_(months_range))
            .group_by(extract('month', Transaction.date))
            .order_by(extract('month', Transaction.date))
            .all()
        )

        # Prepare month labels
        month_labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        # Build response with 0 for months without transactions
        data = []
        for m in months_range:
            balance = next((float(row.total) for row in results if row.month == m), 0)
            data.append({
                "month": month_labels[m - 1],
                "balance": round(balance, 2)
            })

        return jsonify({"status": "success", "data": data}), 200

    except Exception as e:
        print("❌ Error in GET /transactions/grouped/month:", e)
        return jsonify({"status": "error", "message": "Failed to group transactions"}), 500
