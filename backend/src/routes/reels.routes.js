import express from "express"
import { isAuth } from "../middleware/isAuth.js"
const router = express.Router()
import multer from "multer"
import { commentReel, getAllReels, likeReel, uploadReel } from "../controllers/reels.controllers.js";
const upload = multer({storage: multer.memoryStorage()});

router.post("/upload-reel", upload.single("media"),isAuth, uploadReel)
router.get("/like-reel/:reelId", isAuth, likeReel )
router.post("/comment-reel/:reelId", isAuth, commentReel)
router.get("/all-reels", isAuth, getAllReels)



export default router