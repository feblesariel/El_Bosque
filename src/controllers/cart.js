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

const cartController = {

    add: function (req, res) {

        // Variables.
        let selectedOptions = "";
        let product = "";

        // Datos del formulario.
        const quantity = req.body.amount !== undefined ? req.body.amount : '1';
        const productId = req.body.product_id;
        if (req.body.option) {
            selectedOptions = Array.isArray(req.body.option) ? req.body.option.join(', ') : req.body.option;
        }

        // Obtengo el producto.
        const getProduct = Product.findOne({
            where: {                
                id: productId
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

        Promise.all([getProduct])
        .then(([result]) => {

            product = result;

            let cart = req.cookies.cart || { total: 0 }; // Si la cookie del carrito existe, obtén su valor; de lo contrario, crea un objeto con un total inicial de 0.

            if (!cart.item) { // Si la cookie aún no tiene la propiedad 'item', inicialízala como un array vacío.
                cart.item = [];
            }
            
            let cartLength = cart.item.length; // Obtén la longitud del array de items para confeccionar el identificador único de item.
            
            // Genera un identificador único para el producto en el carrito.
            const itemCode = generateCartProductId(cartLength, productId);
            
            if (!cart.item.find(item => item.itemCode === itemCode)) { // Verifica si el producto aún no está en el carrito.
                const subtotal = product.price * quantity; // Calcula el subtotal del nuevo ítem.
                cart.total += subtotal; // Incrementa el total del carrito con el subtotal del nuevo ítem.
            
                cart.item.push({
                    itemCode: itemCode,
                    product_id: productId,
                    category: product.Category.name,
                    name: product.name,
                    selectedOptions: selectedOptions,
                    quantity: quantity,
                    price: product.price,
                    image: product.Product_image[0].url,
                    subtotal: subtotal // Agrega el subtotal al nuevo ítem.
                });
            }                 

            // Define las opciones para la cookie.
            const options = {
                maxAge: 6 * 60 * 60 * 1000, // Duración de la cookie en milisegundos (6 horas).
                httpOnly: true, // La cookie solo será accesible a través del protocolo HTTP (no a través de JavaScript en el navegador).
                secure: true, // La cookie solo se enviará a través de HTTPS (para conexiones seguras).
                sameSite: 'strict' // Restringe el envío de cookies en las solicitudes cross-origin.
            };

            // Define la cookie y envíala en la respuesta.
            res.cookie('cart', cart, options);

            res.redirect('/products/shop/?openCart=true');

        })
        .catch(error => {
            console.error('Error:', error);
        });

    },

    remove: function (req, res) {

        // Obtengo key del item.
        const itemId = req.params.id;
    
        if (req.cookies && req.cookies.cart) {

            // Obtén el carrito como un objeto JavaScript directamente
            let cart = req.cookies.cart;
    
            // Verifica si el elemento existe en el carrito
            if (cart.hasOwnProperty(itemId)) {

                // Elimina el elemento del carrito
                delete cart[itemId];

                // Verifica si hay elementos restantes en el carrito
                if (Object.keys(cart).length > 0) {

                    // Eliminar la cookie existente antes de redefinirla
                    res.clearCookie('cart');

                    // Define las opciones para la cookie.
                    const options = {
                        maxAge: 6 * 60 * 60 * 1000, // Duración de la cookie en milisegundos (6 horas).
                        httpOnly: true, // La cookie solo será accesible a través del protocolo HTTP (no a través de JavaScript en el navegador).
                        secure: true, // La cookie solo se enviará a través de HTTPS (para conexiones seguras).
                        sameSite: 'strict' // Restringe el envío de cookies en las solicitudes cross-origin.
                    };

                    // Define la cookie y envíala en la respuesta.
                    res.cookie('cart', cart, options);

                } else {

                    // Si no quedan elementos en el carrito, elimina la cookie
                    res.clearCookie('cart');
                    
                }
    
                // Redirige a la página de origen.
                res.redirect("/products/shop/");

            } else {

                //No se encontro el item en la cookie.
                res.redirect("/");
            }

        } else {

            //No se encontro la cookie.
            res.redirect("/");
        }
    }

}

// Función para generar un identificador único para el producto en el carrito.
function generateCartProductId(cartLength, productId) {
    return cartLength + productId;
}

module.exports = cartController;