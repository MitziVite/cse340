const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");


// Routes for inventory management
router.get('/', utilities.handleErrors(invController.buildManagement));
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification));
router.post('/add-classification', utilities.handleErrors(invController.addClassification));
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory));
router.post('/add-inventory', utilities.handleErrors(invController.processNewInventory));
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/delete/:inv_id", utilities. handleErrors(invController.buildDeleteInventory))
router.post("/delete", utilities.handleErrors(invController.deleteInventory))
// Routes to build inventory views
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:typeId", utilities.handleErrors(invController.buildbyTypeId));

// Route to build the edit inventory view
router.get("/edit/:inv_id", invController.buildEditInventoryView);

// Route to handle inventory update
router.post("/update", invController.updateInventory);

module.exports = router;
