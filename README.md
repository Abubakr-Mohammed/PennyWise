# PennyWise

## Overview
- **PennyWise** is a financial tracking system that helps users manage their income and expenses in real time. Inspired by the idea to innovate web solutions with the implementation of modern technologies, Pennywise aims to use AI to help users identify and solve problems pertaining to budgeting and teach users about investing. Financial literacy is a crucial skill and with the help of our valuable team members we were able to create a platform that can improve the importance and spread awareness on financial literacy and how important it is to keep track of your budget.
---

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript (ES6)
- **Backend:** Python, Flask, Flask-SQLAlchemy
- **Database:** SQLite
- **Tools:** VS Code, Live Server (optional), Postman (for testing APIs)

---

## Project Structure
```
Pennywise/
├── front-end/
   └──README.md # Project documentation
   └──config.js # Frontend configuration
   └──index.html # Homepage (dashboard/entry point)
   └──login.css # Styles for login page
   └──login.html # Login page
   └──login.js # Login logic
   └──main.html # Main application page
   └──main.js # Main application JS
   └──register.css # Styles for registration page
   └──register.html # Registration page
   └──register.js # Registration logic
   └──styles.css # Global styles
```
---
```
Pennywise/
├── 📁 back-end/
   ├── controllers/          # Business logic layer
   │   └── transaction_controller.py
   ├── models/              # Database models
   │   └── transaction_model.py
   │   └── user_model.py
   │   └── __init__.py
   ├── instance/ 
   │   └── pennywise.db     # user & transaction database
   ├── routes/              # API route definitions
   │   └── transaction_routes.py
   │   └── auth_routes.py
   │   └── user_routes.py
   ├── utils/
   │   └── decorator.py     
   ├── requirements.txt     # Python dependencies
```
---
## Installation

### Prerequisites

-   Python 3.8 or higher
-   pip (Python package installer)

### Setup Steps

1. **Navigate to the backend directory**

    `cd back-end`

2. **Create and activate a virtual environment**

    ```
    # On Windows
    python -m venv venv
    .venv\Scripts\activate

    # On macOS/Linux
    python -m venv venv
    source venv/bin/activate
    ```

3. **Install dependencies**

    `pip install -r requirements.txt`
---

## Usage
* Pennywise can be used for a wide variety of financial applications such as:
  * Budget tracking
  * Recording/Viewing/Deleting Transactions
  * Interactive AI Chatbot for support
  * Data Charts to visualize income/expenses  

## Documentation

### Frontend README
- [Front-End Documentation](front-end/README.md)

### Backend README
- [Back-End Documentation](back-end/README.md)

## Author
- PennyWise Development Team

## License
**This project is licensed under the MIT License - see the LICENSE file for details.**
