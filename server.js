const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)

app.use(async (req, res, next) => {
  next({status: 404, message: ''})
})

// Express Error Handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?'
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

// Local Server Information
const port = process.env.PORT
const host = process.env.HOST

// Log statement to confirm server operation
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
