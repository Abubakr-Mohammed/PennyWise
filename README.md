# PennyWise

## Overview
PennyWise is a **financial tracking system** that helps users manage their income and expenses in real time.  
Users can:
- Add, delete, and view transactions
- Log in to access their personalized account
- View dashboards with balances, income, and expenses
- Receive financial insights and advice (bonus features)
- Interact with a fully responsive frontend connected to a Flask backend

---

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript (ES6)
- **Backend:** Python, Flask, Flask-SQLAlchemy
- **Database:** SQLite
- **Tools:** VS Code, Live Server (optional), Postman (for testing APIs)

---

## Project Structure
back-end/
├── controllers/          # Business logic layer
│   └── transaction_controller.py
├── models/              # Database models
│   └── transaction_model.py
├── routes/              # API route definitions
│   └── test_route.py
├── requirements.txt     # Python dependencies


front-end/
├── index.html       # Main application page
├── login.html       # User authentication page
├── styles.css       # Application styling
├── scripts/          # Frontend logic
│ └── app.js
├── assets/ # Static assets (images, icons, etc.)

LICENSE # License information

---

## Installation

### Prerequisites
- Python 3.8+ (backend)
- pip (backend)
- Web browser (frontend)
- *(Optional)* VS Code with Live Server

### Setup Steps
#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   Create and activate a virtual environment:

# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate


Install dependencies:

pip install -r requirements.txt


Initialize the database:

python init_db.py


Run the Flask server:

python app.py

Frontend

Navigate to the frontend directory:

cd frontend


Open index.html in your browser (or use Live Server for auto-reload).

Ensure the backend server is running for full functionality.

(Optional) Update API URLs in scripts/app.js if the backend URL changes.

Usage

Access the app via your browser:

Dashboard: frontend/index.html

Login: frontend/login.html

Add, view, or delete transactions.

Interact with real-time backend data through JavaScript fetch calls.

Frontend & Backend Documentation

Frontend README
 – detailed frontend setup, structure, and instructions

Backend README
 – detailed backend setup, structure, and instructions

Development

Add new features in frontend/scripts/app.js or backend routes/controllers

Keep styling modular and code organized for readability

Test locally with backend running for full functionality

Author

PennyWise Development Team

License

This project is licensed under the MIT License - see the LICENSE file for details.
