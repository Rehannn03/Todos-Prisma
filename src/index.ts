import express from 'express'
import userRouter from '../router/userRouter';
import todoRouter from '../router/todorouter';
import cors from 'cors'
import cookieParser from 'cookie-parser';
const app=express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())
app.use('/user',userRouter)
app.use('/todo',todoRouter)

app.listen(3000,()=>{
    console.log("Server running on port 3000")
})