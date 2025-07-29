let products = [];

fetch("../produtos.json")

  .then(res => res.json())
  .then(data => {
    products = data.filter(prod => prod.quantity > 0);
    const cat = window.location.pathname.split("/").pop().replace(".html", "");
    renderProducts(cat === "index" || cat === "" ? null : cat);
    updateCartCount();
  })
  .catch(err => console.error("Erro ao carregar produtos:", err));

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalDiv = document.getElementById('cart-total');
const closeCartBtn = document.getElementById('close-cart');
const finalizeCartBtn = document.getElementById('finalize-cart');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  cartBtn.innerText = `Carrinho (${cart.length})`;
}

function renderCart() {
  cartItemsDiv.innerHTML = "";
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Seu carrinho está vazio.</p>";
    cartTotalDiv.innerHTML = "";
    return;
  }

  let total = 0;
  cart.forEach((item, idx) => {
    const prod = products.find(p => p.id === item.id);
    total += prod.price * item.quantity;
    const div = document.createElement('div');
    div.className = "cart-item";
    div.innerHTML = `
      <span>${prod.title} (x${item.quantity}) - R$ ${(prod.price * item.quantity).toFixed(2)}</span>
      <button onclick="removeFromCart(${idx})">X</button>
    `;
    cartItemsDiv.appendChild(div);
  });
  cartTotalDiv.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
}

function addToCart(id) {
  const index = cart.findIndex(item => item.id === id);
  if (index > -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ id: id, quantity: 1 });
  }
  saveCart();
  updateCartCount();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  renderCart();
}

function openCart() {
  renderCart();
  cartModal.classList.remove('hidden');
}

function closeCart() {
  cartModal.classList.add('hidden');
}

function finalizePurchase() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  let message = 'Olá! Gostaria de comprar os seguintes produtos:%0A';
  let total = 0;
  cart.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    const subtotal = prod.price * item.quantity;
    total += subtotal;
    message += `- ${prod.title} (x${item.quantity}) - R$ ${subtotal.toFixed(2)}%0A`;
  });
  message += `Total: R$ ${total.toFixed(2)}`;

  const url = `https://api.whatsapp.com/send?phone=5575998256180&text=${message}`;
  window.open(url, '_blank');
}

function renderProducts(filterCategory = null) {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";
  const lista = filterCategory
    ? products.filter(p => p.category === filterCategory)
    : products;
  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="../${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>R$ ${p.price.toFixed(2)}</p>
      <button onclick="addToCart(${p.id})">Adicionar ao carrinho</button>
      <button onclick="contactWhats(${p.id})">WhatsApp</button>
    `;
    container.appendChild(card);
  });
  updateCartCount();
}

function contactWhats(id) {
  const prod = products.find(p => p.id === id);
  const url = `https://api.whatsapp.com/send?phone=5575998256180&text=Oi,+gostaria+de+saber+sobre:+${encodeURIComponent(prod.title)}`;
  window.open(url, "_blank");
}

window.onload = () => {
  const cat = window.location.pathname.split("/").pop().replace(".html", "");
  renderProducts(cat === "index" || cat === "" ? null : cat);

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (finalizeCartBtn) finalizeCartBtn.addEventListener('click', finalizePurchase);


};
