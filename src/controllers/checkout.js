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
const Subscriber = db.Subscriber;

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
                const discountId = discount.id;
                const newTotal = calcularNuevoTotal(req.cookies.cart.total, discountPercentage);

                // Obtén el carrito como un objeto JavaScript directamente.
                let cart = req.cookies.cart;

                if (!cart.discount) { // Si la cookie aún no tiene la propiedad 'discount', inicialízala como un array vacío.
                    cart.discount = {id: discountId};
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

        // Obtener la cookie
        const cart = req.cookies.cart;
        // Obtener los datos del formulario del cuerpo de la solicitud
        const { orderType, payMethod, email, name, tel, note, newsletter, postcode, city, address, date } = req.body;
        // Obtener fecha en milisegundos para generar el codigo unico
        const milliseconds = Date.now();
    
        // Validar si el usuario desea suscribirse al boletín
        if (newsletter && email) {
            // Crear o encontrar al suscriptor
            Subscriber.findOrCreate({
                where: { email: email },
                defaults: { email: email }
            })
            .then(() => {
                // Continuar con el procesamiento de la orden después de manejar la suscripción
                continueOrderProcessing();
            })
            .catch(error => {
                console.error('Error al agregar el suscriptor:', error);
                res.status(500).send('Error al crear el suscriptor');
            });
        } else {
            // Continuar con el procesamiento de la orden sin suscripción
            continueOrderProcessing();
        }
    
        // Función para continuar con el procesamiento de la orden
        function continueOrderProcessing() {
            // Determinar el tipo de pedido y el método de pago
            switch (orderType) {
                // Caso: recolección en persona
                case "pickup":
    
                    if (payMethod === "transfer") {
                        // Procesamiento para recolección y transferencia
                        processOrder();
                    } else {
                        // Procesamiento para recolección y otro método de pago
                        // Aquí puedes agregar lógica adicional según el método de pago
                        // Por ejemplo, redirigir al usuario a una página de pago
                    }
                    break;
    
                // Caso: entrega a domicilio
                case "delivery":
                    if (payMethod === "transfer") {
                        // Procesamiento para entrega y transferencia
                        processOrder();
                    } else {
                        // Procesamiento para entrega y otro método de pago
                    }
                    break;
                // Caso: tipo de pedido desconocido
                default:
                    // Manejar un tipo de pedido desconocido
                    res.status(400).send('Tipo de pedido desconocido');
            }
        }
    
        // Función para procesar la orden
        function processOrder() {
            // Crear la orden
            Order.create({
                discount_id: cart.discount ? cart.discount.id : null,
                code: milliseconds,
                amount: cart.total,
                method: orderType,
                status: "procesando"
            }).then((newOrder) => {
                // Crear elementos de pedido y actualizar el contador de productos vendidos
                Promise.all(cart.item.map(item => {
                    return Order_item.create({
                        order_id: newOrder.id,
                        product_id: item.product_id,
                        product_options: item.selectedOptions,
                        quantity: item.quantity,
                        subtotal_amount: parseFloat(item.price) * parseFloat(item.quantity)
                    }).then(() => {
                        // Incrementar el contador de productos vendidos
                        return Product.increment('sold_count', { by: item.quantity, where: { id: item.product_id } });
                    });
                })).then(() => {

                    let pickupDetails = {
                        order_id: newOrder.id,
                        name: name,
                        phone: tel,
                        email: email,
                        note: note
                    };

                    if (orderType === "pickup") {
                        // Crear detalles de recolección
                        return Order_detail_pickup.create(pickupDetails);

                    } else if (orderType === "delivery") {

                        // Crear detalles de delivery
                        let deliveryDetails = {
                            ...pickupDetails,
                            scheduled_date: date,
                            address: address,
                            city: city,
                            postal_code: postcode
                        };

                        return Order_detail_delivery.create(deliveryDetails);
                    }

                }).then(() => {
                    // Crear registro de pago
                    return Payment.create({
                        order_id: newOrder.id,
                        amount: cart.total,
                        status: "pendiente",
                        payment_method: payMethod
                    });
                }).then(() => {
                    // Eliminar la cookie y redirigir al usuario
                    res.clearCookie('cart');
                    res.redirect("/");

                }).catch((error) => {
                    console.error('Error en el procesamiento de la orden:', error);
                    res.status(500).send('Error en el procesamiento de la orden');
                });
            }).catch((error) => {
                console.error('Error al crear la orden:', error);
                res.status(500).send('Error al crear la orden');
            });
        }
    }    

};

// Esta función calcula el nuevo total con el descuento aplicado
function calcularNuevoTotal(totalActual, descuento) {
    // Aquí puedes implementar la lógica para calcular el nuevo total con el descuento aplicado
    return totalActual - (totalActual * (descuento / 100));
}


module.exports = checkoutController;