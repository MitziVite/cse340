const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Rutas para la visualización de las páginas de login y registro
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Ruta para procesar el registro
router.post('/register', utilities.handleErrors(accountController.registerAccount));

module.exports = router;
