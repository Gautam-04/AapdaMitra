import { app } from "./app.js";
import dotenv from 'dotenv';
import connectDb from "../Db/DbConfig.js";
import { Server } from "socket.io";
import { createServer } from 'node:http';

dotenv.config({
    path: '../env'
})

connectDb()

const server = createServer(app);

const io = new Server(server,{ 
    pingTimeout: 60000,
    cors: {
        origin: process.env.CORS_ORIGIN
    },
    credentials: true
});

app.set('io', io);

io.on('connection',(socket)=>{
    console.log(`A user is connected: ` ,socket.id)

    socket.on('disconnect', ()=>{
        console.log(`A user is disconnected: `, socket.id)
    })
})

app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Server connected at port ${process.env.PORT}`)
})