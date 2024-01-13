import mongoose from "mongoose";
// Declare the Schema of the Mongo model
var groupSchema = new mongoose.Schema({
    groupName:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        type:String,
    },
    posts:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post'
}
],
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
   
    createdAt: {
        type: Date,
        default: Date.now
      }
});

//Export the model
export const Group = mongoose.model('Group', groupSchema);