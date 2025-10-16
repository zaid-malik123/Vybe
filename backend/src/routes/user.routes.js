import express from "express"
import { isAuth } from "../middleware/isAuth.js";
import { currUser, resetPassword, sendOtp, suggestedUsers, verifyOtp } from "../controllers/user.controllers.js";
const router = express.Router();

router.get("/curr-user", isAuth, currUser)

router.post("/send-otp", sendOtp)

router.post("/verify-otp", verifyOtp)

router.post("/reset-password", resetPassword)

router.get("/suggested-user", isAuth, suggestedUsers)

export default router;