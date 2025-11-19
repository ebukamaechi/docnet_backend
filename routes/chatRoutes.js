const express = require("express");
const {
  startConversation,
  getConversationMessages,
  getUserConversations,
  sendMessage,
  markMessageSeen,
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
router.get(
  "/conversations/:conversationId/messages",
  authenticateUser,
  getConversationMessages
);
router.post("/messages/:messageId/seen", authenticateUser, markMessageSeen);
router.post("/conversations", authenticateUser, startConversation);
router.post("/send", authenticateUser, sendMessage);


router.get("/conversations", authenticateUser, getUserConversations);

module.exports = router;
