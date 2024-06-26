const invModel = require("../models/inventory-model.js");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = '<ul class="nav-list">';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li class="nav-item">';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles" class="nav-link">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display" class="grid-container">';
    data.forEach(vehicle => {
      grid += '<li class="grid-item">';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' details"><img src="' + vehicle.inv_image
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" class="grid-image additional-class" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2 class="grid-title">';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details" class="grid-link">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
      grid += '</h2>';
      grid += '<span class="grid-price">$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildVehicleGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<div class="vehicle-info">';
    data.forEach(vehicle => {
      grid += '<img src="' + vehicle.inv_image + '" alt="Image of '
        + vehicle.inv_make + ' ' + vehicle.inv_model + '" class="vehicle-image">';
      grid += '<h2 class="vehicle-title">' + vehicle.inv_make + ' ' + vehicle.inv_model + " Details" + '</h2>';
      grid += '<div class="details-info">';
      grid += '<p class="vehicle-price"><strong>Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</strong></p>';
      grid += '<p><strong>Description:</strong> ' + vehicle.inv_description + '</p>';
      grid += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>';

      // Verificar que el kilometraje es un número antes de formatearlo
      let mileage = parseInt(vehicle.inv_miles, 10);
      if (!isNaN(mileage)) {
        grid += '<p><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(mileage) + '</p>';
      } else {
        grid += '<p><strong>Mileage:</strong> ' + vehicle.inv_miles + '</p>';
      }

      grid += '</div>';
    });
    grid += '</div>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList = '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

module.exports = Util;
