import { loadComponent } from './componentLoader.js';
import { loadLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', async () => {
  loadLayout();
  loadComponent('main-content', '/partials/main-hero.html');
});
