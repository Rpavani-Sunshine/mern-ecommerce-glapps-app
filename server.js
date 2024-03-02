const express=require('express');
const path = require('path');
const mongoose= require('mongoose');
const dotenv =require('dotenv');
const cors=require('cors');
const  seedRouter = require('./Routes/seedRoute.js');
const productrouter = require('./Routes/productRoute.js');
const userRouter = require('./Routes/userRoute.js');
const orderRouter = require('./Routes/orderRoute.js');
const adminRouter = require('./Routes/adminroutes.js');

dotenv.config();
// connecting online MongoDB cloud
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log('connected to MongoDB');
})
.catch(err=>{
    console.log(err);
})

// create express instance
const app = express();
// passing cors as middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/glapps', seedRouter)
app.use('/api/products', productrouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/admin', adminRouter)


const port = 4000;
app.get('/api/key/paypal', (req, res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID || 'sandbox')
})

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '/frontend/build')));
// app.get('*', (req, res)=>{
//     res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
// });

app.use((err,req,res,next)=>{
    res.status(500).send({message:err.message});
});

app.listen(port, ()=>{
    console.log('listening on port http://localhost:',port);
});