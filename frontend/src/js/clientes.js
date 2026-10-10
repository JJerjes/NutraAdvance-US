import { loadLayout } from './layout.js';
import { initImageModal } from './imagesModal.js';

function createMonthCard(month, isFirst) {
  const count = month.fotos.length;
  const details = document.createElement('details');
  details.classList.add('month-card');
  details.open = isFirst;

  const photos = month.fotos
    .map(
      (foto) => `
      <figure class="client-photo">
        <img src="${foto.imagen}" alt="${foto.descripcion}" class="client-thumb" loading="lazy">
        <figcaption>${foto.descripcion}</figcaption>
      </figure>`
    )
    .join('');

  details.innerHTML = `
    <summary>
      <span class="month-name">${month.periodo}</span>
      <span class="month-count">${count} ${count === 1 ? 'venta' : 'ventas'}</span>
    </summary>
    <div class="photos-grid">${photos}</div>
  `;

  return details;
}

async function loadMonths(container, jsonPath) {
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`No se pudo cargar ${jsonPath}`);

    const months = await response.json();
    container.innerHTML = '';
    months.forEach((month, index) =>
      container.appendChild(createMonthCard(month, index === 0))
    );
  } catch (error) {
    console.error('Error al cargar los clientes:', error);
    container.innerHTML =
      '<p>No pudimos cargar las fotos. Intenta de nuevo más tarde.</p>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  loadLayout();

  const container = document.getElementById('months-container');
  if (!container) return;

  initImageModal(container, '.client-thumb');

  if (!container.dataset.json) {
    console.error('Falta el atributo data-json en #months-container');
    return;
  }

  await loadMonths(container, container.dataset.json);
});
