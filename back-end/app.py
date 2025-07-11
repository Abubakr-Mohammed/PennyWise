from flask import Flask
from extensions import db

app = Flask(__name__)

#Setting up SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pennywise.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Import and register blueprints as usual Task B and D's job
# app.register_blueprint(...)
from routes.transaction_routes import transaction_bp
app.register_blueprint(transaction_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
