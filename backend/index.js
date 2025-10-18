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

const app = express();
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

const port = process.env.PORT || 5000

app.listen(port, ()=>{
    connectDb()
    console.log(`server is running on this ${port}`)
})