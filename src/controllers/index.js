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

const indexController = {

    index: function (req, res) {

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
            ],
            order: [
                ['sold_count', 'DESC']
            ]
        });

        const cart = req.cookies.cart;

        Promise.all([getCategories, getProducts])
            .then(([Categories, Products]) => {

                res.render('index', { Categories, Products, cart})

            })
            .catch(error => {
                console.error('Error:', error);
            });

    }
}

module.exports = indexController;