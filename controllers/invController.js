const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildbyTypeId = async function (req, res, next) {
  const type_id = req.params.typeId;
  const data = await invModel.getVehicleByDataId(type_id);
  const grid = await utilities.buildVehicleGrid(data);
  let nav = await utilities.getNav();
  const vehicleInfo = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model;
  res.render("./inventory/info", {
    title: vehicleInfo,
    nav,
    grid
  });
};

// Build inventory management view
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
};

// Build add classification view
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
};

// Build add inventory view
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render('inventory/add-inventory', {
      title: 'Add New Inventory',
      nav,
      classificationList,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
};

// Add classification
invCont.addClassification = async function (req, res, next) {
  try {
    const { classificationName } = req.body;
    if (!classificationName) {
      req.flash('notice', 'Classification name is required.');
      return res.redirect('/inv/add-classification');
    }

    const result = await invModel.addClassification(classificationName);
    if (result) {
      req.flash('notice', `Classification '${classificationName}' added successfully.`);
      res.redirect('/inv');
    } else {
      req.flash('notice', 'Failed to add classification.');
      res.redirect('/inv/add-classification');
    }
  } catch (error) {
    next(error);
  }
};

// Add inventory
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles
    } = req.body;

    const result = await invModel.addInventory({
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles
    });

    if (result) {
      req.flash("notice", "New vehicle added successfully.");
      res.redirect("/inv");
    } else {
      req.flash("notice", "Failed to add vehicle.");
      res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
