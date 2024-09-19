const app = require("./app");
const express = require('express');
const bodyParser = require('body-parser');
const braintree = require('braintree');
const path = require("path");
const app = express();
app.use(express.static(__dirname + "/public"))

const cors = require("cors");
app.set("views", path.join(__dirname, views))
app.set("view-engine", ejs);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

const mongoose = require('mongoose');

mongoose.connect( DB.connection, { useNewUrlParser: true})
.then(connection => {console.log("Connected to Database")}).catch(error => {
  console.log({
    error :{
      name: error.name, message: error.message,
      errorCode: error.code, codeName: error.codeName
    }
  })
})

const gateway = new braintree.BraintreeGateway({
  environment: ,
  merchantId: ,
  publicKey: ,
  privateKey: ,
});

app.get("/pay", (req, res)=>{
  res.render("paymentIndex");
});

//create a client end token to initialize client-side SDK
app.get('/client_token', (req, res)=>{
  gateway.clientToken.generate({}, (error, response)=> {
    if (err) {
      res.status(500).send(error);
    } else {
      res.send(response.clientToken);
      //c.log(response.clientToken);
      res.json({ clientToken: response.clientToken});
    }
  });
});

// Handle payment processing
app.post('/checkout', (req, res)=>{
  const nonceFromClient = req.body.payment_method_nonce;

  // Create transaction, obtain nonce from the client side
  const saleReq = {
    amount: "25.00",
    paid: "",
    date: "",
    paymentMethodNonce: nonceFromClient,
    options: {
      submitForSettlement: true
    }
  };

  gateway.transaction.sale(saleReq, (errr, result)=> {
    if (errr) {
      res.status(500).render('paymentError', {Error});
    } else if (result.success) {
      //console.log(response.clientToken); //res.send(response.clientToken); // res.json({ clientToken: response.clientToken});
     gateway.transaction.find(result.transition.id, (error, transaction) => {
      if (error){
        res.render("paymentError", {Error})
      } else {
        res.render("paymentSuccess", {transaction})
      }
     });

  } else {
    res.render("paymentError", {error: result.message});
    }
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log("Server connected on ${PORT}");
})

// app.post("/checkout/:nonce", (req, res)=>{
//   const nonceFromClient = req.params.nonce;
//   console.log(nonceFromClient)
//   const saleReq = {
//     amount: "25.00",
//     paid: "",
//     date: "",
//     paymentMethodNonce: nonceFromClient,
//     options: {
//       submitForSettlement: true
//     }
//   }
// });



// gateway.transaction.sale(saleReq, (error, result)=> {
//   if (err) {
//     let err = res.json({err: 'Failed payment processing'})
//     res.status(500).send(err);
//   } else if (result.success) {
//     //console.log(response.clientToken); //res.send(response.clientToken);
//     res.json({ clientToken: response.clientToken});
//   }else{
//     res.status(400).json({ err: result.message})
//   }
// });
