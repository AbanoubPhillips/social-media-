import {Comment} from "../model/comment.js"
import { Post } from "../model/post.js";
import {User} from '../model/user.js';
import {Notification} from '../model/notification.js'


export const createComment = async (req,res)=>{
    const data = req.body;
  try {
    const user = await User.findOne({email:req.user})
    const comment = new Comment({
        content:data.content,
        owner:user.id,
        postId:req.params.id
    });
    
    await comment.save();
    const post = await Post.findById(comment.postId);
    post.comments.push(comment);
    await post.save();
    // send notification to post owner 
    const notification = new Notification({
      content:`${user.name} Commented to your post.`,
      type:"post_comment",
      profileImage:user.profileImage
    });
    await notification.save();

    const postOwner = await User.findOne({_id:post.owner});
    postOwner.notifications.push(notification.id);
    await postOwner.save();
    return res.status(201).json({comment:comment, notification:notification});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
 
};

export const getPostComments = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
       const comments= await Comment.find().where({postId:post.id});
        if(!comments) return res.status(404).json({"massage":"no comments added yet"});
        return res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }  
 
};

export const deleteComment = async (req,res)=>{
  const id = req.params.id;
    try {
    const user = await User.findOne({email:req.user});
    const comment  = await Comment.findByIdAndDelete(id).where({owner:user.id});
    const post = await Post.findById(comment.postId);
    post.comments.splice(comment.id);
    await post.save();
    if(comment === null)
        return res.status(400).json({message:"You Can Not delete Comment" });

    return res.status(200).json({message:"Comment Deleted Successfully"});
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};


export const updateComment = async (req,res)=>{
  const id = req.params.id;
    try {
        const user = await User.findOne({email:req.user});
        const comment = await Comment.where({owner:user.id}).findOneAndUpdate({_id:id},{
         content:req.body.content,
        },{new:true});
        if(comment === null)
           return res.status(400).json({ error:"You Can Not Update Comment" });
        return res.status(200).json({message:"Comment Updated Successfully",newComment:comment});
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};
