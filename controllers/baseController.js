const utilities = require("../utilities/")
const jwt = require('jsonwebtoken');
const baseController = {}




baseController.buildHome = async function(req, res){
  
  const nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}


baseController.showRegister = async function(req, res) {
  const nav = await utilities.getNav()
  res.render("register/register", { title: "Register", messages: req.flash(), nav });
};

module.exports = baseController