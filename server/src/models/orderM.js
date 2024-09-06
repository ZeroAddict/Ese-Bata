const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const CartSchema = new mongoose.Schema({
    item: { type: ObjectId, ref: 'item' },
    name: String,
    price: Number,
    quantity: Number,
  },
  {
    timestamps: true
  }
);

const CartItem = mongoose.model('CartItem', CartSchema);

const OrderSchema = new mongoose.Schema(
{
  items: [CartSchema],
  transaction_id: {},
  amount: { type: Number },
  address: String,
  status: {
    type: String,
    enum: [ 'In Process', 'Pending', 'In Transit', 'Delivered', 'Cancelled' ],
    default: "Unprocessed order"
  },
  updated: Date,
  user: { type: ObjectId, ref: 'User' },
},
{ timestamps: true }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order, CartItem };
