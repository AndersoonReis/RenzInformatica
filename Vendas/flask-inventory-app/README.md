# Flask Inventory App

This project is a simple inventory management application built using Flask. It allows users to view, add, and manage products stored in a JSON file.

## Project Structure

```
flask-inventory-app
├── app.py              # Main entry point of the Flask application
├── produtos.json       # JSON file containing product data
├── static
│   └── script.js       # JavaScript code for client-side interactions
├── templates
│   └── index.html      # Main HTML template for the application
└── README.md           # Documentation for the project
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd flask-inventory-app
   ```

2. **Install dependencies**:
   Make sure you have Python and pip installed. Then, install Flask:
   ```
   pip install Flask
   ```

3. **Run the application**:
   Execute the following command to start the Flask server:
   ```
   python app.py
   ```

4. **Access the application**:
   Open your web browser and go to `http://127.0.0.1:5000` to view the application.

## Usage Guidelines

- The application allows you to view the current inventory of products.
- You can add new products through the provided interface.
- Changes made to the inventory will be saved to `produtos.json`.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.