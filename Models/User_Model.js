const mongoose=require("mongoose")

// mongosse .schema accpet two parameters fiels and options
const userSchema=new mongoose.Schema(
{
    User_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    },
},

{
    timestamps:true
}

);

// craete a model of schema
const UserData=mongoose.model('Users',userSchema);
module.exports =  UserData;