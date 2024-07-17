const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
};

invCont.buildbyTypeId = async function (req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
};

// Build inventory management view
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      classificationSelect,
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

/* ****************************************
*  Process Add classification
* *************************************** */
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

// Process Add Inventory
invCont.processNewInventory = async function (req, res, next) { 
  try {
    let nav = await utilities.getNav();
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    } = req.body;

    const addResult = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    );

    let classificationNav = await utilities.buildClassificationList();

    if (addResult) {
      req.flash(
        "notice",
        `Congratulations, you added the ${inv_make} ${inv_model}.`
      );
      res.status(201).render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationNav,
        messages: req.flash("notice"),
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, the new vehicle could not be added.");
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationNav,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Error processing new inventory:", error);
    req.flash("notice", "Error adding vehicle: " + error.message);
    res.redirect("/inv/add-inventory");
  }};


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  console.log({ params: req.params})
  const inv_id = parseInt(req.params.id)
  let nav = await utilities.getNav()
  const data = await invModel.getVehicleByDataId(inv_id)
  const itemData = data[0];
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
};


/* ***************************
 *  Deliver view to confirm delete
 * ************************** */
invCont.buildDeleteInventory = async function(req, res, next){
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav();
  const data = await invModel.getVehicleByDataId(inv_id)
  const itemData = data[0];
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render('./inventory/delete-confirm',{
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
};



/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  // let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body
  const updateResult = await invModel.deleteInventoryItem(inv_id)

  if (updateResult) {
    req.flash("notice", `The item was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("alert error", "Sorry, the vehicle was not deleted.")
    res.redirect("/inv/delete/" + inv_id)
  }
};


// Add inventory
invCont.addInventory = async function (req, res, next) {
  try {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
    const result = await inventoryModel.addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color);

    if (result) {
      req.flash('notice', `Successfully added the ${inv_make} ${inv_model}.`);
      res.redirect('/inv');
    } else {
      req.flash('notice', 'Failed to add inventory.');
      res.redirect('/inv/add');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
