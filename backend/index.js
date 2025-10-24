// packages
import express from "express"
import {config} from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"

//files
import { connectDb } from "./src/db/db.js";
import authRoute from "./src/routes/auth.routes.js"
import userRoute from "./src/routes/user.routes.js"
import postRoute from "./src/routes/post.routes.js"
import reelRoute from "./src/routes/reels.routes.js"
import storyRoute from "./src/routes/story.routes.js"
import messageRoute from "./src/routes/message.routes.js"
import { app, server } from "./src/socket/socket.js";


config();

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// routes
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/post", postRoute)
app.use("/api/reel", reelRoute)
app.use("/api/story", storyRoute)
app.use("/api/message", messageRoute)

const port = process.env.PORT || 5000

server.listen(port, ()=>{
    connectDb()
    console.log(`server is running on this ${port}`)
})