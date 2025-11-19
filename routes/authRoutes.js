const express = require("express");
const {
  signup,
  login,
  resetPassword,
  verifyOTP,
  currentUser,
  logout,
} = require("../controllers/authController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication routes
 */


/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               password:
 *                 type: string
 *                 example: "strongpassword123"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request / validation error
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ebuka@gmail.com"
 *               password:
 *                 type: string
 *                 example: "strongpassword123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized / invalid credentials
 */

router.post("/login", login);

router.post("/request-otp", resetPassword);
router.post("/verify-otp", verifyOTP);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *    summary: User logout
 *    tags: [Auth]
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: User logged out successfully
 *     401:
 *      description: Unauthorized — Invalid or missing token
 */
router.post("/logout", authenticateUser, logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current authenticated user data
 *       401:
 *         description: Unauthorized — Invalid or missing token
 */
router.get("/me", authenticateUser, currentUser);


module.exports = router;
