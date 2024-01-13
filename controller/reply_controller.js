import {Comment} from "../model/comment.js"
import { ReplyComment } from "../model/replyComment.js";
import {User} from '../model/user.js'


export const addReplyComment = async (req,res)=>{
    const id = req.params.id;
    try {
        const comment = await Comment.findById(id);
        const user = await User.findOne({email:req.user})
        const reply = new ReplyComment({
        content:req.body.content,
        owner:user.id,
        commentId:id
        });
        await reply.save();
        comment.replies.push(reply.id);
        await comment.save();
        // send notification to post owner 
    const notification = new Notification({
      content:`${user.name} replied to your comment.`,
      type:"comment_reply",
      profileImage:user.profileImage
    });
    await notification.save();

    const commentOwner = await User.findOne({id:comment.owner});
    commentOwner.notifications.push(notification.id);
    await commentOwner.save();
    return res.status(201).json({reply:reply,notification:notification});
    }catch(err){
        return res.status(500).json({ error: err.message });
    }
  };

export const getCommentReplies = async (req,res)=>{
    try {
       const comment= await Comment.findById(req.params.id);
        if(!comment) return res.status(404).json({"massage":"No Replies Added Yet"});
        return res.status(200).json({data:comment.replies});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }  
 
};

export const deleteReplyComment = async (req,res)=>{
  const id = req.params.id;
    try {
    const user = await User.findOne({email:req.user});
    const reply  = await ReplyComment.findByIdAndDelete(id).where({owner:user.id});
    const comment = await Comment.findById(reply.commentId);
    comment.replies.splice(id);
    await comment.save();
    if(reply === null)
        return res.status(400).json({message:"You Can Not delete Comment" });

    return res.status(200).json({message:"Comment Deleted Successfully"});
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};


export const updateReplyComment = async (req,res)=>{
  const id = req.params.id;
    try {
        const user = await User.findOne({email:req.user});
        const reply = await ReplyComment.where({owner:user.id}).findOneAndUpdate({_id:id},{
         content:req.body.content,
        },{new:true});
        if(reply === null)
           return res.status(400).json({ error:"You Can Not Update Comment" });
        return res.status(200).json({message:"Comment Updated Successfully",newComment:comment});
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};


