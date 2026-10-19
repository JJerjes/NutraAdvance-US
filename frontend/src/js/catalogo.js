import { loadComponent } from './componentLoader.js';
import { loadLayout } from './layout.js';
import { addToCart, initCart } from './cart.js';
import { initImageModal } from './imagesModal.js';

function createProductCard(product) {
  const card = document.createElement('div');
  card.classList.add('product-card');

  // Verificar si hay stock disponible
  const stockAvailable = product.stock && product.stock > 0;

  card.innerHTML = `
    <img src="${product.imagen}" alt="${product.nombre}" class="product-thumb" loading="lazy">
    <div class="product-info">
      <h3>${product.nombre}</h3>
      <p>${product.descripcion}</p>
      
      <!-- Contenedor con distribución en 2 columnas -->
      <div class="price-container">
        <!-- Columna Izquierda: Precio Anterior arriba y Precio Actual abajo -->
        <div class="left-price">
          ${
            product.precio.original
              ? `<span class="original-price">Antes: S/${product.precio.original}</span>`
              : ''
          }
          <div class="current-price-wrapper">
            <span class="price-label">Ahora:</span>
            <span class="price">S/${product.precio.oferta}</span>
          </div>
        </div>

        <!-- Columna Derecha: Estado de Stock -->
        <div class="right-stock">
          <span class="stock-badge ${stockAvailable ? 'in-stock' : 'out-of-stock'}">
            ${stockAvailable ? `Stock: ${product.stock}` : 'Agotado'}
          </span>
        </div>
      </div>

      <!-- Botón inteligente que se deshabilita si no hay stock -->
      <button 
        class="btn-buy" 
        data-id="${product.id}" 
        ${!stockAvailable ? 'disabled' : ''}
      >
        ${stockAvailable ? 'Añadir al carrito' : 'Agotado'}
      </button>
    </div>
  `;

  // Asignar el evento solo si hay stock disponible
  const buyBtn = card.querySelector('.btn-buy');
  if (stockAvailable) {
    buyBtn.addEventListener('click', () => addToCart(product));
  }

  return card;
}

async function loadProducts(grid, jsonPath) {
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`No se pudo cargar ${jsonPath}`);

    const products = await response.json();
    grid.innerHTML = '';
    products.forEach((product) => grid.appendChild(createProductCard(product)));
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    grid.innerHTML =
      '<p>No pudimos cargar los productos. Intenta de nuevo más tarde.</p>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  loadLayout();

  await loadComponent('modal-container', '/partials/cart-modal.html');
  initCart();

  const grid = document.getElementById('products-grid');
  if (!grid) return;

  initImageModal(grid, '.product-thumb');

  if (!grid.dataset.json) {
    console.error('Falta el atributo data-json en #products-grid');
    return;
  }

  await loadProducts(grid, grid.dataset.json);
});