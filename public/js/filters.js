// Función para actualizar la URL con el parámetro de categoría.
function updateCategory(categoryID) {
    const url = new URL(window.location.href);
    // Eliminar los parámetros de búsqueda existentes
    url.searchParams.delete('openCart');
    url.searchParams.delete('order');
    url.searchParams.delete('category');
    url.searchParams.delete('page');
    url.searchParams.delete('search');
    // Establecer el parámetro 'category'
    url.searchParams.set('category', categoryID);
    // Redirigir a la URL actualizada.
    window.location.href = url.toString();
}

// Función para actualizar la URL con el filtrado.
function buildOrderURL(order) {
    const url = new URL(window.location.href);
    // Eliminar los parámetros de búsqueda existentes
    url.searchParams.delete('openCart');
    url.searchParams.delete('order');
    url.searchParams.delete('page');
    // Establecer el parámetro 'order'.
    url.searchParams.set('order', order);
    // Redirigir a la URL actualizada.
    window.location.href = url.toString();
  }
  
// Leer la URL actual para marcar el filtro seleccionado.
const currentURL = window.location.href;
const orderElements = {
    'orderName': 'order=name',
    'orderPopular': 'order=popular',
    'orderLowPrice': 'order=lowPrice',
    'orderHighPrice': 'order=highPrice'
};

// Iterar sobre los elementos y verificar si están presentes en la URL actual.
for (const elementId in orderElements) {
    if (currentURL.includes(orderElements[elementId])) {
        document.getElementById(elementId).classList.remove('d-none');
    }
};