export function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toast.classList.add('toast', `toast-${type}`);
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 500);
  }, duration);
}
