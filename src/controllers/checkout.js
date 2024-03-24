// ************ Requires ************

const nodemailer = require('nodemailer');
const ejs = require('ejs'); // Para renderizar el template email.
const fs = require('fs'); // Para traer el template email.
const mercadopago = require("mercadopago"); // Importo MP.

// ************ Config ************

// Mercado Pago.
mercadopago.configure({
	access_token: process.env.ACCESS_TOKEN
});

// Leer el archivo de la plantilla de correo electrónico.
const emailClientTemplate = fs.readFileSync('./src/views/templates/email-client.ejs', 'utf8');
const emailOwnerTemplate = fs.readFileSync('./src/views/templates/email-owner.ejs', 'utf8');

// Configura el transporte SMTP
let transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // Usa TLS
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

// ************ Database ************

const db = require('../database/models/index.js');
const sequelize = db.sequelize;
const { Op } = require("sequelize");

const Category = db.Category;
const Delivery = db.Delivery;
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

        const getDelivery = Delivery.findOne({
            where: {id: 1}
        });

        const cart = req.cookies.cart;

        Promise.all([getCategories, getDelivery])
            .then(([Categories, Delivery]) => {

                res.render('checkout', { Categories, Delivery, cart})

            })
            .catch(error => {
                console.error('Error:', error);
            });

    },

    method: async function (req, res) {

        try {

            const { orderType } = req.body;

            const delivery = await Delivery.findOne({
                where: {id: 1}
            });

            let cart = req.cookies.cart;

            let newTotal = 0;

            if (orderType === "delivery") {

                if (!cart.deliveryMethod) { // Si la cookie aún no tiene la propiedad 'deliveryMethod', inicialízalarla.

                    if (cart.discount) {

                        // Calcular el total sin el descuento
                        let totalWithoutDiscount = parseFloat(cart.total) / (1 - parseFloat(cart.discount.percentage) / 100);

                        // Sumarle el costo del envío al total sin el descuento
                        newTotal = totalWithoutDiscount + parseFloat(delivery.price);

                        // Aplicar el descuento nuevamente al nuevo total, teniendo en cuenta el costo del envío
                        newTotal = newTotal * (1 - parseFloat(cart.discount.percentage) / 100);

                    } else {

                        newTotal = parseFloat(cart.total) + parseFloat(delivery.price);

                    }            

                    cart.deliveryMethod = orderType;

                    cart.total = parseFloat(newTotal).toFixed(2);

                    // Eliminar la cookie existente antes de redefinirla.
                    res.clearCookie('cart');

                    // Define las opciones para la cookie.
                    const options = {
                        maxAge: 12 * 60 * 60 * 1000, // Duración de la cookie en milisegundos (12 horas).
                    };

                    // Define la cookie.
                    res.cookie('cart', cart, options);

                    // Envio el nuevo valor del total y el delivery a la llamada.
                    res.status(200).json({ success: true, message: 'correct change.', newTotal: cart.total});

                } else {

                    if (cart.discount) {

                        // Calcular el total sin el descuento
                        let totalWithoutDiscount = parseFloat(cart.total) / (1 - parseFloat(cart.discount.percentage) / 100);

                        // Sumarle el costo del envío al total sin el descuento
                        newTotal = totalWithoutDiscount + parseFloat(delivery.price);

                        // Aplicar el descuento nuevamente al nuevo total, teniendo en cuenta el costo del envío
                        newTotal = newTotal * (1 - parseFloat(cart.discount.percentage) / 100);

                    } else {

                        newTotal = parseFloat(cart.total) + parseFloat(delivery.price);

                    }

                    cart.deliveryMethod = orderType;

                    cart.total = (newTotal).toFixed(2);

                    // Eliminar la cookie existente antes de redefinirla.
                    res.clearCookie('cart');

                    // Define las opciones para la cookie.
                    const options = {
                        maxAge: 12 * 60 * 60 * 1000, // Duración de la cookie en milisegundos (12 horas).
                    };

                    // Define la cookie.
                    res.cookie('cart', cart, options);   
                    
                    // Envio el nuevo valor del total y el delivery a la llamada.
                    res.status(200).json({ success: true, message: 'incorrect change.', newTotal: cart.total});

                }


            } else if (orderType === "pickup") {                

                if (cart.deliveryMethod) { // Si la cookie aún no tiene la propiedad 'deliveryMethod', inicialízalarla.

                    if (cart.discount) {

                        // Calcular el total sin el descuento
                        let totalWithoutDiscount = parseFloat(cart.total) / (1 - parseFloat(cart.discount.percentage) / 100);

                        // Sumarle el costo del envío al total sin el descuento
                        newTotal = totalWithoutDiscount - parseFloat(delivery.price);

                        // Aplicar el descuento nuevamente al nuevo total, teniendo en cuenta el costo del envío
                        newTotal = newTotal * (1 - parseFloat(cart.discount.percentage) / 100);

                    } else {

                        newTotal = parseFloat(cart.total) - parseFloat(delivery.price);

                    }

                    cart.deliveryMethod = orderType;

                    cart.total = (newTotal).toFixed(2);

                    // Eliminar la cookie existente antes de redefinirla.
                    res.clearCookie('cart');

                    // Define las opciones para la cookie.
                    const options = {
                        maxAge: 12 * 60 * 60 * 1000, // Duración de la cookie en milisegundos (12 horas).
                    };

                    // Define la cookie.
                    res.cookie('cart', cart, options);   
                    
                    // Envio el nuevo valor del total y el delivery a la llamada.
                    res.status(200).json({ success: true, message: 'correct change.', newTotal: cart.total });

                } else {

                    res.status(200).json({ success: true, message: 'incorrect change.', newTotal: cart.total });

                }

            }

        } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso.
            res.status(500).json({ success: false, message: 'internal server error.' });
        }
    },

    discount: async function (req, res) {

        try {

            // Obtén el carrito como un objeto JavaScript directamente.
            let cart = req.cookies.cart;

            if (!cart.discount) {            
            
                // Obtener el código del cupón del cuerpo de la solicitud.
                const { coupon } = req.body;

                // Buscar el descuento en la base de datos por el código.
                const discount = await Discount.findOne({
                    where: {
                        code: coupon,
                        active: true // Asegúrate de que el descuento esté activo.
                    }
                });

                // Verificar si se encontró un descuento válido.
                if (discount) {
                    // Aquí puedes realizar el cálculo del descuento y actualizar la cookie del carrito.
                    const discountPercentage = discount.discount_percentage;
                    const discountId = discount.id;
                    const newTotal = calcularNuevoTotal(req.cookies.cart.total, discountPercentage);

                    cart.discount = {id: discountId, percentage: discountPercentage};

                    // Nuevo total.
                    cart.total = parseFloat(newTotal).toFixed(2);                

                    // Desactivar el descuento utilizado.
                    await Discount.update({ active: false }, { where: { code: coupon } });

                    // Eliminar la cookie existente antes de redefinirla.
                    res.clearCookie('cart');

                    // Define las opciones para la cookie.
                    const options = {
                        maxAge: 12 * 60 * 60 * 1000, // Duración de la cookie en milisegundos (12 horas).
                    };

                    // Define la cookie.
                    res.cookie('cart', cart, options);

                    // Envio el nuevo valor del total a la llamada.
                    res.status(200).json({ success: true, message: '¡Cupón aplicado!', newTotal: cart.total, discount: discount });

                } else {
                    // Si no se encontró un descuento válido, enviar una respuesta indicandolo.
                    res.status(200).json({ success: false, message: 'No existe el cupón.' });

                }

            } else {
                // Si ya hay un cupon aplicado, enviar un mensaje indicandolo.
                res.status(200).json({ success: false, message: 'Ya tienes un cupón aplicado.' });

            }


        } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso.
            res.status(500).json({ success: false, message: 'internal server error.' });
        }
    },

    procces: function (req, res) {

        // Si no existe la cookie cart se envia al home.
        if (!req.cookies.cart) {
            res.redirect("/");
        };
        // Obtener la cookie.
        const cart = req.cookies.cart;
        // Obtener los datos del formulario del cuerpo de la solicitud.
        const {orderType, payMethod, name, tel, email, note, postcode, city, address, newsletter} = req.body;
        // Obtener fecha en milisegundos para generar el codigo unico.
        const milliseconds = Date.now();
        // Creo variable para almacenar datos para enviar al front.
        let summary = req.cookies.summary || { total: cart.total, orderType: orderType, payMethod: payMethod, order: {}, items: cart.item, client: { name: name, tel: tel, email: email, note: note, postcode: postcode, city: city, address: address}};

        // Crea discount en summary si cart.discount existe.
        if (cart.discount) {
            summary.discount = cart.discount;
        }

        // Si el metodo de envio es delivery ingreso los datos del envio en la cookie summary.
        if (cart.deliveryMethod && cart.deliveryMethod === "delivery") {

            obtenerDelivery();

            async function obtenerDelivery() {
                try {
                    summary.delivery = await Delivery.findOne({
                        where: { id: 1 }
                    });
                } catch (error) {
                    console.error('Error al obtener los datos de entrega:', error);
                }
            }

        }

        // Validar si el usuario desea suscribirse al boletín.
        if (newsletter && email) {
            // Crear o encontrar al suscriptor.
            Subscriber.findOrCreate({
                where: { email: email },
                defaults: { email: email }
            })
            .then(() => {
                // Continuar con el procesamiento de la orden después de manejar la suscripción.
                continueOrderProcessing();
            })
            .catch(error => {
                console.error('Error al agregar el suscriptor:', error);
                res.status(500).send('Error al crear el suscriptor');
            });
        } else {
            // Continuar con el procesamiento de la orden sin suscripción.
            continueOrderProcessing();
        }
    
        // Función para continuar con el procesamiento de la orden.
        function continueOrderProcessing() {
            // Determinar el tipo de pedido y el método de pago.
            switch (orderType) {
                // Caso: recolección en persona.
                case "pickup":    
                    if (payMethod === "transfer") {
                        // Procesamiento para retiro y transferencia.
                        processOrder();
                    } else if (payMethod === "mercado_pago") {
                        // Procesamiento para retiro y mercado pago.
                        processOrderMp();
                    }
                    break;    
                // Caso: entrega a domicilio.
                case "delivery":
                    if (payMethod === "transfer") {
                        // Procesamiento para delivery y transferencia.
                        processOrder();
                    } else if (payMethod === "mercado_pago") {
                        // Procesamiento para retiro y mercado pago.
                        processOrderMp();
                    }
                    break;
                // Caso: tipo de pedido desconocido.
                default:
                    // Manejar un tipo de pedido desconocido.
                    res.status(400).send('Tipo de pedido desconocido');
            }
        }

        // Función para procesar la orden.
        function processOrderMp() {

            // Define las opciones para la cookie.
            const options = {
                maxAge: 1 * 60 * 60 * 1000, // Duración de la cookie en milisegundos (1 hora).
            };
            // Define la cookie.
            res.cookie('summary', summary, options);

            let preference = {
                items: [
                    {
                        title: "El Bosque Energetico",
                        unit_price: parseFloat(cart.total),
                        quantity: 1,
                    }
                ],
                back_urls: {
                    "success": "http://localhost:3000/checkout/feedback/",
                    "failure": "http://localhost:3000/checkout/",
                    "pending": "http://localhost:3000/checkout/"
                },
                auto_return: "approved",
            };
        
            mercadopago.preferences.create(preference)
                .then(function (response) {
                    res.redirect(response.body.init_point);
                }).catch(function (error) {
                    console.log(error);
                });

        };
    
        // Función para procesar la orden.
        function processOrder() {
            // Crear la orden.
            Order.create({
                discount_id: cart.discount ? cart.discount.id : null,
                code: milliseconds,
                amount: cart.total,
                method: orderType,
                status: "procesando"
            }).then((newOrder) => {
                // Guardo valor de la orden para enviar al front.
                summary.order = newOrder;
                // Crear elementos de pedido y actualizar el contador de productos vendidos.
                Promise.all(cart.item.map(item => {
                    return Order_item.create({
                        order_id: newOrder.id,
                        product_id: item.product_id,
                        product_options: item.selectedOptions,
                        quantity: item.quantity,
                        subtotal_amount: parseFloat(item.price) * parseFloat(item.quantity)                        
                    }).then(() => {
                        // Incrementar el contador de productos vendidos.
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
                        // Crear detalles de retiro.
                        return Order_detail_pickup.create(pickupDetails);
                    } else if (orderType === "delivery") {
                        // Crear detalles de delivery.
                        let deliveryDetails = {
                            ...pickupDetails,
                            address: address,
                            city: city,
                            postal_code: postcode,
                            delivery_id: summary.delivery.id
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
                    // Eliminar la cookie y redirigir al usuario.
                    res.clearCookie('cart');
                    // Define las opciones para la cookie.
                    const options = {
                        maxAge: 1 * 60 * 60 * 1000, // Duración de la cookie en milisegundos (1 hora).
                    };
                    // Define la cookie.
                    res.cookie('summary', summary, options);
                    // Renderiza el template email y envia los datos.
                    const renderClientTemplate = ejs.render(emailClientTemplate, {summary});
                    // Define las opciones del correo electrónico para el cliente.                    
                    let clientMailOptions = {
                        from: process.env.SMTP_EMAIL, // Dirección de correo electrónico del remitente. // CAMBIAR EL FROM POR EL DEL SERVIDOR.
                        to: email, // Dirección de correo electrónico del destinatario (cliente).
                        subject: 'El Bosque Energetico - Recibimos tu pedido.', // Asunto del correo electrónico.
                        html: renderClientTemplate // Contenido del correo electrónico en texto plano.
                    };
                    // Envía el correo electrónico al cliente
                    transporter.sendMail(clientMailOptions, (error, info) => {
                        if (error) {
                            console.log('Error al enviar el correo electrónico al cliente:', error);
                        } else {
                            console.log('Correo electrónico enviado al cliente:', info.response);
                        }
                    });
                    // Renderiza el template email y envia los datos.
                    const renderOwnerTemplate = ejs.render(emailOwnerTemplate, {summary});
                    // Define las opciones del correo electrónico para el propietario.
                    let ownerMailOptions = {
                        from: process.env.SMTP_EMAIL, // Dirección de correo electrónico del remitente.
                        to: email, // Dirección de correo electrónico del propietario.
                        subject: 'El Bosque Energetico - Ingreso un pedido.', // Asunto del correo electrónico.
                        html: renderOwnerTemplate// Contenido del correo electrónico en texto plano.
                    };
                    // Envía el correo electrónico al propietario
                    transporter.sendMail(ownerMailOptions, (error, info) => {
                        if (error) {
                            console.log('Error al enviar el correo electrónico al propietario:', error);
                        } else {
                            console.log('Correo electrónico enviado al propietario:', info.response);
                        }
                    });                    
                    res.redirect("/checkout/summary/");
                }).catch((error) => {
                    console.error('Error en el procesamiento de la orden:', error);
                    res.status(500).send('Error en el procesamiento de la orden');
                });
            }).catch((error) => {
                console.error('Error al crear la orden:', error);
                res.status(500).send('Error al crear la orden');
            });
        };
    },

    feedback: function (req, res) {

        // Obtén el summary como un objeto JavaScript directamente.
        const summary = req.cookies.summary;
        // Obtener los datos que vienen de mp.
        const {payment_id, status} = req.query;
        // Obtener fecha en milisegundos para generar el codigo unico.
        const milliseconds = Date.now();

        // Guardo los datos de mp en la cookie.
        summary.mp = {status: status, payment: payment_id}

        // Si la transaccion esta aprobada borro la cookie cart sino vuelvo al checkout.
        if (status === "approved") {
            res.clearCookie('cart');
        } else {
            res.clearCookie('summary');
            res.redirect("/checkout/");
        }

        // Crear la orden.
        Order.create({
            discount_id: summary.discount ? summary.discount.id : null,
            code: milliseconds,
            amount: summary.total,
            method: summary.orderType,
            status: "confirmado"
        }).then((newOrder) => {
            // Guardo valor de la orden para enviar al front.
            summary.order = newOrder;
            // Crear elementos de pedido y actualizar el contador de productos vendidos.
            Promise.all(summary.items.map(item => {
                return Order_item.create({
                    order_id: newOrder.id,
                    product_id: item.product_id,
                    product_options: item.selectedOptions,
                    quantity: item.quantity,
                    subtotal_amount: parseFloat(item.price) * parseFloat(item.quantity)                        
                }).then(() => {
                    // Incrementar el contador de productos vendidos.
                    return Product.increment('sold_count', { by: item.quantity, where: { id: item.product_id } });
                });
            })).then(() => {
                let pickupDetails = {
                    order_id: newOrder.id,
                    name: summary.client.name,
                    phone: summary.client.tel,
                    email: summary.client.email,
                    note: summary.client.note
                };
                if (summary.orderType === "pickup") {
                    // Crear detalles de retiro.
                    return Order_detail_pickup.create(pickupDetails);
                } else if (summary.orderType === "delivery") {
                    // Crear detalles de delivery.
                    let deliveryDetails = {
                        ...pickupDetails,
                        address: summary.client.address,
                        city: summary.client.city,
                        postal_code: summary.client.postcode,
                        delivery_id: summary.delivery.id
                    };
                    return Order_detail_delivery.create(deliveryDetails);
                }
            }).then(() => {
                // Crear registro de pago
                return Payment.create({
                    order_id: newOrder.id,
                    amount: summary.total,
                    status: "completado",
                    payment_method: summary.payMethod,
                    transaction_id: payment_id
                });
            }).then(() => {
                // Eliminar la cookie y redirigir al usuario.
                res.clearCookie('summary');
                // Define las opciones para la cookie.
                const options = {
                    maxAge: 1 * 60 * 60 * 1000, // Duración de la cookie en milisegundos (1 hora).
                };
                // Define la cookie.
                res.cookie('summary', summary, options);

                // Renderiza el template email y envia los datos.
                const renderClientTemplate = ejs.render(emailClientTemplate, {summary});
                // Define las opciones del correo electrónico para el cliente.                    
                let clientMailOptions = {
                    from: process.env.SMTP_EMAIL, // Dirección de correo electrónico del remitente. // CAMBIAR EL FROM POR EL DEL SERVIDOR.
                    to: summary.client.email, // Dirección de correo electrónico del destinatario (cliente).
                    subject: 'El Bosque Energetico - Confirmamos tu pedido.', // Asunto del correo electrónico.
                    html: renderClientTemplate // Contenido del correo electrónico en texto plano.
                };
                // Envía el correo electrónico al cliente.
                transporter.sendMail(clientMailOptions, (error, info) => {
                    if (error) {
                        console.log('Error al enviar el correo electrónico al cliente:', error);
                    } else {
                        console.log('Correo electrónico enviado al cliente:', info.response);
                    }
                });
                // Renderiza el template email y envia los datos.
                const renderOwnerTemplate = ejs.render(emailOwnerTemplate, {summary});
                // Define las opciones del correo electrónico para el propietario.
                let ownerMailOptions = {
                    from: process.env.SMTP_EMAIL, // Dirección de correo electrónico del remitente.
                    to: summary.client.email, // Dirección de correo electrónico del propietario.
                    subject: 'El Bosque Energetico - Ingreso un pedido.', // Asunto del correo electrónico.
                    html: renderOwnerTemplate// Contenido del correo electrónico en texto plano.
                };
                // Envía el correo electrónico al propietario
                transporter.sendMail(ownerMailOptions, (error, info) => {
                    if (error) {
                        console.log('Error al enviar el correo electrónico al propietario:', error);
                    } else {
                        console.log('Correo electrónico enviado al propietario:', info.response);
                    }
                });
                
                res.redirect("/checkout/summary/");

            }).catch((error) => {
                console.error('Error en el procesamiento de la orden:', error);
                res.status(500).send('Error en el procesamiento de la orden');
            });
        }).catch((error) => {
            console.error('Error al crear la orden:', error);
            res.status(500).send('Error al crear la orden');
        });

    },

    summary: function (req, res) {

        // Obtén el summary como un objeto JavaScript directamente.
        const summary = req.cookies.summary;

        const getCategories = Category.findAll({
            order: [
                ['name', 'ASC']
            ]
        });

        const cart = req.cookies.cart;

        Promise.all([getCategories])
            .then(([Categories]) => {

                res.render('summary', { Categories, cart, summary})

            })
            .catch(error => {
                console.error('Error:', error);
            });

    }

};

// Esta función calcula el nuevo total con el descuento aplicado.
function calcularNuevoTotal(totalActual, descuento) {
    // Aquí puedes implementar la lógica para calcular el nuevo total con el descuento aplicado.
    return totalActual - (totalActual * (descuento / 100));
}


module.exports = checkoutController;