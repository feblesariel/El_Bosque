//Funcion para habilitar el boton.
function validateCouponInput() {
    const cuponInput = document.getElementById('coupon');
    const cuponBtn = document.getElementById('couponBtn');
    if (cuponInput.value.trim() !== '') {
        cuponBtn.disabled = false;
    } else {
        cuponBtn.disabled = true;
    }
}

//Funcion para aplicar el cupon.
function applyCoupon() {

    const cuponInput = document.getElementById('coupon').value.trim();

    // Realizar la consulta asincrónica usando fetch.
    fetch('/checkout/discount/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coupon: cuponInput })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ocurrió un error al aplicar el cupón.');
        }
        // Devuelve la respuesta JSON para el siguiente then
        return response.json();
    })    
    .then(data => {
        // Actualiza la página con el nuevo valor total
        document.getElementById('totalValue').innerText = "$" + data.newTotal;
        // Muestra el mensaje de éxito
        document.getElementById('discountMsg').classList.remove('d-none');
        document.getElementById('discountMsgValue').innerText = "¡Cupón aplicado! " + data.discount.description;
        let cuponInput = document.getElementById('coupon');
        cuponInput.value = "";
        validateCouponInput();
        cuponInput.focus();
    })
    .catch(error => {
        // Mostrar mensaje de error si la consulta falla
        console.error('Error:', error);
        document.getElementById('discountMsg').classList.remove('d-none');
        document.getElementById('discountMsgValue').innerText = "¡El cupón no existe!";
        let cuponInput = document.getElementById('coupon');
        cuponInput.value = "";
        validateCouponInput();
        cuponInput.focus();
    });
}