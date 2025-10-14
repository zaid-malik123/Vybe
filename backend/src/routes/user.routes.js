import express from "express"
import { isAuth } from "../middleware/isAuth.js";
import { currUser } from "../controllers/user.controllers.js";
const router = express.Router();

router.get("/curr-user", isAuth, currUser)

export default router;