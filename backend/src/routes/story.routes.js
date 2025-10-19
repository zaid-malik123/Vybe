import express from "express"
import { isAuth } from "../middleware/isAuth.js"
const router = express.Router()
import multer from "multer"
import { createStory, getStoryByUsername, viewStory } from "../controllers/story.controllers.js";
const upload = multer({storage: multer.memoryStorage()});



router.post("/upload-story", upload.single("media"), isAuth, createStory )

router.get("/view-story/:storyId", isAuth, viewStory)

router.get("/getStoryByUsername/:userName", isAuth, getStoryByUsername)



export default router