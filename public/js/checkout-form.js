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

    // Obtener el li del tipo de envio
    var pickupDeliveryMethod = document.getElementById('pickupDeliveryMethod');

    // Obtener span del total
    var totalValue = document.getElementById('totalValue');

    // Realizar la consulta asincrónica usando fetch.
    fetch('/checkout/method/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderType: orderType }) // Incluir el carrito actualizado en el cuerpo de la solicitud
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ocurrió un error al realizar el method change.');
        }
        // Devuelve la respuesta JSON para el siguiente then.
        return response.json();
    })    
    .then(data => {

        console.log(data)

        if (data.success && (orderType === "delivery")) {

            totalValue.innerText = "$" + data.newTotal;
            deliveryZone.classList.remove('d-none'); // Mostrar el área de envío
            pickupDeliveryMethod.querySelector('span:nth-child(1)').innerText = data.delivery.name;
            pickupDeliveryMethod.querySelector('span:nth-child(2)').innerText = "$" + data.delivery.price;

        } else if (data.success && (orderType === "pickup")) {

            deliveryZone.classList.add('d-none'); // Ocultar el área de envío
            pickupDeliveryMethod.querySelector('span:nth-child(1)').innerText = "Método de Entrega";
            pickupDeliveryMethod.querySelector('span:nth-child(2)').innerText = "Retiro";
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