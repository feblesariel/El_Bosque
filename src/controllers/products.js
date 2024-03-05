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

        const getProduct = Product.findOne({
            where: {                
                id: req.params.id
            },
            include: [
                {
                    association: 'Category'
                },
                {
                    association: 'Product_image'
                },
                {
                    association: 'Product_option'
                }
            ]
        });
        

        Promise.all([getCategories, getProduct])
        .then(([Categories, Product]) => {

            res.render('product-details', { Categories, Product })

        })
        .catch(error => {
            console.error('Error:', error);
        });

    },

    shop: function (req, res) {

        // Consulto las categorias.

        const getCategories = Category.findAll({
            order: [
                ['name', 'ASC']
            ]
        });

        // Consulto los productos con filtrado, ordenamiento y paginacion.

        const category = req.query.category;
        const order = req.query.order;
    
        // const page = req.query.page ? parseInt(req.query.page) : 1;
        // const perPage = 9; // Cantidad de productos por página.
        // const offset = (page - 1) * perPage;
        // const limit = perPage;
    
        let orderOption = [];
    
        if (order === 'name') {
          orderOption = [['name', 'ASC']];
        } else if (order === 'popular') {
          orderOption = [['sold_count', 'DESC']];
        } else if (order === 'lowPrice') {
          orderOption = [['price', 'ASC']];
        } else if (order === 'highPrice') {
          orderOption = [['price', 'DESC']];
        }
    
        const whereClause = {
          [Op.and]: []
        };

        if (category) {
            whereClause[Op.and].push({ category_id: category });
        }
    
        const getAllProducts = Product.findAll({
        where: {
        [Op.and]: whereClause[Op.and]
        },
        order: orderOption,
        //   limit,
        //   offset,
        include: [
        {
            association: 'Category'
        },
        {
            association: 'Product_image'
        }
        ]
        });
    
        // Consulto la cantidad de productos que hay con la actual configuracion de filtrado.
    
        const getTotalFilteredProductCount = Product.count({
          where: whereClause[Op.and]
        });


        Promise.all([getCategories, getAllProducts, getTotalFilteredProductCount])
        .then(([Categories, AllProducts, TotalFilteredProductCount]) => {

            res.render('shop', { Categories, AllProducts, TotalFilteredProductCount })

        })
        .catch(error => {
            console.error('Error:', error);
        });

    }



}


module.exports = productsController;