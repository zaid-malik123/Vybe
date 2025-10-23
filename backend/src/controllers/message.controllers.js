import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { uploadImage } from "../service/imageKit.service.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { reciever } = req.params;
    const { message } = req.body;

    if (!reciever || !message) {
      return res
        .status(400)
        .json({ message: "Message and receiver are required" });
    }

    // Handle image upload if present
    let image;
    if (req.file) {
      const uploaded = await uploadImage(req.file);
      image = uploaded?.url;
    }

    // Create new message
    const newMessage = await Message.create({
      sender,
      reciever,
      message,
      image: image || undefined,
    });

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, reciever] },
    });

    // If conversation doesn't exist, create new
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, reciever],
        messages: [newMessage._id],
      });
    } else {
      // Push new message to existing conversation
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllMessages = async () => {
  try {
    const sender = req.userId
    const {reciever} = req.params
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, reciever] },
    }).populate("messages")

    if(!conversation){
        return res.status(400).json({message: "conversation not found"})
    }
    return res.status(200).json(conversation.messages)

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
