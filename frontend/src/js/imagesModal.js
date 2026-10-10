export function initImageModal(container, thumbSelector) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('img01');
  const closeBtn = modal ? modal.querySelector('.close-modal') : null;

  if (!modal || !modalImg || !closeBtn) return;

  const closeModal = () => {
    modal.style.display = 'none';
  };

  container.addEventListener('click', (event) => {
    const thumb = event.target.closest(thumbSelector);
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
