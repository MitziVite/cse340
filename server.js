const session = require("express-session");
const pool = require('./database/');
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require('path');
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities");
const errorHandler = require("./views/errors/errorHandler");
const accountController = require("./controllers/accountController");
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser")

// Middleware and Configurations
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');



// Session Middleware
app.use(session({
    store: new (require('connect-pg-simple')(session))({
        createTableIfMissing: true,
        pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Static Routes
app.use(static);

// Account Routes
app.use('/account', accountRoute);

// Index Route
app.get('/', utilities.handleErrors(baseController.buildHome));

// Inventory Routes
app.use('/inv', inventoryRoute);

// Error Simulation Route
app.get('/error/500', (req, res, next) => {
    const error = new Error('Intentional Server Error');
    error.status = 500;
    next(error);
});

// Middleware para manejar errores 404
app.use((req, res, next) => {
    console.log('404 error handler called for URL: ', req.originalUrl); // Log de depuración
    res.status(404).render('errors/404', { title: '404 - Page Not Found' });
});

// Middleware para manejar otros errores
app.use(async (err, req, res, next) => {
    let nav = await utilities.getNav();
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);
    const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
    res.status(err.status || 500).render('errors/error', {
        title: err.status || 'Server Error',
        message,
        nav
    });
});

// Custom Error Handler
app.use(errorHandler);

// Local Server Information
const port = process.env.PORT || 3000;
const host = process.env.HOST;

// Log statement to confirm server operation
app.listen(port, () => {
    console.log(`app listening on ${host}:${port}`);
});
