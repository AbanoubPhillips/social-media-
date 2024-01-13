import mongoose from "mongoose";
// Declare the Schema of the Mongo model
var notificationSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
        
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
});

//Export the model
export const Notification = mongoose.model('Notification', notificationSchema);