const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');


// Ruta para mostrar la vista de la cuenta
router.get('/account', utilities.checkLogin, accountController.buildAccount);

// Ruta para mostrar la vista de actualización de la cuenta
router.get('/update', utilities.checkLogin, accountController.buildUpdate);

// Ruta para procesar la actualización de la cuenta
router.post('/update', utilities.checkLogin, accountController.updateAccount);

// Ruta para procesar la actualización de la contraseña
router.post('/update-password', utilities.checkLogin, accountController.updatePassword); 



// Routes for login and registration page views
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));
router.get('/',
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
);


// Route to deliver the account update view
router.get('/updateAccount', utilities.checkLogin, utilities.handleErrors(accountController.updateAccount));
router.post('/updateAccount', utilities.checkLogin, accountController.updateAccount);
router.get('/update/:account_id', utilities.checkLogin, accountController.buildUpdate);
router.post('/updatePassword', utilities.checkLogin, accountController.updatePassword);
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

// Log out Route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/account');
        }
        res.clearCookie('connect.sid');
        res.clearCookie('jwt');
        res.redirect('/');
    });
});

module.exports = router;



