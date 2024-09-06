const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
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
      maxlength: 800,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 9,
      default: $,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true,
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    pic: {
      data: Buffer,
      contentType: String,
    },
    destination: {
      required: false,
      type: Boolean,
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
