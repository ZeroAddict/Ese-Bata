const express = require("express");
const user = require("./userRoute.js");

const routeHandler = express.Router();

routeHandler.use("/user", user)
// route matches /api/v1/user
//appears as path with /user

module.exports = routeHandler
