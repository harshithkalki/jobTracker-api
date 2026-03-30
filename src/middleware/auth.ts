import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
    }
}

dotenv.config()
export function TokenAuth(req:Request,res:Response,next:NextFunction){
    const token = req.headers['authorization']
    const tokenvalue= token?.split(' ')[1];
    if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided" });
    }
    try{

        const user=jwt.verify(tokenvalue as string,process.env.JWT_SECRET as string);
        req.user=user;
        next();
    }    catch(err){
        res.status(401).json({message:"Invalid token"});
    }
    }