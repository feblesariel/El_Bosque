// Función para actualizar la URL con el parámetro de categoría
function updateCategory(categoryID) {
    const url = new URL(window.location.href);
    url.searchParams.delete('product'); // Eliminar el parámetro 'product'
    url.searchParams.set('category', categoryID);
    window.location.href = url.toString();
}

// Función para actualizar la URL con el parámetro de producto y eliminar el parámetro de categoría
function updateProduct(productID) {
    const url = new URL(window.location.href);
    url.searchParams.delete('category'); // Eliminar el parámetro 'category'
    url.searchParams.set('product', productID); // Establecer el parámetro 'product'
    window.location.href = url.toString(); // Redirigir a la URL actualizada
}