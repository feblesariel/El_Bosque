// ************ Require's ************

const express = require ("express");
const router = express.Router();
const cartCookieMiddleware = require("../middlewares/cart-cookie");

// ************ Controller Require ************

const cartController = require ("../controllers/cart")

// ************ Rutas ************

router.post("/add/", cartController.add);
router.get("/remove/:id/", cartCookieMiddleware, cartController.remove);


module.exports = router;