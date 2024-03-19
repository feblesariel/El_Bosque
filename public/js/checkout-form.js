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

    // Obtener los li del DOM
    var pickuoMethod = document.getElementById('pickuoMethod');
    var deliveryMethod = document.getElementById('deliveryMethod');

    // Obtener mediente dataset el delivery
    var deliveryData = document.getElementById('orderType').dataset.delivery;
    var delivery = JSON.parse(deliveryData);

    // Si la opción seleccionada es "Envío a domicilio", mostrar el área de envío; de lo contrario, ocultarla
    if (orderType === 'delivery') {
        deliveryZone.classList.remove('d-none'); // Mostrar el área de envío
        deliveryMethod.classList.remove('d-none'); // Mostrar el área de envío
        pickuoMethod.classList.add('d-none'); // Ocultar el área de envío
    } else {
        deliveryZone.classList.add('d-none'); // Ocultar el área de envío
        deliveryMethod.classList.add('d-none'); // Ocultar el área de envío
        pickuoMethod.classList.remove('d-none'); // Mostrar el área de envío
    }

    // Verificar el estado inicial del formulario
    const isFormCompleted = checkFormCompletion();
    sendBtn.disabled = !isFormCompleted;
}

document.addEventListener('DOMContentLoaded', () => {
    // Agregar un event listener a cada campo de entrada para verificar si está completo
    const formFields = document.querySelectorAll('#name, #tel, #email, #postcode, #city, #address');
    formFields.forEach(field => {
        field.addEventListener('input', () => {
            const isFormCompleted = checkFormCompletion();
            sendBtn.disabled = !isFormCompleted;
        });
    });
});