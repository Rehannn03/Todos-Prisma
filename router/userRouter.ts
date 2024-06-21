import express from 'express'
import { PrismaClient, User } from '@prisma/client'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from 'process'
import verifyJWT from '../middleware/auth.middleware'
const userRouter=express.Router()
const prisma=new PrismaClient()

function generateToken(user:any){
    return jwt.sign(
        {
            id:user.id,
            username:user.username
        },
        env.JWT_SECRET as string,
        {
            expiresIn:env.JWT_EXPIRY
        }

    )
}

userRouter.post('/register',async (req:express.Request,res:express.Response)=>{
    const{username,password,fName,lName}=req.body
    const user=await prisma.user.create({
        data:{
            username,
            password,
            fName,
            lName
        }
    })
    res.status(200).json(user)
})

userRouter.post('/login',async (req:express.Request,res:express.Response)=>{
    const{username,password}=req.body

    const user=await prisma.user.findFirst({
        where:{
            username,
            password,
        }
    })
    if(!user){
        throw new Error("User Not Found")
    }
    if(password!=user?.password){
        throw new Error("Invalid Password")
    }
    const token=generateToken(user)
    const options={
        httpOnly:true,
        secure:true,
        sameSite:'None'
    }
    res.status(200)
    .cookie('token',token,options as Object)
    .json({
        message:"Login successful",
        user
    })
    
})

userRouter.post('/update',verifyJWT,async (req:express.Request,res:express.Response)=>{
    const{password,fName,lName}=req.body
    const user=await prisma.user.update({
        where:{
            id:(req as any).user.id
        },
        data:{
            password,
            fName,
            lName
        }
    })
    res.status(200).json(user)
})

userRouter.post('/logout',verifyJWT,async (req:express.Request,res:express.Response)=>{
    res.clearCookie('token')
    res.status(200).json({
        message:"Logout successful"
    })
})


export default userRouter