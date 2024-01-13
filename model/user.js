import mongoose from "mongoose";
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
    },
    coverImage:{
        type:String,
    },
    accessToken:{
        type:String,
        default:""
    },
    aboutMe:{
        type:String,
    },
    friends:[
        {type:mongoose.Schema.Types.ObjectId,
        ref:'User'}
    ],
    notifications:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Notification'
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
        }],
    groups:[
        {
            type:mongoose.Schema.Types.ObjectId,
        ref:'Group'
        }
    ],

});

//Export the model
export const User = mongoose.model('User', userSchema);