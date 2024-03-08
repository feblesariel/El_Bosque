// ************ Require's ************

const express = require ("express");
const router = express.Router();

// ************ Controller Require ************

const checkoutController = require ("../controllers/checkout")

// ************ Rutas ************

router.get("/", checkoutController.checkout);


module.exports = router;