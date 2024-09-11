const { User } = require("../models/UserM")
const { Order } = require('../models/order');
const jwt = require("jsonwebtoken")
const config = require("../config/config")
const { signUpVal } = require("../middlewares/miware")
const bcrypt = require("bcrypt")

function jwtSignUser(user){
      const TWO_HOURS = 7200
      return jwt.sign(user, config.JwtSecret, {

    expiresIn: FIVE_HOURS
  })
}


  module.exports = {
    findByID: (req, res, next, id) => {
      const { user } = req;
      if (!user){
        return res.status(400).send({ error: "User does not exist" })
      }
      req.profile = user;
      next();
      return res.json(user)
    },


  async signup(req, res){
    try {
      await signUpVal(req, res, async () => {
        //call signupval mw
      const user = await User.create(req.body)
      const userObject = user.toJSON();
      return res.send({ user: userObject, token: jwtSignUser(userObject) })
    })
    } catch (error){
      console.log(error)
      if (Object.keys(Object.keys(error.keyValue[2] === "email") )){
        return res.status(403).send({error: "This email exists. Please try another"})
      }
      return res.status(400).send({error: "Unknown Error"})
    }
  },


  async login(req, res) {
    try {
      const { username, password, email } = req.body;
      // return response + usr + token
      // const { _id, name, email, role } = user;
      const user = await User.findOne({ $or: [{ username }, {email}] });
      //const user = await User.findOne().or([{ username }, {email}]);

      if (user === null){
        return res.status(404).send({ error: "No Account found. User with this login does not exist."})
      }

      const isPasswordValid = await user.verifyPassword(password);

      if(!isPasswordValid){
        return res.status(401).send({ error: "the information provided does not match"})
      }

      //const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, expiresIn: "1d")
      //res.status(200).send({success: "Good U+2713 u\{2713}", message: "", user:{name: user.name, phone: user.phone, address: user.address}, token,});

      res.cookie('t', jwtSignUser, { expire: new Date() + 9999 });
      const userJson = user.toJSON();
      return res.send({
      user: userJson, token: jwtSignUser(userObject)
      })
    } catch (error) {
      return res.status(500).send({error: "Error"});
    }
  },

  addOrderToUser: (req, res, next) => {
    let history = [];

    req.body.order.products.forEach((product) => {
      history.push({
        _id: product._id, name: product.name, type: product.type,
        description: product.description, category: item.category, qty: item.count,
        trnsc_id: req.body.order.transaction_id, amount: req.body.order.amount,
      });
    });

    User.findOneAndUpdate(
      { _id: req.profile._id }, { $push: { history: history } }, { new: true },
      (error, data) => {
        if (error) {
          return res.status(400).json({
            error: 'Could not update user purchase history',
          });
        }
        next();
      }
    );
  },

  purchaseHistory: (req, res) => {
    Order.find({ user: req.profile._id })
      .populate('user', '_id name')
      .sort('-created')
      .exec((error, orders) => {
        if (error) {
          return res.status(400).json({
            error: "No Information Available"
          });
        }
        res.json(orders);
      });
  },
  update: (req, res) => {
    // req.body.role = 0; role always 0 default: User
      User.findOneAndUpdate(
        { _id: req.profile._id }, { $set: req.body }, { new: true },
        (error, user) => {
          if (error) {
            return res.status(400).json({
              error: 'No authorization',
            });
          }
          user.hashedPd = undefined;
          user.salt = undefined;
          res.json(user);
        }
      );
    },

}