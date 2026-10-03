import { loadComponent } from './componentLoader.js';

document.addEventListener('DOMContentLoaded', async () => {
  loadComponent('main-header', '/partials/header.html');
  loadComponent('main-content', '/partials/main-hero.html');
  await loadComponent('main-footer', '/partials/footer.html');

  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
