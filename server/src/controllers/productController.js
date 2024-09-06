const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const ProductM = require('../models/productM');

exports.productById = (req, res, next, id) => {
  ProductM.findById(id)
    .populate('name')
    .populate('category')
    .populate('type')
    .exec((error, pdt) => {
      if (error || !pdt) {
        return res.status(400).json({
          error: "Can'\t find that footwear",
        });
      }
      req.shoe = shoe;
      next();
    });
};

exports.read = (req, res) => {
  req.pdt.pic = undefined;
  return res.json(req.pdt);
};

exports.create = (req, res) => {
  let createdForm = new formidable.IncomingForm();
  createdForm.keepExtensions = true;
  createdForm.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: 'Error uploading that image',
      });
    }

    const { name, type, desc, price, category, quantity, destination } = fields;

    if ( !name || !type || !desc || !price || !category ||
      !quantity || !destination ) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    let product = new ProductM(fields);

    // 1kb = 1000
    // 1mb = 1000000

    if (files.pic) {
      // console.log("FILES PHOTO: ", files.photo);
      if (files.pic.size > 1024000) {
        return res.status(400).json({
          error: 'Photo size should be smaller than 1MB',
        });
      }
      product.pic.data = fs.readFileSync(files.pic.path);
      product.pic.contentType = files.pic.type;
    }

    product.save((error, saved) => {
      if (error) {
        console.error('Error adding product');
        return res.status(400).json({ error: "Failed to add product"});
      }
      res.json(saved);
    });
  });
};

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((error, deletedProduct) => {
    if (error) {
      return res.status(400).json({
        error: "File can not be removed",
      });
    }
    res.status(200).send({ message: 'Product deleted',});
  });
};

exports.update = (req, res) => {
  let updateForm = new formidable.IncomingForm();
  updateForm.keepExtensions = true;
  updateForm.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: 'Upload failed',
      });
    }

    let product = req.product;
    product = _.extend(product, fields);


    if (files.pic) {
      if (files.pic.size > 1024000) {
        return res.status(400).json({
          error: 'Image must be smaller than 1MB',
        });
      }
      product.pic.data = fs.readFileSync(files.pic.path);
      product.pic.contentType = files.photo.type;
    }

    product.save((error, saved) => {
      if (error) {
        return res.status(400).json({ error: "Failed to save. please try again" });
      }
      res.json(saved);
    });
  });
};

/**
 * nowSelling  newArrival Sold
 * sold = /products?sortBy=sold&order=desc&limit=4
 * by newArrival = /products?sortBy=createdAt&order=desc&limit=4
 * WHEN no params {sortType--sold_createdAt&order--track&} are sent, then all products are returned
 */

exports.list = (req, res) => {
  let findSearch = req.query;
  let order = findSearch.order ? findSearch.order : 'asc';
  let sortBy = findSearch.sortBy ? findSearch.sortBy : '_id';
  let limit = findSearch.limit ? parseInt(findSearch.limit) : 6;

  ProductM.find()
    .select('-pic')
    .populate('type')
    .populate('name')
    .populate('category')

    .sort([[sortBy, order]])
    .limit(limit)
    .exec((error, products) => {
      if (error) {
        return res.status(400).send({ error: 'Sorry, no products matches your search'});
      }
      res.json(products);
    });
};