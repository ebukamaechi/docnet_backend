const express = require("express");
const {
  updateSpecialty,
  uploadProfilePicture,
  updateUsername,
  updateName,
  changePassword,
  updateUserRole,
  getUserDetails,
  deleteUserAccount,
  disableUserAccount,
  enableUserAccount,
  getUsersBySpecialty,
  updateBadges,
  updateBio,
  updateSocialLinks,
  updateUnreadMessages,
  searchUsers,
} = require("../controllers/userController");
const { authenticateUser, authorizeRoles } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management routes
 */

router.get("/user-details/:userId", authenticateUser, getUserDetails);

router.put(
  "/disable-account/:userId",
  authenticateUser,
  authorizeRoles("admin"),
  disableUserAccount
);
router.put(
  "/enable-account/:userId",
  authenticateUser,
  authorizeRoles("admin"),
  enableUserAccount
);
router.get("/by-specialty/:specialtyId", authenticateUser, getUsersBySpecialty);

router.get("/search", authenticateUser, searchUsers);
router.put("/update-specialty", authenticateUser, updateSpecialty);
// router.get("/specialties", getMedicalSpecialties);

/**
 * @swagger
 * /api/users/profile-picture:
 *   put:
 *     summary: Upload or update a user's profile picture
 *     description: Upload a new profile picture, apply transformations, delete any existing one, and update the profileImage field.
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
 *       400:
 *         description: No file uploaded or invalid input.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       500:
 *         description: Server error during upload.
 */

router.put(
  "/profile-picture",
  authenticateUser,
  upload.single("profileImage"),
  uploadProfilePicture
);

/**
 * @swagger
 * /api/users/username:
 *   put:
 *     summary: Update the user's username
 *     description: Allows an authenticated user to change their username.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: new_username123
 *     responses:
 *       200:
 *         description: Username updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                       example: new_username123
 *       400:
 *         description: Invalid input or username already taken.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       500:
 *         description: Server error.
 */
router.put("/username", authenticateUser, updateUsername);

/**
 * @swagger
 * /api/users/name:
 *   put:
 *     summary: Update the user's name
 *     description: Allows an authenticated user to change their name.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Victor Amaechi
 *     responses:
 *       200:
 *         description: Name updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Name updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                       example: Amaechi Victor
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       500:
 *         description: Server error.
 */
router.put("/name", authenticateUser, updateName);


/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change the authenticated user's password
 *     description: Allows a logged-in user to update their password using their current password.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword#2025
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Invalid request or incorrect current password.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       500:
 *         description: Server error.
 */
router.put("/change-password", authenticateUser, changePassword);

/**
 * @swagger
 * /api/users/update-role:
 *   put:
 *     summary: Update a user's role (Admin Only)
 *     description: Allows an admin to change another user's role.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - role
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 675c89f1b73c12a8df01b413
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: admin
 *     responses:
 *       200:
 *         description: User role updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User role updated successfully
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid input or role value.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       403:
 *         description: Forbidden - only admins can perform this action.
 *       500:
 *         description: Server error.
 */
router.put(
  "/update-role", 
  authenticateUser,
  authorizeRoles("admin"),
  updateUserRole
);
router.delete("/delete-account",authenticateUser, deleteUserAccount);
router.put("/update-badges",authenticateUser, updateBadges);
router.put("/update-bio",authenticateUser, updateBio);
router.put("/update-social-links",authenticateUser, updateSocialLinks);
router.put("/update-unread-messages",authenticateUser, updateUnreadMessages);


module.exports = router;
