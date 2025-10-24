import http from "http"
import express from "express"
import {Server} from "socket.io"

export const app = express()
export const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials:true
    }
})

const userSocketMap = {}

io.on("connection",(socket)=>{
const userId = socket.handshake.query.userId
if(userId != undefined){
    userSocketMap[userId] = socket.id
}

socket.on("disconnect",()=>{
    delete userSocketMap[userId]
})
})






