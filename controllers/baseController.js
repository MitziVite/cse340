const utilities = require("../utilities/")
const baseController = {}




baseController.buildHome = async function(req, res){
  
  const nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}


// baseController.showRegister = function(req, res) {
//   res.render("register/register", { title: "Register", messages: req.flash() });
// };

module.exports = baseController