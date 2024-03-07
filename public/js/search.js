$(document).ready(function() {
    $('#searchForm').submit(function(event) {
        event.preventDefault(); // Evita que se envíe el formulario normalmente
        
        // Obtén el valor del campo de búsqueda
        const searchTerm = $('#headerSearch').val();
        
        // Construye la URL de destino con el parámetro de búsqueda
        const destinationUrl = '/products/shop?search=' + encodeURIComponent(searchTerm);
        
        // Redirige a la URL de destino
        window.location.href = destinationUrl;
    });
});