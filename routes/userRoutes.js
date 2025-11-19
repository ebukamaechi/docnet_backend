const express = require('express');
const {updateSpecialty,
    //  getMedicalSpecialties,
     uploadProfilePicture} = require("../controllers/userController");
const {authenticateUser} = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management routes
 */

// router.get('/');
router.put("/update-specialty", authenticateUser, updateSpecialty);
// router.get("/specialties", getMedicalSpecialties);

/**
 * @swagger
 * /api/users/profile-picture:
 *   put:
 *     summary: Upload or update a user's profile picture
 *     description: Uploads a new profile picture, applies transformations, deletes any existing one, and updates the user's profileImage field.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profileImage
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Profile picture updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile picture updated
 *                 profileImage:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: https://res.cloudinary.com/.../image.jpg
 *                     public_id:
 *                       type: string
 *                       example: profile_pictures/abc123
 *       400:
 *         description: No file uploaded or invalid input.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       500:
 *         description: Server error during upload.
 */
router.put("/profile-picture", authenticateUser, upload.single("profileImage") ,uploadProfilePicture);
module.exports = router;