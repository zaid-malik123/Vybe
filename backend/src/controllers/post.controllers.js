import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { uploadImage } from "../service/imageKit.service.js";
import { getSocketId, io } from "../socket/socket.js";

export const uploadPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;
    let media;
    if (req.file) {
      media = await uploadImage(req.file);
    } else {
      return res.status(400).json({ message: "File is required" });
    }

    const post = await Post.create({
      caption,
      mediaType,
      media: media.url,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    user.posts.push(post._id);
    await user.save();

    const populatedPost = await Post.findById(post._id).populate("author");

    return res.status(201).json(populatedPost);
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const post = await Post.find({})
      .populate("author")
      .populate("comments.author")
      .sort({ createdAt: -1 });

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params; // frontend se postId ayega
    const userId = req.userId; // middleware se logged-in user ka id

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if already liked
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike
      post.likes.pull(userId);
    } else {
      // Like
      post.likes.push(userId);
      if(post.author._id != userId){
        const notification = await Notification.create({
          sender: userId,
          reciever: post.author._id,
          type: "like",
          post: post._id,
          message: "liked your post"
        })

        const populatedNotification = await Notification.findById(notification._id)
        .populate("sender reciever post")
        const recieverSocketId = getSocketId(post.author._id)
        if(recieverSocketId){
          io.to(recieverSocketId).emit("newNotification", populatedNotification)
        }
      }
    }

    await post.save();

    // Populate author & likes (optional, for frontend)
    const updatedPost = await Post.findById(postId)
      .populate("author")
      .populate("likes");

    io.emit("likePost", {
      postId: post._id,
      likes: post.likes,
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { comment } = req.body;
    console.log(req.body);
    const { postId } = req.params;
    const userId = req.userId;

    if (!comment || comment.trim() == "") {
      return res.status(400).json({ message: "comment is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      author: userId,
      comment,
    });
    if(post.author._id != userId){
        const notification = await Notification.create({
          sender: userId,
          reciever: post.author._id,
          type: "comment",
          post: post._id,
          message: "comment your post"
        })

        const populatedNotification = await Notification.findById(notification._id)
        .populate("sender reciever post")
        const recieverSocketId = getSocketId(post.author._id)
        if(recieverSocketId){
          io.to(recieverSocketId).emit("newNotification", populatedNotification)
        }
      }
    await post.save();
    const updatedPost = await Post.findById(postId)
      .populate("author", "profileImage userName name")
      .populate("comments.author");

    io.emit("commentPost", {
      postId: post._id,
      comments: post.comments,
    });

    return res.status(201).json(updatedPost);
  } catch (error) {
    console.log(error);
  }
};

export const savePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isAlreadySaved = user?.saved.some(
      (id) => id.toString() === post._id.toString()
    );
    if (isAlreadySaved) {
      user.saved.pull(post._id);
    } else {
      user.saved.push(post._id);
    }
    await user.save();
    const updatedUser = await User.findById(userId).populate("saved");

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
  }
};
