let produtos = [];

fetch("produtos.json")
  .then(res => res.json())
  .then(data => {
    produtos = data;
    renderTabela();
  });

function renderTabela() {
  const tbody = document.querySelector("#tabela-produtos tbody");
  tbody.innerHTML = "";

  produtos.forEach((produto, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${produto.id}</td>
      <td>${produto.title}</td>
      <td>${produto.category}</td>
      <td>${produto.price.toFixed(2)}</td>
      <td>${produto.quantity}</td>
      <td>
        <button onclick="vender(${index})">Vender</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filtrarProdutos() {
  const termo = document.getElementById("search").value.toLowerCase();
  const linhas = document.querySelectorAll("#tabela-produtos tbody tr");

  linhas.forEach(tr => {
    const texto = tr.innerText.toLowerCase();
    tr.style.display = texto.includes(termo) ? "" : "none";
  });
}

function vender(index) {
  if (produtos[index].quantity > 0) {
    produtos[index].quantity -= 1;
    salvarProdutos();
    renderTabela();
  } else {
    alert("Estoque esgotado.");
  }
}

function abrirModalAdicionar() {
  document.getElementById("modal-title").value = "";
  document.getElementById("modal-category").value = "outros";
  document.getElementById("modal-price").value = "";
  document.getElementById("modal-quantity").value = 1;
  document.getElementById("modal").classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
}

function salvarModal() {
  const novo = {
    id: produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1,
    title: document.getElementById("modal-title").value,
    category: document.getElementById("modal-category").value,
    price: parseFloat(document.getElementById("modal-price").value),
    quantity: parseInt(document.getElementById("modal-quantity").value)
  };
  produtos.push(novo);
  salvarProdutos();
  fecharModal();
  renderTabela();
}

function salvarProdutos() {
  fetch("http://localhost:5000/salvar-produtos", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(produtos)
  });
}
