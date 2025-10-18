import express from "express"
import { isAuth } from "../middleware/isAuth.js"
import { commentPost, getAllPost, likePost, savePost, uploadPost } from "../controllers/post.controllers.js"
const router = express.Router()
import multer from "multer"
const upload = multer({storage: multer.memoryStorage()});


router.post("/upload-post", upload.single("media"),isAuth, uploadPost)

router.get("/all-post", isAuth, getAllPost)

router.get("/like-post/:postId", isAuth, likePost)

router.post("/comment-post/:postId", isAuth, commentPost)

router.get("/save-post/:postId", isAuth, savePost)

export default router