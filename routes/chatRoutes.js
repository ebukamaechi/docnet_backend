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
router.get(
  "/conversations/:conversationId/messages",
  authenticateUser,
  getConversationMessages
);
router.delete("/messages/:messageId", authenticateUser, deleteMessage);
router.delete("/conversations/:conversationId", authenticateUser, deleteConversation);


router.post("/messages/:messageId/seen", authenticateUser, markMessageSeen);
router.post("/conversations/start/:recipientId", authenticateUser, startConversation);
router.post("/messages/send", authenticateUser, sendMessage);

router.get("/conversations", authenticateUser, getUserConversations);

module.exports = router;
