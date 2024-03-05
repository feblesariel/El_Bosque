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
        const quantity = req.body.amount;
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

            let cart = req.cookies.cart || {}; // Si la cookie del carrito existe, obtén su valor; de lo contrario, crea un objeto vacío

            if (!cart[productId]) { // Si el producto aún no está en el carrito, agrégalo
                cart[productId] = {
                    category: product.Category.name,
                    name: product.name,
                    selectedOptions: selectedOptions,
                    quantity: quantity,
                    price: product.price,
                    image: product.Product_image[0].url
                };
            } else { // Si el producto ya está en el carrito, actualiza su cantidad
                cart[productId].quantity += quantity;
            }  
            
            console.log(cart)
    
            // Establecer la cookie del carrito actualizada
            //res.cookie('cart', cart);


        })
        .catch(error => {
            console.error('Error:', error);
        });

    }

}

module.exports = cartController;