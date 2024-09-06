const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
{
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
    unique: true,
  },
},
{
  timestamps: true,
}
);
const FilterSchema = new mongoose.Schema(
{
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
    unique: true,
  },
},
{
  timestamps: true,
}
);
const Filter = mongoose.model('Filter', FilterSchema);
const Category = mongoose.model('Category', CategorySchema);



module.exports = { Filter, Category };