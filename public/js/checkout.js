// Función para verificar si todos los campos del formulario están completos
function checkFormCompletion() {
    // Obtener el valor seleccionado en el campo select
    const orderType = document.getElementById('orderType').value;
    // Definir los campos que deben verificarse dependiendo del tipo de orden
    let formFields;
    if (orderType === "pickup") {
        formFields = document.querySelectorAll('#name, #tel, #email');
    } else {
        formFields = document.querySelectorAll('#name, #tel, #email, #postcode, #city, #address');
    }

    // Verificar si todos los campos están completos
    let allFieldsCompleted = true;
    formFields.forEach(field => {
        if (field.value.trim() === '') {
            allFieldsCompleted = false;
        }
    });

    // Devolver true si todos los campos están completos, de lo contrario, devolver false
    return allFieldsCompleted;
}

// Variable sendBtn definida fuera del alcance de DOMContentLoaded
const sendBtn = document.getElementById('btnSendOut');

function toggleDeliveryZone() {

    // Obtener el valor seleccionado en el select
    var orderType = document.getElementById('orderType').value;
    // Obtener el elemento del área de envío a domicilio
    var deliveryZone = document.getElementById('deliveryZone');
    // Obtener span del total
    var totalValue = document.getElementById('totalValue');

    // Realizar la consulta asincrónica usando fetch.
    fetch('/checkout/method/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderType: orderType })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ocurrió un error al realizar el method change.');
        }
        // Devuelve la respuesta JSON para el siguiente then.
        return response.json();
    })    
    .then(data => {

        if (data.success && (orderType === "delivery")) {

            totalValue.innerText = "$" + data.newTotal;
            deliveryZone.classList.remove('d-none'); // Mostrar el área de envío.

        } else if (data.success && (orderType === "pickup")) {

            deliveryZone.classList.add('d-none'); // Ocultar el área de envío.
            totalValue.innerText = "$" + data.newTotal;
        }

    })
    .catch(error => {
        // Mostrar mensaje de error si la consulta falla.
        console.error('Error:', error);
    });

    // Verificar el estado inicial del formulario
    const isFormCompleted = checkFormCompletion();
    sendBtn.disabled = !isFormCompleted;
}

// Verificar y establecer el estado seleccionado al cambiar el metodo de entrega.
function checkSelectedOption(selectElement) {
    // Capturo los LI del metodo de entrega.
    var pickupMethodLi = document.getElementById('pickupMethodLi');
    var DeliveryMethodLi = document.getElementById('DeliveryMethodLi');
    // Pregunto que value tiene y muestro elemento correspondiente.
    if (selectElement.value === "pickup") {
        DeliveryMethodLi.classList.add("d-none");
        pickupMethodLi.classList.remove("d-none");
    } else {
        pickupMethodLi.classList.add("d-none");
        DeliveryMethodLi.classList.remove("d-none");
    }
    var newSelected = selectElement.value;
    var selectedOrderType = localStorage.getItem('selectedOrderType');
    // Pregunta si la opcion seleccionada es diferente a la seleccionada anteriormente.
    if (selectedOrderType !== newSelected) {
        // Llamar a la función del script externo.
        toggleDeliveryZone();
        // Setea local storage.
        localStorage.setItem('selectedOrderType', newSelected);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Capturo los rl value del select y la delivery zone.
    var orderType = document.getElementById('orderType').value;
    var deliveryZone = document.getElementById('deliveryZone');

    // Capturo los LI del metodo de entrega.
    var pickupMethodLi = document.getElementById('pickupMethodLi');
    var DeliveryMethodLi = document.getElementById('DeliveryMethodLi');

    // Pregunto que value tiene y muestro elemento correspondiente.
    if (orderType === "pickup") {
        DeliveryMethodLi.classList.add("d-none");
    } else {
        pickupMethodLi.classList.add("d-none");
    }   
    // Obtengo local storage si hay.         
    var selectedOrderType = localStorage.getItem('selectedOrderType');
    if (selectedOrderType) {
        orderType = selectedOrderType;
    }
    // Si el value es delivery muestro delivery zone.
    if (orderType === "delivery") {
        deliveryZone.classList.remove('d-none'); // Mostrar el área de envío.
    } else if (orderType === "pickup") {
        deliveryZone.classList.add('d-none'); // Ocultar el área de envío.
    }    
    // Agregar un event listener a cada campo de entrada para verificar si está completo.
    const formFields = document.querySelectorAll('#name, #tel, #email, #postcode, #city, #address');
    formFields.forEach(field => {
        field.addEventListener('input', () => {
            const isFormCompleted = checkFormCompletion();
            sendBtn.disabled = !isFormCompleted;
        });
    });
});