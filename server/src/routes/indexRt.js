const express = require("express");
const user = require("./userRoute.js");

const routeHandler = express.Router();

routeHandler.use("/user", user)
// route in app will match /api/v1/user
//appears with /user path

module.exports = routeHandler
