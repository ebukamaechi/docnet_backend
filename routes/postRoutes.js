const express = require("express");

const { createPost } = require("../controllers/postsController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const upload = require("../middlewares/upload");

const router = express.Router();
/**
 * @swagger
 * tags:
 *  name: Feed
 *  description: Feed and Posts related routes
 */


/**
 * @swagger
 * /api/posts:
 *   post:
 *     tags:
 *       - [Posts]
 *     summary: Create a new post
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My first post"
 *               content:
 *                 type: string
 *                 example: "This is the body of the post..."
 *               tags:
 *                 type: string
 *                 example: "tech, coding"
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request, missing fields
 *       500:
 *         description: Internal server error
 */

router.post("/", authenticateUser, upload.array("media", 5), createPost);


module.exports = router;
