import { loadComponent } from './componentLoader.js';

export async function loadLayout() {
  loadComponent('main-header', '/partials/header.html');
  loadComponent('whatsapp-container', '/partials/whatsapp-float.html');
  await loadComponent('main-footer', '/partials/footer.html');

  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
