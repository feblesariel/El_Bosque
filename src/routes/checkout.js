// ************ Require's ************

const express = require ("express");
const router = express.Router();
const cartCookieMiddleware = require("../middlewares/cart-cookie");
const resumeCookieMiddleware = require("../middlewares/resume-cookie");

// ************ Controller Require ************

const checkoutController = require ("../controllers/checkout")

// ************ Rutas ************

router.get("/", cartCookieMiddleware , checkoutController.checkout);
router.post("/procces/" , checkoutController.procces);
router.post("/discount/" , checkoutController.discount);
router.get("/resume/" , resumeCookieMiddleware, checkoutController.resume);


module.exports = router;