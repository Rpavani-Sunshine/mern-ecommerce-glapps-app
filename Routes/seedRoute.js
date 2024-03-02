const express=require('express')
const ProductData = require('../Models/Product_Model')
const productData= require('../productData.js');
const UserData = require('../Models/User_Model.js');

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
    try {
        await ProductData.deleteMany();
        const Products = await ProductData.insertMany(productData.products);
        await UserData.deleteMany();
        const users = await UserData.insertMany(productData.users);
        res.send({ Products, users });
    } catch (error) {
        console.log("SeedRoute Error: " + error.message)
    }
})

module.exports = seedRouter;