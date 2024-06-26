const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Routes for inventory management
router.get('/', utilities.handleErrors(invController.buildManagement));
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification));
router.post('/add-classification', utilities.handleErrors(invController.addClassification));
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory));
router.post('/add-inventory', utilities.handleErrors(invController.addInventory));

// Routes to build inventory views
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:typeId", utilities.handleErrors(invController.buildbyTypeId));

module.exports = router;
