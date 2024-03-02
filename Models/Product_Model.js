const mongoose=require("mongoose")

// mongosse .schema accpet two parameters fiels and options
const productsSchema=new mongoose.Schema(
{
    Product_name:{
        type:String,
        required:true,
        unique:true
    },
    slug:{ 
        type:String,
        required:true,
        unique:true
    },
    Product_image:{
        type:String,
        required:true
        
    }, 
    Brand:{
        type:String,
        required:true
       
    },
    Product_Price:{
        type:Number,
        required:true
    },
    count_InStock:{
        type:Number,
        required:true
    },
    Product_Rating:{
        type:Number,
        required:true
    },
    numReviews:{
        type:Number,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    Category:{
        type:String,
        required:true
    }
},

{
    timestamps:true
}

);

// craete a model of schema
const ProductData=mongoose.model('Products',productsSchema);
module.exports =  ProductData;