const express = require('express');
const expressAsyncHandler = require('express-async-handler'); // Import the package
const orderData = require('../Models/Order_Model');
const isAuthorised = require('../MiddleWare/isAuth');
const UserData = require('../Models/User_Model');
const ProductData = require('../Models/Product_Model');
const isAdmin = require('../MiddleWare/isAdmin');

const adminRouter = express.Router();

// users route
adminRouter.get('/getallusers',isAuthorised,isAdmin,expressAsyncHandler(async (req, res) => {
    const users = await UserData.find({});
    res.send(users);
  })
);

adminRouter.put('/updateuser/:id',isAuthorised,isAdmin,expressAsyncHandler(async (req, res) => {
    const user = await UserData.findById(req.params.id);
    if (user) {
      user.User_name = req.body.User_name || user.User_name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
adminRouter.get('/getuser/:id',isAuthorised,isAdmin,expressAsyncHandler(async (req, res) => {
    const user = await UserData.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
adminRouter.delete('/deleteuser/:id',isAuthorised,isAdmin,expressAsyncHandler(async (req, res) => {
    const user = await UserData.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.deleteOne();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

adminRouter.get('/summary',isAuthorised,isAdmin,expressAsyncHandler(async (req, res) => {
      const orders = await orderData.aggregate([
        {
          $group: {
            _id: null,
            numOrders: { $sum: 1 },
            totalSales: { $sum: '$totalPrice' },
          },
        },
      ]);
      const users = await UserData.aggregate([
        {
          $group: {
            _id: null,
            numUsers: { $sum: 1 },
          },
        },
      ]);
      const dailyOrders = await orderData.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            sales: { $sum: '$totalPrice' },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const productCategories = await ProductData.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ]);
      res.send({ users, orders, dailyOrders, productCategories });
    })
  );

  // Create New Product
  adminRouter.post('/addproduct',isAuthorised,isAdmin,expressAsyncHandler(async (req, res) => {
      const newProduct = new ProductData({
        Product_name: req.body.Product_name,
        slug: req.body.slug,
        Product_image: req.body.Product_image,
        Product_Price: req.body.Product_Price,
        Category: req.body.Category,
        Brand: req.body.Brand,
        count_InStock: req.body.count_InStock,
        Product_Rating: 0,
        numReviews: 0,
        Description: req.body.Description,
      });
      const product = await newProduct.save();
      res.send({ message: 'Product Created', product });
    })
  );

  // Edit Product
  adminRouter.put('/editproduct/:id',isAuthorised,isAdmin,expressAsyncHandler(async (req, res) => {
      const productId = req.params.id;
      const product = await ProductData.findById(productId);
      if (product) {
        product.Product_name = req.body.Product_name;
        product.slug = req.body.slug;
        product.Product_Price = req.body.Product_Price;
        product.Product_image = req.body.Product_image;
        product.images = req.body.images;
        product.Category = req.body.Category;
        product.Brand = req.body.Brand;
        product.count_InStock = req.body.count_InStock;
        product.Description = req.body.Description;
        await product.save();
        res.send({ message: 'Product Updated' });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    })
  );


const PAGE_SIZE = 3;
adminRouter.get('/productlist',isAuthorised,isAdmin,expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await ProductData.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await ProductData.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

// delete product
adminRouter.delete('/deleteproduct/:id',isAuthorised,isAdmin,expressAsyncHandler(async (req, res) => {
    const product = await ProductData.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

// order routes

adminRouter.get('/orders', isAuthorised, isAdmin, expressAsyncHandler(async (req, res) => {
  const orders = await orderData.find()
  .populate("user","User_name")
  res.send(orders);
}));

adminRouter.delete('/deleteorder/:id',isAuthorised,isAdmin,(async (req, res) => {
    const order = await orderData.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);


module.exports = adminRouter;
