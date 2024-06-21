import express, { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import { PrismaClient, User } from '@prisma/client';
import { log } from 'console';
const prisma=new PrismaClient()

interface CustomRequest extends express.Request{
    user?:User | null
}


const verifyJWT:RequestHandler=async (req:CustomRequest,_:express.Response,next:express.NextFunction)=>{
    const token=req.cookies?.token
    if(!token){
        throw new Error("Unauthorized")
    }
    try{
        const decoded=jwt.verify(token,env.JWT_SECRET as string) as jwt.JwtPayload
        const user=await prisma.user.findFirst({
            where:{
                id:decoded.id 
            }
        })
        req.user=user
    }
    catch(e:any){
        throw new Error(e.message)
    }
    next()

}

export default verifyJWT