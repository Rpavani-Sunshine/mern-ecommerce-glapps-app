const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const userRouter = express.Router();
const bcrypt = require('bcryptjs');
const UserData = require('../Models/User_Model');
const isAuthorised = require('../MiddleWare/isAuth');
const generateToken = require('../utils');


userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const userdata = await UserData.findOne({ email: req.body.email });
    if (userdata) {
        if (bcrypt.compareSync(req.body.password, userdata.password)) {
            const data = {
                _id: userdata._id,
                username: userdata.User_name,
                email: userdata.email,
                isAdmin: userdata.isAdmin,
                token: generateToken(userdata)
            }
            res.json(data);
            return;
        }
    }
    res.status(401).send({ message: 'Invalid email or password' });
}))

userRouter.post('/signup', expressAsyncHandler(async (req, res) => {
    const newUser = new UserData({
        User_name: req.body.user_Name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    });
    const user = await newUser.save();
    const data = {
        _id: user._id,
        username: user.User_name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user)
    }
    res.json(data);
}));

userRouter.put('/profile', isAuthorised, expressAsyncHandler(async (req, res) => {
    const user = await UserData.findById(req.user._id);
    if (user) {
        user.User_name = req.body.username || user.User_name,
            user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
        }
        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            username: updatedUser.User_name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser)
        })
    }else{
        res.status(404).send({message:"User not found"});
    }
}))

module.exports = userRouter;