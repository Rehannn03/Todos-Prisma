import express from 'express';
import { PrismaClient} from '@prisma/client';
import verifyJWT from '../middleware/auth.middleware';
const prisma=new PrismaClient()
const todoRouter=express.Router()


todoRouter.get('/',async (req:express.Request,res:express.Response)=>{
    const todos=await prisma.todo.findMany()
    res.status(200).json(todos)
})

todoRouter.post('/create',verifyJWT,async(req:express.Request,res:express.Response)=>{
    const {title,description}=req.body
    const todo=await prisma.todo.create({
        data:{
            title,
            description,
            userid:(req as any).user?.id
        }
    })
    res.status(200).json(todo)
})

todoRouter.patch('/updateDone/:id',verifyJWT,async(req:express.Request,res:express.Response)=>{
    console.log(typeof req.params.id);
    
    const id=parseInt(req.params.id)
    const updatedTodo=await prisma.todo.update({
        where:{
            id
        },
        data:{
            done:true
        }
    })
    res.status(200).json(updatedTodo)
})

todoRouter.patch('/update/:id',verifyJWT,async(req:express.Request,res:express.Response)=>{
    const id=parseInt(req.params.id)
    const {title,description}=req.body
    const updatedTodo=await prisma.todo.update({
        where:{
            id
        },
        data:{
            title,
            description
        }
    })
    res.status(200).json(updatedTodo)
})

todoRouter.delete('/delete/:id',verifyJWT,async(req:express.Request,res:express.Response)=>{
    const id=parseInt(req.params.id)
    const deletedTodo=await prisma.todo.delete({
        where:{
            id
        }
    })
    res.status(200).json(deletedTodo)
})

todoRouter.get('/myTodos',verifyJWT,async(req:express.Request,res:express.Response)=>{
    const todos=await prisma.todo.findMany({
        where:{
            userid:(req as any).user?.id
        }
    })
    res.status(200).json(todos)
})

todoRouter.get('/todoAndUser',verifyJWT,async(req:express.Request,res:express.Response)=>{
    const todos=await prisma.todo.findMany({
        where:{
            userid:(req as any).user?.id
        },
        select:{
            user:true,
            title:true,
            description:true
        }
    })
    res.status(200).json(todos)
})

export default todoRouter