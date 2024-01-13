import express from 'express'
import { auth } from '../middleware/auth.js';
import { addLikeToPost, createPost, deletePost, getUserPosts, sharePost, updatePost } from '../controller/post_controller.js';

const router = express.Router();

router.post('/addPost',auth,createPost);
router.get('/getallposts',auth,getUserPosts);
router.patch('/update/:id',auth,updatePost);
router.patch('/update/:id',auth,updatePost);
router.delete('/delete/:id',auth,deletePost);

router.patch('/addLikeToPost/:id',auth,addLikeToPost);
router.patch('/sharePost/:id',auth,sharePost);


export default router;
