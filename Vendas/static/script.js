
let produtos = [];
let carrinho = [];

fetch("/produtos.json")
  .then(res => res.json())
  .then(data => {
    produtos = data;
    renderEstoque();
  });

function renderEstoque() {
  const tbody = document.querySelector("#tabela-estoque tbody");
  tbody.innerHTML = "";
  produtos.forEach((prod, i) => {
    if (prod.quantity > 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod.title}</td>
        <td>R$ ${prod.price.toFixed(2)}</td>
        <td>${prod.quantity}</td>
        <td><button class="btn" onclick="adicionarAoCarrinho(${i})">Adicionar</button></td>
      `;
      tbody.appendChild(tr);
    }
  });
}

function renderCarrinho() {
  const tbody = document.querySelector("#tabela-carrinho tbody");
  tbody.innerHTML = "";
  let total = 0;
  carrinho.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.title}</td>
      <td><input type="number" value="${item.qtd}" min="1" max="${item.max}" onchange="alterarQtd(${i}, this.value)"></td>
      <td>R$ ${(item.qtd * item.price).toFixed(2)}</td>
      <td><button onclick="removerCarrinho(${i})">🗑</button></td>
    `;
    tbody.appendChild(tr);
    total += item.qtd * item.price;
  });
  document.getElementById("total").textContent = `Total: R$ ${total.toFixed(2)}`;
}

function adicionarAoCarrinho(index) {
  const prod = produtos[index];
  const existente = carrinho.find(p => p.id === prod.id);
  if (existente) {
    if (existente.qtd < existente.max) {
      existente.qtd++;
    }
  } else {
    carrinho.push({ ...prod, qtd: 1, max: prod.quantity });
  }
  renderCarrinho();
}

function alterarQtd(index, valor) {
  carrinho[index].qtd = parseInt(valor);
  renderCarrinho();
}

function removerCarrinho(index) {
  carrinho.splice(index, 1);
  renderCarrinho();
}

function confirmarVenda() {
  carrinho.forEach(item => {
    const produto = produtos.find(p => p.id === item.id);
    if (produto) {
      produto.quantity -= item.qtd;
    }
  });
  carrinho = [];
  salvarProdutos();
  renderEstoque();
  renderCarrinho();
  alert("Venda confirmada e estoque atualizado.");
}

function salvarProdutos() {
  fetch("http://localhost:5000/salvar-produtos", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(produtos)
  }).then(res => {
    if (!res.ok) alert("Erro ao salvar produtos.");
  });
}

function filtrarProdutos() {
  const busca = document.getElementById("busca").value.toLowerCase();
  const tbody = document.querySelector("#tabela-estoque tbody");
  tbody.innerHTML = "";
  produtos.forEach((prod, i) => {
    if (prod.quantity > 0 && prod.title.toLowerCase().includes(busca)) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod.title}</td>
        <td>R$ ${prod.price.toFixed(2)}</td>
        <td>${prod.quantity}</td>
        <td><button class="btn" onclick="adicionarAoCarrinho(${i})">Adicionar</button></td>
      `;
      tbody.appendChild(tr);
    }
  });
}

function abrirModalAvulso() {
  document.getElementById("modal-avulso").style.display = "block";
}

function fecharModalAvulso() {
  document.getElementById("modal-avulso").style.display = "none";
}

function adicionarAvulso() {
  const title = document.getElementById("avulso-title").value;
  const price = parseFloat(document.getElementById("avulso-price").value);
  const quantity = parseInt(document.getElementById("avulso-quantity").value);

  if (!title || isNaN(price) || isNaN(quantity)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  carrinho.push({
    id: "avulso_" + Date.now(),
    title,
    price,
    qtd: quantity,
    max: quantity
  });

  fecharModalAvulso();
  renderCarrinho();
}
