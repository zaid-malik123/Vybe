import express from "express"
import { isAuth } from "../middleware/isAuth.js";
import multer from "multer"
const upload = multer({storage: multer.memoryStorage()});
import { currUser, editProfile, followUser, getUserProfile, resetPassword, sendOtp, suggestedUsers, verifyOtp } from "../controllers/user.controllers.js";
const router = express.Router();

router.get("/curr-user", isAuth, currUser)

router.post("/send-otp", sendOtp)

router.post("/verify-otp", verifyOtp)

router.post("/reset-password", resetPassword)

router.get("/suggested-user", isAuth, suggestedUsers)

router.post("/edit-profile", upload.single("profileImage"), isAuth, editProfile)

router.get("/user-profile/:userName", isAuth, getUserProfile)

router.get("/follow-user/:targetUserId", isAuth, followUser)

export default router;