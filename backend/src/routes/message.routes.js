import express from "express"
import { isAuth } from "../middleware/isAuth.js";
const router = express.Router();
import multer from "multer"
import { getAllMessages, getPrevUserChats, sendMessage } from "../controllers/message.controllers.js";
const upload = multer({storage: multer.memoryStorage()});

router.post("/send/:reciever", isAuth, upload.single("image"), sendMessage)

router.get("/all-message/:reciever", isAuth, getAllMessages)

router.get("/prev-chat", isAuth, getPrevUserChats)


export default router;