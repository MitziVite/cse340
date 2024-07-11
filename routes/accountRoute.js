const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');
const invController = require('../controllers/invController')

// Routes for login and registration page views
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));




// Route to build the edit inventory view
router.get("/edit/:inv_id", invController.buildEditInventoryView);

// Route to handle inventory update
router.post("/update", invController.updateInventory);


// Process registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;
