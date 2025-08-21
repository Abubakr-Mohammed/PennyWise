import os
from flask import Flask
from flask_cors import CORS
from extensions import db, bcrypt
from dotenv import load_dotenv
from routes.transaction_routes import transaction_bp
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp


app = Flask(__name__)
CORS(app)

load_dotenv()

app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app) 
bcrypt.init_app(app)

# Register blueprints with prefix /'api'
app.register_blueprint(transaction_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(user_bp, url_prefix='')  # No prefix needed as route already includes /api

if __name__ == '__main__':
    app.run()
