import express from 'express'
import { followFriend, getAllFriends, getMessages, getUserProfile, login, sendMessage, signup, unfriend, updateProfile } from '../controller/user_controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.patch('/updateProfile',auth,updateProfile);
router.get('/getUserProfile/:id',auth,getUserProfile);
router.patch('/followFriend/:id',auth,followFriend);
router.patch('/unfollowFriend/:id',auth,unfriend);
router.get('/getAllFriends',auth,getAllFriends);

router.post('/sendmessage/:id',auth,sendMessage);
router.get('/messages/:id',auth,getMessages)

export default router;
