// ************ Require's ************

const express = require ("express");
const router = express.Router();

// ************ Controller Require ************

const contactController = require ("../controllers/contact")

// ************ Rutas ************

router.get("/", contactController.contact);


module.exports = router;