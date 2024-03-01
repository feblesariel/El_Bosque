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

const productsController = {

    detail: function (req, res) {

        const getCategories = Category.findAll({
            order: [
                ['name', 'ASC']
            ]
        });

        Promise.all([getCategories])
        .then(([Categories]) => {

            res.render('product-details', { Categories })

        })
        .catch(error => {
            console.error('Error:', error);
        });

    }
}

module.exports = productsController;