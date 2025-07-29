from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

DATA_FILE = 'produtos.json'

@app.route('/')
def index():
    return render_template('index.html')

# ...restante do código...
app = Flask(__name__)
DATA_FILE = 'produtos.json'

def load_products():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as file:
            return json.load(file)
    return []

def save_products(products):
    with open(DATA_FILE, 'w') as file:
        json.dump(products, file)

@app.route('/produtos', methods=['GET'])
def get_products():
    products = load_products()
    return jsonify(products)

@app.route('/salvar-produtos', methods=['POST'])
def save_product_data():
    products = request.json
    save_products(products)
    return jsonify({"message": "Produtos salvos com sucesso!"}), 200

if __name__ == '__main__':
    app.run(debug=True)