// ************ Require's ************

const express = require ("express");
const router = express.Router();

// ************ Controller Require ************

const queriesController = require ("../controllers/queries")

// ************ Rutas ************

router.get("/contact/", queriesController.contact);
router.get("/tracking/", queriesController.tracking);


module.exports = router;