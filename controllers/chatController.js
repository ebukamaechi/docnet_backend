const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

exports.startConversation = async (req, res) => {
  try {
    // req.body or req.params
    const { recipientId } = req.params;
    const senderId = req.user.id;

    //if it exists, return the conversation
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, recipientId] },
    });

    //if no conversation exists, start a new one
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
exports.deleteConversation = async (req, res)=>{
  try {
    const {conversationId}=req.params;
    const userId = req.user.id;
    const conversation = await Conversation.findById(conversationId);
    if(!conversation) return res.status(404).json({message:"Conversation not found"});
    if(!conversation.members.includes(userId)) {
      return res.status(403).json({message:"You are not authorized to delete this conversation"});

    }
    await Conversation.findByIdAndDelete(conversationId);
    await Message.deleteMany({conversationId});
    res.status(200).json({message:"Conversation deleted successfully"});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({message:`Could not delete conversation: ${error.message}`});
  }
};
