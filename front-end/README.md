# Front-End Development

## Overview
The PennyWise **frontend** is the user interface of the financial tracking system.  
It allows users to:
- View transactions and balances
- Add and delete transactions
- Log in to access their personalized account
- Interact with backend financial data in real time

The frontend is built using **HTML, CSS, and JavaScript**, designed to be responsive and user-friendly.

---

## Project Structure
frontend/
├── index.html        # Main dashboard page
├── login.html        # User login page
├── styles.css        # Global stylesheet
├── scripts/          # JavaScript files
│   └── app.js        # Main frontend logic
└── assets/           # Images, icons, etc.

---

## Installation

### Prerequisites
- Web browser (latest Chrome, Firefox, or Edge recommended)
- Basic knowledge of HTML, CSS, and JavaScript

### Setup Steps
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   Open index.html in your browser to view the app.
(Or use VS Code’s Live Server extension for auto-reloading while developing.)

Ensure the backend server is running at http://127.0.0.1:5000/api/ for dynamic features like transactions and login.

(Optional) If you need to update API endpoints, edit the base URL inside scripts/app.js or the relevant config file.


## Usage
Running the Frontend

Open index.html in your browser to view the dashboard.

Open login.html to access the login page.

Ensure the backend server is running to enable full functionality.


## Configuration
http://127.0.0.1:5000/api/

## Development

### Adding New Features
1. Implement the feature in scripts/app.js or a new script file.

2. Link the new script in index.html or the relevant page.

3. Test locally with the backend running.

## Dependencies

**HTML5 / CSS3** – Structure and styling
**JavaScript (ES6)** – Frontend logic and interactivity
**Fetch API** – Communication with backend API
 **Axios** – Alternative for HTTP requests

## Author

PennyWise Development Team

## License

This project is licensed under the MIT License - see the LICENSE file for details.


