
let produtos = [];
const categorias = ["placas-de-video", "placa-mae", "processadores", "cooler", "ssds", "fonte", "memoria-ram", "gabinete", "outros"]

fetch("/produtos.json")
  .then(res => res.json())
  .then(data => {
    produtos = data;
    renderTabela();
  })
  .catch(err => console.error("Erro ao carregar produtos:", err));

fetch('/salvar-produtos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(produtos)
});

function renderTabela() {
  const tbody = document.querySelector("#produtos-tabela tbody");
  tbody.innerHTML = "";

  produtos.forEach((produto, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${produto.id}</td>
      <td><input value="${produto.title}" onchange="editarCampo(${index}, 'title', this.value)" /></td>
      <td>
            <select onchange="produtos[${index}].category = this.value">
              ${categorias.map(cat => `<option value="${cat}" ${cat === produto.category ? "selected" : ""}>${cat}</option>`).join('')}
            </select>
          </td>
      <td><input type="number" value="${produto.price}" onchange="editarCampo(${index}, 'price', parseFloat(this.value))" /></td>
      <td><input value="${produto.img}" onchange="editarCampo(${index}, 'img', this.value)" /></td>
      <td><input type="number" value="${produto.quantity || 0}" onchange="editarCampo(${index}, 'quantity', parseInt(this.value))" /></td>
      <td><button onclick="abrirModalDuplicar(${index})">📄 Duplicar</button><button onclick="removerProduto(${index})">🗑 Remover</button></td>
    `;

    tbody.appendChild(tr);
  });
}

function editarCampo(index, campo, valor) {
  produtos[index][campo] = valor;
}

function removerProduto(index) {
  if (confirm("Tem certeza que deseja remover este produto?")) {
    produtos.splice(index, 1);
    renderTabela();
  }
}

function criarModalHTML() {
  const modal = document.createElement("div");
  modal.id = "modal";
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Novo Produto</h2>
      <label>Título: <input id="modal-title" type="text"></label>
    
    <label>Categoria:
      <select id="modal-category">
        <option value="processadores">Processadores</option>
        <option value="placas-de-video">Placas de Vídeo</option>
        <option value="memoria-ram">Memórias</option>
        <option value="placa-mae">Placas Mãe</option>
        <option value="ssds">SSDs</option>
        <option value="gabinete">Gabinetes</option>
        <option value="fonte">Fontes</option>
        <option value="cooler">Coolers</option>
        <option value="outros">Outros</option>
      </select>
    </label>

      <label>Preço (R$): <input id="modal-price" type="number" step="0.01"></label>
      <label>Imagem (URL): <input id="modal-img" type="text" value="/Imagens/renzlogo.png"></label>
      <label>Quantidade: <input id="modal-quantity" type="number" value="1" min="0"></label>
      <div style="text-align: right; margin-top: 10px;">
        <button onclick="salvarProduto()">Salvar</button>
        <button onclick="fecharModal()">Cancelar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function adicionarProduto() {
  if (!document.getElementById("modal")) criarModalHTML();
  document.getElementById("modal").style.display = "block";
}

function fecharModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.style.display = "none";
}

function salvarProduto() {
  const title = document.getElementById("modal-title").value;
  const category = document.getElementById("modal-category").value;
  const price = parseFloat(document.getElementById("modal-price").value);
  const img = document.getElementById("modal-img").value;
  const quantity = parseInt(document.getElementById("modal-quantity").value);

  if (!title || !category || isNaN(price) || !img || isNaN(quantity)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const novo = {
    id: produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1,
    title,
    category,
    price,
    img,
    quantity
  };

  produtos.push(novo);
  fecharModal();
  renderTabela();
}

function abrirModalDuplicar(index) {
  const produto = produtos[index];

  const modal = document.createElement("div");
  modal.classList.add("modal-overlay");
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Duplicar Produto</h2>
      <label>Título: <input id="modal-title" type="text" value="${produto.title}"></label>
      
      <label>Categoria:
        <select id="modal-category">
          <option value="processadores" ${produto.category === 'processadores' ? 'selected' : ''}>Processadores</option>
          <option value="placas de vídeo" ${produto.category === 'placas de vídeo' ? 'selected' : ''}>Placas de Vídeo</option>
          <option value="memórias" ${produto.category === 'memórias' ? 'selected' : ''}>Memórias</option>
          <option value="placas mãe" ${produto.category === 'placas mãe' ? 'selected' : ''}>Placas Mãe</option>
          <option value="ssds" ${produto.category === 'ssds' ? 'selected' : ''}>SSDs</option>
          <option value="gabinetes" ${produto.category === 'gabinetes' ? 'selected' : ''}>Gabinetes</option>
          <option value="fontes" ${produto.category === 'fontes' ? 'selected' : ''}>Fontes</option>
          <option value="coolers" ${produto.category === 'coolers' ? 'selected' : ''}>Coolers</option>
          <option value="periféricos" ${produto.category === 'periféricos' ? 'selected' : ''}>Periféricos</option>
          <option value="outros" ${produto.category === 'outros' ? 'selected' : ''}>Outros</option>
        </select>
      </label>

      <label>Preço (R$): <input id="modal-price" type="number" step="0.01" value="${produto.price}"></label>
      <label>Imagem (URL): <input id="modal-img" type="text" value="${produto.img}"></label>
      <label>Quantidade: <input id="modal-quantity" type="number" value="${produto.quantity ?? 1}" min="0"></label>
      
      <div style="text-align: right; margin-top: 10px;">
        <button onclick="salvarDuplicado(${index})">Salvar Cópia</button>
        <button onclick="fecharModal()">Cancelar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function salvarDuplicado(indexOriginal) {
  const novo = {
    id: produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1,
    title: document.getElementById("modal-title").value,
    category: document.getElementById("modal-category").value,
    price: parseFloat(document.getElementById("modal-price").value),
    img: document.getElementById("modal-img").value,
    quantity: parseInt(document.getElementById("modal-quantity").value)
  };
  produtos.push(novo);
  fecharModal();
  renderTabela();
}

function fecharModal() {
  const modal = document.querySelector(".modal-overlay");
  if (modal) modal.remove();
}


function saveJson() {
  fetch("http://localhost:5000/salvar-produtos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(produtos)
  })
    .then(res => res.json())
    .then(data => {
      alert("Produtos salvos com sucesso!");
    })
    .catch(err => {
      alert("Erro ao salvar os produtos: " + err.message);
    });
}


