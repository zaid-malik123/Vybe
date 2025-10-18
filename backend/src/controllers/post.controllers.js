import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { uploadImage } from "../service/imageKit.service.js";

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
      media,
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
    const post = await Post.find({ author: req.userId })
      .populate("author")
      .sort({ createdAt: -1 });

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const {postId} = req.params // frontend se postId ayega
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
    }

    await post.save();

    // Populate author & likes (optional, for frontend)
    const updatedPost = await Post.findById(postId)
      .populate("author")
      .populate("likes");

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const commentPost = async () => {
  try {
    const { comment } = req.body;
    const { postId } = req.params;
    const userId = req.userId;

    if (!comment || comment.trim() != "") {
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
    await post.save();
    const updatedPost = await Post.findById(postId)
      .populate("author")
      .populate("comments.author");
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

    const user = await User.findById(userId)
    if(!user){
        return res.status(400).json({message: "User not found"})
    }

    const isAlreadySaved = user.saved.includes(post._id)
    if(isAlreadySaved){
       user.saved.pull(post._id)
    }
    else{
      user.saved.push(post._id)
    }
    await user.save()
    const updatedUser = await User.findById(userId).populate("saved") 
    
    return res.status(200).json(updatedUser)


  } catch (error) {
    console.log(error);
  }
};
