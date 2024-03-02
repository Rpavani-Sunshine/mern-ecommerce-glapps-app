const express = require('express');
const expressAsyncHandler = require('express-async-handler'); // Import the package
const orderData = require('../Models/Order_Model');
const isAuthorised = require('../MiddleWare/isAuth');

const orderRouter = express.Router();

// Use expressAsyncHandler to wrap your async route handler
orderRouter.post('/',isAuthorised,expressAsyncHandler(async (req, res) => {
    try{
        const newOrder = new orderData({
            orderItems: req.body.orderItems.map(x => ({ ...x, product: x._id })),
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id,
        });
        const order = await newOrder.save();
        res.status(200).send({ message: 'New Order Created', order });
    }
    catch(err){
        console.log("OrderRouter error: " + err);
    }
}));

//orderhistory route
orderRouter.get('/orderhistory',isAuthorised, expressAsyncHandler(async (req, res) => {
    try{
        const order = await orderData.find({user:req.user._id});
    
        res.send(order);
    }
    catch(err){
        console.log(err.message);
    }
    })
)

orderRouter.get('/:id',isAuthorised,expressAsyncHandler(async (req, res) => {
    try{
        const order = await orderData.findById(req.params.id);
        if(order){
            res.send(order);
        }
        else{
            res.status(404).send({message:'Order not Found'})
        }
    }
    catch(err){
    }
}));

orderRouter.put('/:id/pay',isAuthorised,expressAsyncHandler(async (req, res)=>{
    const order = await orderData.findById(req.params.id);
    if (order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        }

        const updatedOrder = await order.save();
        res.send({message: 'Order Paid', order: updatedOrder});
    }
    else{
        res.status(404).send({message: 'Order Not Found'});
    }
}) );




module.exports = orderRouter;
