const bcrypt = require("bcryptjs");
const utilities = require("../utilities");
const accountModel = require("../models/account-models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ******************************
 *  Deliver login view
 * ***************************** */
async function buildLogin(req, res, next) {
    try {
        console.log("buildLogin function called");
        let nav = await utilities.getNav();
        res.render("account/login", {
            title: "Login",
            nav,
            messages: req.flash()
        });
    } catch (error) {
        console.error("Error in buildLogin:", error); 
        next(error);
    }
}

/* ******************************
 *  Deliver registration view
 * ***************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    });
}



/* ******************************
 *  Process registration
 * ***************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Hash the password before storing
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.');
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        });
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    );

    if (regResult) {
        req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        });
    } else {
        req.flash("notice", "Sorry, the registration failed.");
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        });
    }
}

/* ******************************
 *  Process login request
 * ***************************** */
async function accountLogin(req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.");
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        });
        return;
    }

    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password;
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
            
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
            }
            
            req.flash("notice", "You have successfully logged in.");
            return res.redirect("/account/");
        } else {
            req.flash("notice", "Please check your credentials and try again.");
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            });
        }
    } catch (error) {
        console.error("Error in accountLogin:", error);
        next(error);
    }
}

/* ******************************
 *  Deliver account management view
 * ***************************** */
async function buildAccountManagement(req, res, next) {
    try {
        console.log("buildAccountManagement function called");
        let nav = await utilities.getNav();
        res.render("account/management", {
            title: "Account Management",
            nav,
            messages: req.flash(),
            errors: null
        });
    } catch (error) {
        console.error("Error in buildAccountManagement:", error);
        next(error);
    }
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement };