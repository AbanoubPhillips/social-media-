import express from 'express';
import formidable from 'express-formidable';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan'
import cors from "cors";

import userRouter from './router/user_router.js';
import postRouter from './router/post_router.js';
import commentRouter from './router/comment_router.js';
import groupRouter from './router/group_router.js';



import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.options('*',cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use('/public',express.static(__dirname + '/public'));

// database connection 
mongoose.connect('mongodb://127.0.0.1:27017/social_network',{
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(()=>console.log("database connected"))
.catch((err)=>console.error(err));

app.listen(5000);


app.use('/api/v1',userRouter);
app.use('/api/v1/posts',postRouter);
app.use('/api/v1/comments',commentRouter);
app.use('/api/v1/groups',groupRouter);


