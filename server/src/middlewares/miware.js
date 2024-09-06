const passport =   require("passport");
const Joi = require("joi");

module.exports = {
signUpVal: (req, res, next)=>{
  const schemaVal = Joi.object({
    username: Joi.string().alphanum().min(4).max(20).required(),

    /* new RegExp("^(?=.*[az])(?=.*[AZ])(?=.*[09])(?=.*[!@#\$%\^&\*])(?=.{9,20})") */
    password: Joi.string().regex(
      new RegExp("^(?=.*[a-zA-Z]+$)(?=.*[0-9])(?=.*^[^a-zA-Z0-9\s]+$)(?=.{9,20})")

    ),

    email: Joi.string().email()
  })(req, res, next)
  const { error } = schemaVal.validate(req.body);

  if (error){
    switch (error.details[0].context.key) {
      case 'username':
        res.status(400).send({error: "Username should contain 4-20 characters"})
        break;

      case 'password':
        res.status(400).send({error: "Password should contain an upper case, a lower case, numbers (0-9) and special characters @#$%&*"})
        break;

      case 'email':
        res.status(400).send({error: "Invalid email"})
        break;

      default:
          res.status(400).send({error: "Invalid details"})
        break;
      }
    } else{
      next();
    }
},

isAuthenticated: (req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if(err || !user){
      //for no user
      res.status(403).send({
        error: "Access not granted. No user information"
      })
    } else {
      req.user = user
    }
  })(req, res, next)
},

}