from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # 👉 Habilita CORS para todas as rotas

@app.route('/salvar-produtos', methods=['POST'])
def salvar_produtos():
    try:
        produtos = request.get_json()
        with open('produtos.json', 'w', encoding='utf-8') as f:
            json.dump(produtos, f, ensure_ascii=False, indent=2)
        return jsonify({"mensagem": "Produtos salvos com sucesso!"})
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)