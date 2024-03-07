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
const Product_review = db.Product_review;
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

            let cart = req.cookies.cart || {}; // Si la cookie del carrito existe, obtén su valor; de lo contrario, crea un objeto vacío.
            let cartLength = Object.keys(cart).length; // Obtengo el largo del array para confeccionar el identificador unico de la cookie.

            // Genera un identificador único para el producto en el carrito
            const cartProductId = generateCartProductId(cartLength);

            if (!cart[cartProductId]) { // Si el producto aún no está en el carrito, agrégalo.
                cart[cartProductId] = {
                    product_id: productId,
                    category: product.Category.name,
                    name: product.name,
                    selectedOptions: selectedOptions,
                    quantity: quantity,
                    price: product.price,
                    image: product.Product_image[0].url
                };
            }

            // Define opciones para la cookie
            const options = {
                maxAge: 3600000 // Tiempo de vida de la cookie en milisegundos (en este caso, 10 minutos).
            };

            // Define la cookie.
            res.cookie('cart', cart , options );

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

                    // Define opciones para la cookie
                    const options = {
                        maxAge: 3600000 // Tiempo de vida de la cookie en milisegundos (en este caso, 10 minutos).
                    };

                    // Eliminar la cookie existente antes de redefinirla
                    res.clearCookie('cart');

                    // Define la cookie actualizada.
                    res.cookie('cart', cart , options );

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
function generateCartProductId(cartLength) {
    return cartLength;
}

module.exports = cartController;