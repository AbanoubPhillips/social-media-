import { Group } from "../model/group.js";
import { User } from "../model/user.js";


export const createGroup = async (req,res)=>{
    const data = req.body;
    
  try {
    const user = await User.findOne({email:req.user})
    const group = new Group({
        groupName:data.name,
        description:data.description,
        image:data.image,
        owner:user.id,

    });
    await group.save();
    user.groups.push(post);
    await user.save();
    return res.status(201).json({groupData:group});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
 
};

export const deleteGroup = async (req,res)=>{
    const id = req.params.id;
      try {
      const user = await User.findOne({email:req.user});
      const group  = await Group.findByIdAndDelete(id).where({owner:user.id});
      user.groups.splice(group.id);
      await user.save();
      if(group === null)
        return res.status(400).json({message:"You Can Not delete group" });
      return res.status(200).json({message:"group Deleted Successfully"});
    }catch(err){
      return res.status(500).json({ error: err.message });
    }
  };



  export const updateGroup = async (req,res)=>{
    const id = req.params.id;
      try {
     const user = await User.findOne({email:req.user});
     const group = await Group.where({owner:user.id}).findOneAndUpdate({_id:id},{
      groupName:req.body.name,
      image:req.body.image,
      description:req.body.description,

     },{new:true});
     if(group === null)
        return res.status(400).json({ error:"You Can Not Update group" });
     return res.status(200).json({message:"Group Updated Successfully",newGroup:group});
    }catch(err){
      return res.status(500).json({ error: err.message });
    }
  };
  


  export const getGroup = async (req,res)=>{
    const name = req.body.name;
      try {
     const group = await Group.findOne({groupName:name});
     return res.status(200).json({group:group});
    }catch(err){
      return res.status(500).json({ error: err.message });
    }
  };
  

  export const getAllGroups = async(req,res)=>{
    const group = Group.find();
    return res.status(200).json({status:"success",groups:group});
}


  export const likeGroup = async (req,res)=>{
    const id = req.params.id;
      try {
  
     const user = await User.findOne({email:req.user});
     const group = await Group.findById(id);
     // check if user like post or not
     let isLiked = false;
     for (let index = 0; index < group.likes.length; index++) {
      const liker = group.likes[index];
      if(liker.toString() == user.id.toString()){
        isLiked= true;
        break;
      }
     }
     // if isliked turn unliked
     if(isLiked){
      group.likes.splice(user.id);
      await group.save();
      return res.status(200).json({status:"Unliked",message:"group has been unliked"});
  
     }else{
      // send notification to post owner 
      const notification = new Notification({
        content:`${user.name} has liked your Group ${group.groupName}.`,
        type:"group_liked",
        profileImage:user.profileImage
      });
      await notification.save();
  
      const groupOwner = await User.findOne({id:group.owner});
      groupOwner.notifications.push(notification.id);
      await groupOwner.save();
      
      group.likes.push(user.id);
      await group.save();
      return res.status(200).json({status:"liked",message:"group has been liked",notification:notification});
     }
    }catch(err){
      return res.status(500).json({ error: err.message });
    }
  };
  