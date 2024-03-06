// ************ Require's ************

const express = require ("express");
const router = express.Router();

// ************ Controller Require ************

const cartController = require ("../controllers/cart")

// ************ Rutas ************

router.post("/add/", cartController.add);
router.get("/remove/:id/", cartController.remove);


module.exports = router;