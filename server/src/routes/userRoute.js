const routeHandler = require("express").Router();

const userCntrl = require("../controllers/userController")

const { reqSignin, isAuth, isAdmin } = require('../controllers/auth');

require('dotenv').config();

const {isAuthenticated, signUpVal} = require("../middlewares/miware.js")

routeHandler.get('/', (req, res)=>{
  req.send({
    message: "Welcome User"
    //res.render, res.sendFile
  })
})

routeHandler.post('/signup', signUpVal, userCntrl.signup)

routeHandler.post('/login', userCntrl.login)

//HomeView - router.get(/homeView, mw, renderedview)
routeHandler.post("/homeView", isAuthenticated, userCntrl.findByID)

//Profile +(Auth: R U, delete the non-required)


//Inventory-Catalogue

module.exports = routeHandler