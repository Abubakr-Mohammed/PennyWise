from flask import Flask
from flask_sqlachemy import SQLAlchemy

app = Flask(__name__)

#Setting up SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://pennywise.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Import and register blueprints as usual Task B and D's job
# app.register_blueprint(...)

if __name__ == '__main__':
    app.run(debug=True)
