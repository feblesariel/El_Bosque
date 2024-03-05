// ************ Require's ************

const express = require ("express");
const router = express.Router();

// ************ Controller Require ************

const cartController = require ("../controllers/cart")

// ************ Rutas ************

router.post("/add/:id/", cartController.add);


module.exports = router;