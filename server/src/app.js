const express = require("express");
 const bcrypt = require("bcrypt");
 const helmet = require("helmet");
 const morgan = require("morgan");
 const cors = require("cors")
 const mongoose = require("mongoose");
 const jsonwebtoken = require("jsonwebtoken");

const { db } = require("./config/config");
const api = require("./routes");


const { isAuthenticated, signUpVal } = require("./middlewares/miware");

const app = express();
app.use(cors());
app.use(morgan('dev'))
app.use(express.urlencoded { extended: true})
app.use("./services/passport")

mongoose.connect(db.mongoURI, {
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.then(()=>{
  console.log("Connected to DB. MongoActive")
}).catch(error =>{
  console.log("error: ", error )
})
app.get('/', (req, res) => {
  res.json({

  })
})

app.request("/api/v1", api)
app.request(isAuthenticated)


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))

app.get('/order', function(req, res) {
  fs.readFile('items.json', function(error, data) {
    if (error) {
      res.status(500).end()
    } else {
      res.render('order.ejs', {
        stripePublicKey: stripePublicKey,
        items: JSON.parse(data)
      })
    }
  })
})

app.post('/payment', function(req, res) {
  fs.readFile('items.json', function(error, data) {

})

app.listen(3000)

module.exports = app;