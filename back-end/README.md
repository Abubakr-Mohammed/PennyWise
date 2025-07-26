# Back-End Development

## Overview

A financial tracking system where users can add, delete, and edit transactions, log in to access their account, view charts, and receive personalized financial advice. Bonus features include financial advising and currency conversion.

### Project Structure
```
back-end/
├── controllers/          # Business logic layer
│   └── transaction_controller.py
├── models/              # Database models
│   └── transaction_model.py
├── routes/              # API route definitions
│   └── test_route.py
├── requirements.txt     # Python dependencies
```
## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

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

## Usage

### Running the Development Server

```
#Make sure you db is initialized
python init_db.py

# Run the Flask development server
python app.py
```
The API will be available at `http://localhost:5000`



## Configuration

### Environment Variables

Create a `.env` file in the back-end directory:

```
SECRET_KEY=your-secret-key-here
```

### Database Configuration

The application uses SQLite by default. Database file will be created automatically at `pennywise.db` in the back-end directory.

## Development

### Adding New Dependencies

1. Install the new package:
   ```
   pip install package-name
   ```
2. Update requirements.txt:
    ```
   pip freeze > requirements.txt
   ```

3. **Important**: Clean up requirements.txt to only include direct dependencies

### Dependencies

- **Flask** - Web framework
- **Flask-SQLAlchemy** - Database ORM integration
- **SQLAlchemy** - Database ORM
- **Werkzeug** - Password hashing and security utilities
- **blinker** - Flask signal support
- **click** - Command line utilities for Flask
- **itsdangerous** - Secure data serialization for Flask
- **Jinja2** - Templating engine for Flask
- **MarkupSafe** - String escaping for Jinja2
- **greenlet** - Lightweight in-process concurrent programming
- **typing_extensions** - Backports for Python typing

## Author

PennyWise Development Team

## License

This project is licensed under the MIT License - see the LICENSE file for details.
