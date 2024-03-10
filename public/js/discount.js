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
        // El cupón se aplicó correctamente, mostrar mensaje de éxito
        document.getElementById('discountInput').classList.add('d-none');
        document.getElementById('discountOk').classList.remove('d-none');
    })
    .catch(error => {
        // Mostrar mensaje de error si la consulta falla
        console.error('Error:', error);
        document.getElementById('discountError').classList.remove('d-none');
    });
}