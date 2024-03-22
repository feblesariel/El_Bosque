// ************ Require's ************

const express = require ("express");
const router = express.Router();
const cartCookieMiddleware = require("../middlewares/cart-cookie");
const summaryCookieMiddleware = require("../middlewares/summary-cookie");
const noMpRequestMiddleware = require("../middlewares/no-mp-request");

// ************ Controller Require ************

const checkoutController = require ("../controllers/checkout")

// ************ Rutas ************

router.get("/", cartCookieMiddleware , checkoutController.checkout);
router.post("/procces/" , checkoutController.procces);
router.post("/discount/" , checkoutController.discount);
router.post("/method/" , checkoutController.method);
router.get("/summary/" , summaryCookieMiddleware, checkoutController.summary);
router.get("/feedback/" , noMpRequestMiddleware, checkoutController.feedback);


module.exports = router;