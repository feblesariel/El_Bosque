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
            const { code } = req.body;

            // Buscar el descuento en la base de datos por el código
            const discount = await Discount.findOne({
                where: {
                    code: code,
                    active: true // Asegúrate de que el descuento esté activo
                }
            });

            // Verificar si se encontró un descuento válido
            if (discount) {
                // Aquí puedes realizar el cálculo del descuento y actualizar la cookie del carrito
                // Por simplicidad, supongamos que el descuento es del 10%
                const discountPercentage = discount.discount_percentage;
                const newTotal = calcularNuevoTotal(req.cookies.cart.total, discountPercentage);

                // Aquí debes actualizar la cookie con el nuevo total y el estado del cupón

                // Enviar una respuesta al frontend indicando que el cupón se aplicó correctamente
                res.status(200).json({ success: true, message: 'Cupón aplicado correctamente' });
            } else {
                // Si no se encontró un descuento válido, enviar una respuesta indicando que el cupón es incorrecto
                res.status(400).json({ success: false, message: 'Cupón incorrecto' });
            }
        } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso
            console.error('Error al aplicar el cupón:', error);
            res.status(500).json({ success: false, message: 'Error al aplicar el cupón' });
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