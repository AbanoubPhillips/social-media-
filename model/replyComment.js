import mongoose from "mongoose";
// Declare the Schema of the Mongo model
var replyCommentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    commentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
});

//Export the model
export const ReplyComment = mongoose.model('ReplyComment', replyCommentSchema);