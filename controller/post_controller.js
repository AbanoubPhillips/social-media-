import {Post} from "../model/post.js"
import { User } from "../model/user.js";
import { Notification } from "../model/notification.js";



export const createPost = async (req,res)=>{
    const data = req.body;
    
  try {
    const user = await User.findOne({email:req.user})
    const post = new Post({
        caption:data.caption,
        image:data.image,
        video:data.video,
        owner:user.id,
    });
    await post.save();
    user.posts.push(post);
    await user.save();
    return res.status(201).json({postData:post});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
 
};

export const getUserPosts = async (req,res)=>{
    let posts;
    try {
        const user = await User.findOne({email:req.user});
        posts= await Post.find().where({owner:user.id});
        if(!posts) return res.status(404).json({massage:"No Posts Added Yet"});
        return res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }  
 
};

export const deletePost = async (req,res)=>{
  const id = req.params.id;
    try {
    const user = await User.findOne({email:req.user});
    const post  = await Post.findByIdAndDelete(id).where({owner:user.id});
    user.posts.splice(post.id);
    await user.save();
    if(post === null)
      return res.status(400).json({message:"You Can Not delete Post" });
    return res.status(200).json({message:"Post Deleted Successfully"});
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};


export const updatePost = async (req,res)=>{
  const id = req.params.id;
    try {
   const user = await User.findOne({email:req.user});
   const post = await Post.where({owner:user.id}).findOneAndUpdate({_id:id},{
    caption:req.body.caption,
    image:req.body.image,
    video:req.body.video,
   },{new:true});
   if(post === null)
      return res.status(400).json({ error:"You Can Not Update Post" });
   return res.status(200).json({message:"Post Updated Successfully",newPost:post});
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};

export const addLikeToPost = async (req,res)=>{
  const id = req.params.id;
    try {

   const user = await User.findOne({email:req.user});
   const post = await Post.findById(id);
   // check if user like post or not
   let isLiked = false;
   for (let index = 0; index < post.likes.length; index++) {
    const liker = post.likes[index];
    if(liker.toString() == user.id.toString()){
      isLiked= true;
      break;
    }
   }
   // if isliked turn unliked
   if(isLiked){
    post.likes.splice(user.id);
    await post.save();
    return res.status(200).json({status:"Unliked",message:"Post Has Been Unliked"});

   }else{
    // send notification to post owner 
    const notification = new Notification({
      content:`${user.name} has liked your post.`,
      type:"post_liked",
      profileImage:user.profileImage
    });
    await notification.save();

    const postOwner = await User.findOne({_id:post.owner});
    postOwner.notifications.push(notification.id);
    await postOwner.save();
    
    post.likes.push(user.id);
    await post.save();
    return res.status(200).json({status:"liked",message:"Post has been liked",notification:notification});
   }
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};



export const sharePost = async (req,res)=>{
  const id = req.params.id;
    try {

   const user = await User.findOne({email:req.user});
   const post = await Post.findById(id);

    post.shares.push(user.id);
    await post.save();
    
    user.posts.push(post.id);
    await user.save();
// send notification to post owner 
    const notification = new Notification({
      content:`${user.name} shared your post.`,
      type:"post_share",
      profileImage:user.profileImage
    });
    await notification.save();

    const postOwner = await User.findOne({id:post.owner});
    postOwner.notifications.push(notification.id);
    await postOwner.save();
    return res.status(200).json({status:"shared",message:"Post has been shared",post:post,notification:notification});
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};