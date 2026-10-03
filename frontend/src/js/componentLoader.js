export async function loadComponent(targetContainer, filePath) {
  try {
    const response = await fetch(filePath);

    if (!response.ok) throw new Error(`No se pudo cargar ${filePath}`);

    const data = await response.text();
    const container = document.getElementById(targetContainer);
    if (container) container.innerHTML = data;
  } catch (error) {
    console.error('Error al cargar componente:', error);
  }
}
