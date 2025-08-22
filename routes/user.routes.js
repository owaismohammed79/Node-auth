import express from "express";
import {registerUser, verifyUser, loginUser, logoutUser, getProfile, forgotPassword, resetPassword, googleCallback} from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import passport from "../utils/passport.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and management
 */

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully. A verification email has been sent.
 *       400:
 *         description: Bad request (e.g., missing fields, user already exists).
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/v1/users/verify/{token}:
 *   get:
 *     summary: Verify a user's email address
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The verification token sent to the user's email.
 *     responses:
 *       200:
 *         description: User verified successfully.
 *       400:
 *         description: Invalid or missing token.
 */
router.get("/verify/:token", verifyUser);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully. Returns a JWT token in an HttpOnly cookie.
 *       400:
 *         description: Invalid credentials or unverified email.
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *       500:
 *         description: Internal server error.
 */
router.post("/logout", isLoggedIn, logoutUser);

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: User not found.
 */
router.get("/profile", isLoggedIn, getProfile);

/**
 * @swagger
 * /api/v1/users/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *     responses:
 *       201:
 *         description: Password reset email sent.
 *       400:
 *         description: Error sending email.
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/v1/users/reset-password/{token}:
 *   post:
 *     summary: Reset a user's password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The password reset token from the email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confPassword
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newPassword123
 *               confPassword:
 *                 type: string
 *                 format: password
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Passwords do not match or token is invalid/expired.
 */
router.post("/reset-password/:token", resetPassword)

/**
 * @swagger
 * /api/v1/users/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Authentication]
 *     description: Redirects the user to Google's authentication screen.
 *     responses:
 *       302:
 *         description: Redirect to Google.
 */
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * @swagger
 * /api/v1/users/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback URL
 *     tags: [Authentication]
 *     description: Google redirects to this URL after authentication. It handles the login, sets a cookie, and redirects to the frontend.
 *     responses:
 *       302:
 *         description: Redirect to the frontend dashboard upon successful login.
 */
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: false }),
    googleCallback
);

export default router;