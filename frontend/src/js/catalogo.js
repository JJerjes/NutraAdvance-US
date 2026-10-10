import { loadComponent } from './componentLoader.js';
import { loadLayout } from './layout.js';
import { addToCart, initCart } from './cart.js';

function createProductCard(product) {
  const card = document.createElement('div');
  card.classList.add('product-card');

  card.innerHTML = `
    <img src="${product.imagen}" alt="${product.nombre}" class="product-thumb" loading="lazy">
    <div class="product-info">
      <h3>${product.nombre}</h3>
      <p>${product.descripcion}</p>
      <div class="price-container">
        <span class="original-price">Antes: S/${product.precio.original}</span>
        <span class="price">Ahora: S/${product.precio.oferta}</span>
      </div>
      <button class="btn-buy" data-id="${product.id}">Añadir al carrito</button>
    </div>
  `;

  card
    .querySelector('.btn-buy')
    .addEventListener('click', () => addToCart(product));

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
    grid.innerHTML = '<p>No pudimos cargar los productos. Intenta de nuevo más tarde.</p>';
  }
}

function initImageModal(grid) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('img01');
  const closeBtn = modal ? modal.querySelector('.close-modal') : null;

  if (!modal || !modalImg || !closeBtn) return;

  const closeModal = () => {
    modal.style.display = 'none';
  };

  grid.addEventListener('click', (event) => {
    const thumb = event.target.closest('.product-thumb');
    if (!thumb) return;

    modalImg.src = thumb.src;
    modalImg.alt = thumb.alt;
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  loadLayout();

  await loadComponent('modal-container', '/partials/cart-modal.html');
  initCart();

  const grid = document.getElementById('products-grid');
  if (!grid) return;

    initImageModal(grid);

  if (!grid.dataset.json) {
    console.error('Falta el atributo data-json en #products-grid');
    return;
  }

  await loadProducts(grid, grid.dataset.json);
});