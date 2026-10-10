import { getCart, getCartTotal } from './cart.js';

export function renderOrderSummary() {
  const cart = getCart();
  const list = document.getElementById('lista-seleccionados');
  const totalElement = document.getElementById('total-precio');

  if (!list || !totalElement) return cart;

  list.innerHTML = '';

  cart.forEach((item) => {
    const row = document.createElement('li');

    const name = document.createElement('span');
    name.textContent = `${item.nombre} (x${item.quantity})`;

    const price = document.createElement('strong');
    price.textContent = `S/${(item.precio * item.quantity).toFixed(2)}`;

    row.append(name, price);
    list.appendChild(row);
  });

  totalElement.textContent = `Total: S/${getCartTotal().toFixed(2)}`;
  return cart;
}