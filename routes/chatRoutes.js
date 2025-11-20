const express = require("express");
const {
  startConversation,
  getConversationMessages,
  getUserConversations,
  sendMessage,
  markMessageSeen,
  deleteMessage,
  deleteConversation,
} = require("../controllers/chatController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: User chat routes
 */

//

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/messages:
 *   get:
 *     summary: Get all messages in a conversation
 *     description: Retrieves all messages belonging to a specific conversation for the authenticated user.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the conversation.
 *         example: "675cfb223cf6bb2a643e7812"
 *     responses:
 *       200:
 *         description: List of messages retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversationId:
 *                   type: string
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       sender:
 *                         type: string
 *                       text:
 *                         type: string
 *                       messageType:
 *                         type: string
 *                         example: text
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Invalid conversation ID.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       404:
 *         description: Conversation not found.
 *       500:
 *         description: Server error.
 */
router.get(
  "/conversations/:conversationId/messages",
  authenticateUser,
  getConversationMessages
);


/**
 * @swagger
 * /api/chat/messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     description: Deletes a specific message sent or received by the authenticated user.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to delete.
 *         example: "675d0a8f4cf6bb2a643e7890"
 *     responses:
 *       200:
 *         description: Message deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message deleted successfully
 *       400:
 *         description: Invalid message ID.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       404:
 *         description: Message not found.
 *       500:
 *         description: Server error.
 */
router.delete("/messages/:messageId", authenticateUser, deleteMessage);


/**
 * @swagger
 * /api/chat/conversations/{conversationId}:
 *   delete:
 *     summary: Delete a conversation
 *     description: Deletes a conversation for the authenticated user. This may soft-delete or fully remove depending on backend implementation.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the conversation to delete.
 *         example: "675cfb223cf6bb2a643e7812"
 *     responses:
 *       200:
 *         description: Conversation deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conversation deleted successfully
 *       400:
 *         description: Invalid conversation ID.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       404:
 *         description: Conversation not found.
 *       500:
 *         description: Server error.
 */
router.delete("/conversations/:conversationId", authenticateUser, deleteConversation);


/**
 * @swagger
 * /api/chat/messages/{messageId}/seen:
 *   post:
 *     summary: Mark a message as seen
 *     description: Marks a specific message as seen by the authenticated user.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to mark as seen.
 *         example: "675cfa8b3cf6bb2a643e7801"
 *     responses:
 *       200:
 *         description: Message marked as seen successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message marked as seen
 *                 updatedMessage:
 *                   type: object
 *       400:
 *         description: Invalid message ID.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       404:
 *         description: Message not found.
 *       500:
 *         description: Server error.
 */
router.post("/messages/:messageId/seen", authenticateUser, markMessageSeen);

/**
 * @swagger
 * /api/chat/conversations/start/{recipientId}:
 *   post:
 *     summary: Start a new conversation with another user
 *     description: Creates a conversation between the authenticated user and the recipient. If a conversation already exists, it will return the existing one.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user you want to start a conversation with.
 *         example: "675cfa8b3cf6bb2a643e7812"
 *     responses:
 *       201:
 *         description: Conversation created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversation:
 *                   type: object
 *                   description: Newly created or existing conversation details.
 *       200:
 *         description: Conversation already exists.
 *       400:
 *         description: Invalid recipient ID.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       404:
 *         description: Recipient not found.
 *       500:
 *         description: Server error.
 */
router.post("/conversations/start/:recipientId", authenticateUser, startConversation);



/**
 * @swagger
 * /api/chat/messages/send:
 *   post:
 *     summary: Send a message in a conversation
 *     description: Allows an authenticated user to send a message to an existing conversation.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - text
 *             properties:
 *               conversationId:
 *                 type: string
 *                 example: "675d24e7c6d9f5caa884b9c3"
 *               text:
 *                 type: string
 *                 example: "Hello, how are you?"
 *               messageType:
 *                 type: string
 *                 description: Type of message
 *                 enum: [text, image, video, file]
 *                 default: text
 *                 example: text
 *     responses:
 *       201:
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   description: Message details.
 *                 info:
 *                   type: string
 *                   example: "Message delivered"
 *       400:
 *         description: Validation error or invalid conversation ID.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       404:
 *         description: Conversation not found.
 *       500:
 *         description: Server error.
 */
router.post("/messages/send", authenticateUser, sendMessage);


/**
 * @swagger
 * /api/chat/conversations:
 *   get:
 *     summary: Get all user conversations
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All user conversations fetched
 *       401:
 *         description: Unauthorized — Invalid or missing token
 */
router.get("/conversations", authenticateUser, getUserConversations);

module.exports = router;
