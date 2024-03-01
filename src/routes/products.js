// ************ Require's ************

const express = require ("express");
const router = express.Router();

// ************ Controller Require ************

const productsController = require ("../controllers/products")

// ************ Rutas ************

router.get("/detail/:id/", productsController.detail);


module.exports = router;