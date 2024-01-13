import jwt from 'jsonwebtoken'
export const  auth = (req,res,next)=>{
   const header = req?.headers?.authorization;
   const token = header.split(' ')[1];
   const userData = jwt.decode(token,'secretkey');
   req.user = userData;
   next();
}