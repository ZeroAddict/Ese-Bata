const mongoose =require("mongoose");
const bcrypt= require("bcrypt");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String, required: true, unique: true,
    lowercase: true, trim: true,
    index: { unique: true }
  },
  password: {
    type: String, required: true,
  },
  email: {
    type: String, required: true,
  },
},
{
  timestamps: true
})

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next()
    }
    const hashedPd = await bcrypt.hash(this.password, 10);
    return (this.password = hashedPd);
  } catch (error) {
    return next(error)
  }
})

UserSchema.pre('updateOne', async function(next){
  try {
    if (this._update.password){
      const hashedPd = await bcrypt.hash(this._update.password, 10);
      this._update.password = hashedPd;

      return next();
    }
    const hashedPd = await bcrypt.hash(this._update.password, 10);
    return (this.password = hashedPd)
  } catch (error) {
    return next(error)
  }
})
UserSchema.methods.verifyPassword = async function (plain_password){
  return bcrypt.compare(plain_password, this.password)
}
const User = mongoose.model("User", UserSchema);

module.exports = User