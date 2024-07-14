const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Rutas para vistas administrativas
router.get('/add', utilities.checkJWTToken, utilities.checkAdminOrEmployee, invController.buildAddInventory);
router.get('/edit/:id', utilities.checkJWTToken, utilities.checkAdminOrEmployee, invController.buildEditInventoryView);

// Procesos para agregar/editar/eliminar ítems
router.post('/add', utilities.checkJWTToken, utilities.checkAdminOrEmployee, invController.addInventory);
router.post('/edit/:id', utilities.checkJWTToken, utilities.checkAdminOrEmployee, invController.updateInventory);
router.post('/delete/:id', utilities.checkJWTToken, utilities.checkAdminOrEmployee, invController.deleteInventory);


// Routes for inventory management
router.get('/', utilities.handleErrors(invController.buildManagement));
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get('/add-classification', utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildAddClassification), );
router.post('/add-classification', utilities.handleErrors(invController.addClassification));
router.get('/add-inventory', utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildAddInventory));
router.post('/add-inventory', utilities.handleErrors(invController.processNewInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/delete/:inv_id",utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildDeleteInventory))
router.post("/delete", utilities.handleErrors(invController.deleteInventory))
// Routes to build inventory views
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:typeId", utilities.handleErrors(invController.buildbyTypeId));

// Route to handle inventory update
router.post("/update", invController.updateInventory);

module.exports = router;
