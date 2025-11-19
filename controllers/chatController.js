const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

exports.startConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.user.id;

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, recipientId] },
    });
    if (!conversation) {
      conversation = new Conversation({
        members: [senderId, recipientId],
      });
      await conversation.save();
    }
    res.status(200).json({ conversation });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Could not create conversation: ${error.message}` });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({
      members: userId,
    })
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .limit(100);
    res.status(200).json({ conversations });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Could not fetch conversations: ${error.message}` });
  }
};

exports.getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Could not fetch conversation messages: ${error.message}`,
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text, messageType } = req.body;
    const senderId = req.user.id;
    const mediaUrl = req.body.mediaUrl || null;

    const newMessage = new Message({
      conversationId,
      sender: senderId,
      text,
      messageType: messageType || (mediaUrl ? "image" : "text"),
      mediaUrl,
    });
    await newMessage.save();
    //update last message in conversation
    await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: newMessage._id },
      { new: true }
    );
    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Could not send message: ${error.message}` });
  }
};

exports.markMessageSeen = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.sender.toString() === userId) {
      return res
        .status(400)
        .json({ message: "Cannot mark your own message as seen" });
    }
    message.seen = true;
    await message.save();
    res.status(200).json({ message: "Message marked as seen" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Could not mark message as seen: ${error.message}` });
  }
};

// delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await message.findByIdAndDelete(messageId);
    if (!message) {
      res.status(400).json({ message: "could not delete message" });
    }
    res.status(200).json({ message: "message deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Could not delete message: ${error.message}` });
  }
};
// delete conversation
