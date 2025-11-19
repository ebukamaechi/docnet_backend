const express = require('express');
const {updateSpecialty, getMedicalSpecialties,uploadProfilePicture} = require("../controllers/userController");
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
router.get("/specialties", getMedicalSpecialties);
router.put("/profile-picture", authenticateUser, upload.single("profileImage") ,uploadProfilePicture);
module.exports = router;