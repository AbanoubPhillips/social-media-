import mongoose from "mongoose";
// Declare the Schema of the Mongo model
var commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    likes:[],
    replies:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now
      }
});

//Export the model
export const Comment = mongoose.model('Comment', commentSchema);