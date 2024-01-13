import express from 'express'
import { auth } from '../middleware/auth.js';
import { createComment, deleteComment, getPostComments, updateComment } from '../controller/comment_controller.js';
import { addReplyComment, deleteReplyComment, getCommentReplies } from '../controller/reply_controller.js';

const router = express.Router();

router.post('/add/:id',auth,createComment);
router.get('/:id',auth,getPostComments);
router.patch('/update/:id',auth,updateComment);
router.delete('/delete/:id',auth,deleteComment);

router.post('/addReplyComment/:id',auth,addReplyComment);
router.get('/getCommentReplies/:id',auth,getCommentReplies);
router.delete('/deleteReplyComment/:id',auth,deleteReplyComment);
router.patch('/updateReplyComment/:id',auth,updateComment);




export default router;
