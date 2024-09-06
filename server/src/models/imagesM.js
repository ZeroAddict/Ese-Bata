const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const imageSchema = new mongoose.Schema(
  {
    _id:{
      ObjectId,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 24,
    },
    type: {
      type: String,
      trim: true,
      required: true,
      maxlength: 24,
    },
    desc: {
      type: String,
      required: true,
      maxlength: 80,
    },
    data: Buffer
  }
)

module.exports = mongoose.model('Image', imageSchemaSchema);