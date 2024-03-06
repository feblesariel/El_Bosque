// Función para actualizar la URL con el parámetro de categoría.
function updateCategory(categoryID) {
    const url = new URL(window.location.href);
    url.searchParams.delete('openCart'); // Eliminar el parámetro 'openCart' preexistente.
    url.searchParams.delete('category'); // Eliminar el parámetro 'category' preexistente.
    url.searchParams.delete('page'); // Eliminar el parámetro 'page' preexistente.
    url.searchParams.set('category', categoryID); // Establecer el parámetro 'category'
    window.location.href = url.toString(); // Redirigir a la URL actualizada.
}

// Función para actualizar la URL con el filtrado.
function buildOrderURL(order) {
    const url = new URL(window.location.href);
    url.searchParams.delete('openCart'); // Eliminar el parámetro 'openCart' preexistente.
    url.searchParams.delete('order'); // Eliminar el parámetro 'order' preexistente.
    url.searchParams.delete('page'); // Eliminar el parámetro 'page' preexistente.
    url.searchParams.set('order', order); // Establecer el parámetro 'order'.
    window.location.href = url.toString(); // Redirigir a la URL actualizada.
  }
  
  // Lee la URL actual para marcar filtro seleccionado.
  const currentURL = window.location.href;
  
  if (currentURL.includes('order=name')) {
    document.getElementById('orderName').classList.remove('d-none');
  } else if (currentURL.includes('order=popular')) {
    document.getElementById('orderPopular').classList.remove('d-none');
  } else if (currentURL.includes('order=lowPrice')) {
    document.getElementById('orderLowPrice').classList.remove('d-none');
  } else if (currentURL.includes('order=highPrice')) {
    document.getElementById('orderHighPrice').classList.remove('d-none');
  }