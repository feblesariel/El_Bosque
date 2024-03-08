// ************ Require's ************

const express = require ("express");
const router = express.Router();
const cookieMiddleware = require("../middlewares/cookieMiddleware");

// ************ Controller Require ************

const checkoutController = require ("../controllers/checkout")

// ************ Rutas ************

router.get("/", cookieMiddleware ,checkoutController.checkout);
router.post("/procces/", cookieMiddleware ,checkoutController.procces);


module.exports = router;