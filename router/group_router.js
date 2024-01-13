import express from 'express'
import { auth } from '../middleware/auth.js';
import { createGroup, deleteGroup, getAllGroups, getGroup, likeGroup, updateGroup } from '../controller/group_controller.js';
const router = express.Router();

router.post('/create',auth,createGroup);
router.patch('/update/:id',auth,updateGroup);
router.delete('/delete/:id',auth,deleteGroup);
router.patch('/like/:id',auth,likeGroup);
router.get('/get',auth,getGroup);
router.get('/getAllGroups',auth,getAllGroups);


export default router;
