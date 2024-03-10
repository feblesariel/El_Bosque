//Funcion para habilitar el boton.
function validateCouponInput() {
    const cuponInput = document.getElementById('cupon');
    const cuponBtn = document.getElementById('cuponBtn');
    if (cuponInput.value.trim() !== '') {
        cuponBtn.disabled = false;
    } else {
        cuponBtn.disabled = true;
    }
}