import {User} from '../model/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Notification } from '../model/notification.js'

export const signup  = async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
   try {
    const existUser = await User.findOne({email:email})
    if(existUser){
       return res.json({message:"User Already signup, Try to Login"})
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        mobile:req.body.mobile,
        gender:req.body.gender,
        aboutMe:req.body.aboutMe,
    });
    await user.save();
    return res.status(201).json({status:"success",message:"User Signed up Successfully, Lets Login"})

   } catch (error) {
    return res.status(400).json({message:error.message});
   }
}




export const login  = async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    try {
    const user = await User.findOne({email:email});
    if(!user){
       return res.status(404).json({message:"User Not Found"})
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if(!correctPassword){
        return res.status(400).json({message:"Invalid Email or Password"})
    }
    const token =  jwt.sign(user.email,'secretkey');
    await User.findOneAndUpdate({email:email},{'accessToken':token});
          

    return res.status(200).json({status:"success",message:"User Login Successfully",accessToken:token})
    } catch (error) {
        return res.status(400).json({message:error.message});
    }

}



export const updateProfile  = async(req,res)=>{
    try {
     const user = await User.findOneAndUpdate({email:req.user},{
        name:req.body.name,
        mobile:req.body.mobile,
        gender:req.body.gender,
        aboutMe:req.body.aboutMe,
        profileImage:req.body.profileImage,
        coverImage:req.body.coverImage,
    },{new:true});
     if(!user){
        return res.status(404).json({message:"User Not Found"})
     } 
    return res.status(200).json({status:"success",message:"Profile Updated Successfully",userData:user})
    } catch (error) {
        return res.status(400).json({message:error.message});
    }

}

export const getUserProfile  = async(req,res)=>{
    try {
     const user = await User.findOne({_id: req.params.id});
     if(!user){
        return res.status(404).json({message:"User Not Found"})
     } 
    return res.status(200).json({status:"success",userData:user});
    } catch (error) {
        return res.status(400).json({message:error.message});
    }

}

export const followFriend = async(req,res)=>{
    const id = req.params.id;
    try {
        const user = await User.findOne({email:req.user});
        let isfollowed = false;
       for (let index = 0; index < user.friends.length; index++) {
         const follower = user.friends[index];
         if(follower.toString() == id.toString()){
            isfollowed= true;
            break;
            }
        }
        if(isfollowed){
            return res.json({message:"you already follow this user"});
        }
        else{
            user.friends.push(id);
        await user.save();
        console.log(user);
        const friend = await User.findById(id);
        friend.friends.push(user.id);

        // send notification to post owner 
         const notification = new Notification({
        content:`${user.name} follow you.`,
        type:"Following",
        profileImage:user.profileImage
        });
        await notification.save();

        friend.notifications.push(notification.id);
        await friend.save();

        return res.status(200).json({status:"success",notification:notification});
        }
    } catch (error) {
        return res.status(400).json({message:error.message});
    }
}

export const unfriend = async(req,res)=>{
    const id = req.params.id;
    try {
        const user = await User.findOne({email:req.user});
        let isfollowed = true ;
       for (let index = 0; index < user.friends.length; index++) {
         const follower = user.friends[index];
         if(follower.toString() == id.toString()){
            isfollowed= false;
            break;
            }
        }
        if(!isfollowed){
            return res.json({message:"you already unfollow this user"});
        }
        else{
            user.friends.splice({friendId:id});
        await user.save();

        const friend = await User.findById(id);
        friend.friends.splice({friendId:user.id});
        await friend.save();

        return res.status(200).json({status:"success",message:"you Unfollow this user"});
        }
    } catch (error) {
        return res.status(400).json({message:error.message});
    }
}



export const getAllFriends = async(req,res)=>{
    const user = User.findOne({email:req.user});
    return res.status(200).json({status:"success",allFreinds:user.friends});
}


export const sendMessage = async(req,res)=>{
   try {
    const user = User.findOne({email:req.user});
    user.friends.forEach(friend => {
        if(friend.friendId == req.params.id){
            user.friends.push({
                friendId:req.params.id,
                inbox:{
                    $push:{
                        message:req.body.message,
                    }
                }
            });
        }
    });
    await user.save();
    return res.status(200).json({status:"success",message:req.body.message});
   } catch (error) {
    return res.status(400).json({message:error.message});
   }
}


export const getMessages = async(req,res)=>{
   try {
    let messages = [];
    const user = User.findOne({email:req.user});
    user.friends.forEach(friend => {
        if(friend.friendId == req.params.id){
            for (let index = 0; index < friend.inbox.length; index++) {
                const message = friend.inbox[index];
                messages.push(message);
            }
        }
    });
    await user.save();
    return res.status(200).json({status:"success",messages:messages});
   } catch (error) {
    return res.status(400).json({message:error.message});
   }
}