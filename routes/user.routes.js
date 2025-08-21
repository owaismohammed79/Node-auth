import express from "express";
import {registerUser, verifyUser, loginUser, logoutUser, getProfile, forgotPassword, resetPassword} from "../controller/user.controller.js"
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.post("/logout", isLoggedIn, logoutUser);
router.get("/profile", isLoggedIn, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword)

export default router;