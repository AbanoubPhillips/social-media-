import mongoose from "mongoose";
// Declare the Schema of the Mongo model
var postSchema = new mongoose.Schema({
    caption:{
        type:String,
        required:true,
    },
    Image:{
        type:String,
    },
    video:{
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    ],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    shares:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
      }
});

//Export the model
export const Post = mongoose.model('Post', postSchema);