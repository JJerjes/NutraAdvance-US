import { loadLayout } from './layout.js';
import { renderOrderSummary } from './cartCheckout.js';
import { getCartTotal } from './cart.js';
import { initStationForm } from './checkoutDynamics.js';
import { WHATSAPP_NUMBER } from './config.js';

function buildDeliveryLink(cart) {
  const lines = cart.map(
    (item) =>
      `- ${item.nombre} (x${item.quantity}) - S/${(item.precio * item.quantity).toFixed(2)}`
  );

  const message = [
    'Hola, quiero hacer un pedido con delivery a domicilio:',
    ...lines,
    `Total: S/${getCartTotal().toFixed(2)}`,
    'Entiendo que el pago es adelantado antes del envío.',
    'Mi dirección es: ',
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function showMethod(method) {
  document.getElementById('estacion-section').hidden = method !== 'estacion';
  document.getElementById('delivery-section').hidden = method !== 'delivery';
}

document.addEventListener('DOMContentLoaded', () => {
  loadLayout();

  const cart = renderOrderSummary();
  const content = document.getElementById('checkout-content');
  const emptyMessage = document.getElementById('empty-cart');

  if (cart.length === 0) {
    content.hidden = true;
    emptyMessage.hidden = false;
    return;
  }

  document.getElementById('delivery-whatsapp').href = buildDeliveryLink(cart);
  initStationForm();

  document
    .querySelectorAll('input[name="delivery-method"]')
    .forEach((radio) =>
      radio.addEventListener('change', (event) =>
        showMethod(event.target.value)
      )
    );
});
