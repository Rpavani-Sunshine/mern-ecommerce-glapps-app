const express = require('express');
const ProductData = require('../Models/Product_Model');
const expressAsyncHandler = require('express-async-handler');
const productrouter = express.Router();

// http://localhost:4000/api/products/
productrouter.get('/', async (req, res) => {
    try {
        const products = await ProductData.find();
        res.send(products);
    }
    catch (err) {
        res.send({ message: "Something went wrong" })
    }

});

const PAGE_SIZE = 3;
productrouter.get('/search', expressAsyncHandler(async (req, res) => {
  try {
      const { query } = req;
      const pageSize = query.pageSize || PAGE_SIZE;
      const page = query.page || 1;
      const category = query.category || '';
      const priceRange = query.price || '';
      const rating = query.rating || '';
      const order = query.order || '';
      const searchQuery = query.query || '';

      const queryFilter = searchQuery && searchQuery !== 'all'
          ? { 'Product_name': { $regex: searchQuery, $options: 'i' } }
          : {};
      
      const categoryFilter = category && category !== 'all' ? { 'Category': category } : {};

      const priceFilter = priceRange && priceRange !== 'all'
          ? {
              'Product_Price': {
                  $gte: Number(priceRange.split('-')[0]),
                  $lte: Number(priceRange.split('-')[1]),
              },
          }
          : {};

      const ratingFilter = rating && rating !== 'all'
          ? { 'Product_Rating': { $gte: Number(rating) } }
          : {};

      const sortOrder = order === 'featured'
          ? { featured: -1 }
          : order === 'lowest'
              ? { 'Product_Price': 1 }
              : order === 'highest'
                  ? { 'Product_Price': -1 }
                  : order === 'toprated'
                      ? { 'Product_Rating': -1 }
                      : order === 'newest'
                          ? { createdAt: -1 }
                          : { _id: -1 };

      const products = await ProductData.find({
          ...queryFilter,
          ...categoryFilter,
          ...priceFilter,
          ...ratingFilter,
      })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

      const countProducts = await ProductData.countDocuments({
          ...queryFilter,
          ...categoryFilter,
          ...priceFilter,
          ...ratingFilter,
      });

      res.send({
          products,
          countProducts,
          page,
          pages: Math.ceil(countProducts / pageSize),
      });
  } catch (err) {
      res.status(500).send({ error: "Something went wrong", details: err.toString() });
  }
}));



// API to get single Product Details by slug
productrouter.get('/slug/:slug', async (req, res) => {
    try {
        const product = await ProductData.findOne({ slug: req.params.slug });
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ message: 'Product not found' });
        }
    }
    catch (err) {
        res.send({ message: "Something went wrong" })
        console.log(err.message);
    }

});

productrouter.get('/categories', async (req, res) => {
    try {
        const categories = await ProductData.find().distinct('Category');
        res.send(categories);
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// get product to add cart
productrouter.get('/:id', async (req, res) => {
    try {
        const product = await ProductData.findById(req.params.id);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ message: 'Product not found' });
        }
    }
    catch (err) {
        res.send({ message: "Something went wrong" })
    }

})


module.exports = productrouter;