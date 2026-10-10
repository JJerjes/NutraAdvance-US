const CART_KEY = 'cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

let cart = loadCart();
let cartInitialized = false;

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function openCartModal() {
  const modal = document.getElementById('cart-modal');
  const toggleBtn = document.getElementById('cart-toggle-btn');

  if (modal) modal.style.display = 'flex';
  if (toggleBtn) toggleBtn.style.display = 'none';
}

export function minimizeCartModal() {
  const modal = document.getElementById('cart-modal');
  const toggleBtn = document.getElementById('cart-toggle-btn');

  if (modal) modal.style.display = 'none';
  if (toggleBtn) toggleBtn.style.display = cart.length > 0 ? 'flex' : 'none';
}

export function updateCartModal() {
  const itemsContainer = document.getElementById('cart-items-container');
  const totalElement = document.getElementById('cart-total');
  const badgeElement = document.getElementById('cart-counter-badge');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badgeElement) badgeElement.textContent = totalItems;

  if (!itemsContainer || !totalElement) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
    totalElement.textContent = '0.00';
    return;
  }

  itemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item) => {
    const subtotal = item.precio * item.quantity;
    total += subtotal;

    const row = document.createElement('div');
    row.classList.add('cart-item-row');
    row.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.nombre}</strong><br>
        Cantidad: ${item.quantity} unid.<br>
        Subtotal: S/ ${subtotal.toFixed(2)}
      </div>
      <button class="remove-item-btn" data-id="${item.id}" aria-label="Quitar producto">&times;</button>
    `;
    itemsContainer.appendChild(row);
  });

  totalElement.textContent = total.toFixed(2);
}

export function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio.oferta,
      quantity: 1,
    });
  }

  saveCart();
  updateCartModal();
  openCartModal();
}

export function removeFromCart(productId) {
  cart = cart.filter((item) => String(item.id) !== String(productId));
  saveCart();
  updateCartModal();

  if (cart.length === 0) minimizeCartModal();
}

export function initCart() {
  if (cartInitialized) return;
  cartInitialized = true;

  document.addEventListener('click', (event) => {
    if (event.target.closest('#cart-toggle-btn')) {
      openCartModal();
      return;
    }

    if (
      event.target.closest('#minimize-modal') ||
      event.target.id === 'cart-modal'
    ) {
      minimizeCartModal();
      return;
    }

    const removeBtn = event.target.closest('.remove-item-btn');
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.id);
      return;
    }

    if (event.target.closest('#checkout-btn') && cart.length > 0) {
      window.location.href = '/pages/checkout.html';
    }
  });

  updateCartModal();
  minimizeCartModal();
}

export function getCart() {
  return cart.map((item) => ({ ...item }));
}

export function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);
}

export function clearCart() {
  cart = [];
  saveCart();
}
