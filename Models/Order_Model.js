const mongoose=require("mongoose")
const {ObjectId} = mongoose.Schema.Types;

// mongosse .schema accpet two parameters fiels and options
const orderSchema=new mongoose.Schema(
{
    orderItems:[
        {
            slug: {type: String, required: true},
            Product_name: {type: String, required: true},
            quantity: {type: Number, required: true},
            Product_image: {type: String, required: true},
            Product_Price: {type: Number, required: true},
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref : 'Products',
                required: true
            }
        }
    ],
    shippingAddress:{
        fullname: {type: String, required: true},
        address: {type: String, required: true},
        city: {type: String, required: true},
        postalcode: {type: String, required: true},
        country: {type: String, required: true}
    },
    paymentMethod: {type: String, required: true},
    paymentResult: {
        id: String,
        status: String,
        update_time:String,
        email_address:String,
    },
    itemsPrice: {type: Number, required: true},
    shippingPrice: {type: Number, required: true},
    taxPrice: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    isPaid: {type: Boolean, default: false},
    paidAt: {type: Date},
    isDelivered: {type: Boolean, default:false},
    deliverdAt: {type: Date}
},

{
    timestamps:true
}

);

// craete a model of schema
const orderData=mongoose.model('Orders',orderSchema);
module.exports =  orderData;