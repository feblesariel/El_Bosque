// ************ Requires ************

//--- Database

const db = require('../database/models/index.js');
const sequelize = db.sequelize;
const { Op } = require("sequelize");

const Category = db.Category;
const Discount = db.Discount;
const Order_detail_delivery = db.Order_detail_delivery;
const Order_detail_pickup = db.Order_detail_pickup;
const Order_item = db.Order_item;
const Order = db.Order;
const Payment = db.Payment;
const Product_image = db.Product_image;
const Product_option = db.Product_option;
const Product = db.Product;
const Suscriber = db.Suscriber;

// ************ Controllers ************

const checkoutController = {

    checkout: function (req, res) {

        const getCategories = Category.findAll({
            order: [
                ['name', 'ASC']
            ]
        });

        const getProducts = Product.findAll({
            where: {
                available: true
            },
            include: [
                {
                    association: 'Category'
                },
                {
                    association: 'Product_image'
                }
            ]
        });

        const cart = req.cookies.cart;

        Promise.all([getCategories, getProducts])
            .then(([Categories, Products]) => {

                res.render('checkout', { Categories, Products, cart})

            })
            .catch(error => {
                console.error('Error:', error);
            });

    },

    discount: async function (req, res) {

        try {
            // Obtener el código del cupón del cuerpo de la solicitud
            const { coupon } = req.body;

            // Buscar el descuento en la base de datos por el código
            const discount = await Discount.findOne({
                where: {
                    code: coupon,
                    active: true // Asegúrate de que el descuento esté activo
                }
            });

            // Verificar si se encontró un descuento válido
            if (discount) {
                // Aquí puedes realizar el cálculo del descuento y actualizar la cookie del carrito
                const discountPercentage = discount.discount_percentage;
                const newTotal = calcularNuevoTotal(req.cookies.cart.total, discountPercentage);

                // Obtén el carrito como un objeto JavaScript directamente.
                let cart = req.cookies.cart;

                if (!cart.discount) { // Si la cookie aún no tiene la propiedad 'discount', inicialízala como un array vacío.
                    cart.discount = discountPercentage;
                }

                // Nuevo total.
                cart.total = parseFloat(newTotal).toFixed(2);                

                // Desactivar el descuento utilizado
                await Discount.update({ active: false }, { where: { code: coupon } });

                // Eliminar la cookie existente antes de redefinirla
                res.clearCookie('cart');

                // Define las opciones para la cookie.
                const options = {
                    maxAge: 6 * 60 * 60 * 1000, // Duración de la cookie en milisegundos (6 horas).
                    httpOnly: true, // La cookie solo será accesible a través del protocolo HTTP (no a través de JavaScript en el navegador).
                    secure: true, // La cookie solo se enviará a través de HTTPS (para conexiones seguras).
                    sameSite: 'strict' // Restringe el envío de cookies en las solicitudes cross-origin.
                };

                // Define la cookie.
                res.cookie('cart', cart, options);

                // Envio el nuevo valor del total a la llamada.
                res.status(200).json({ success: true, message: 'correct coupon.', newTotal: cart.total, discount: discount });

            } else {
                // Si no se encontró un descuento válido, enviar una respuesta indicando que el cupón es incorrecto.
                res.status(200).json({ success: false, message: 'incorrect coupon.' });

            }
        } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso.
            res.status(500).json({ success: false, message: 'internal server error.' });
        }
    },


    procces: function (req, res) {













    }

};

// Esta función calcula el nuevo total con el descuento aplicado
function calcularNuevoTotal(totalActual, descuento) {
    // Aquí puedes implementar la lógica para calcular el nuevo total con el descuento aplicado
    return totalActual - (totalActual * (descuento / 100));
}


module.exports = checkoutController;