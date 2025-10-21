import Reel from "../models/reels.model.js";
import User from "../models/user.model.js";
import { uploadImage } from "../service/imageKit.service.js";

// Upload Reel
export const uploadReel = async (req, res) => {
  try {
    const { caption } = req.body;
    //   console.log("this is caption", caption)
    // console.log("this is file", req.file)

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const media = await uploadImage(req.file);
    // console.log("This data is when vedio is uploaded on imagekit", media)

    const reel = await Reel.create({
      caption,
      media: media.url,
      author: req.userId,
    });
    //  console.log("This data is created in data base --->", reel)
    // Add reel to user's Reels array
    const user = await User.findById(req.userId);
    user.reels.push(reel._id);
    await user.save();

    const populatedReel = await Reel.findById(reel._id).populate("author");

    return res.status(201).json(populatedReel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Like / Unlike Reel
export const likeReel = async (req, res) => {
  try {
    const { reelId } = req.params; // frontend se reelId ayega
    const userId = req.userId;

    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    const isLiked = reel.likes.includes(userId);

    if (isLiked) {
      reel.likes.pull(userId); // unlike
    } else {
      reel.likes.push(userId); // like
    }

    await reel.save();

    const updatedReel = await Reel.findById(reelId)
      .populate("author")
      .populate("likes");

    return res.status(200).json(updatedReel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Comment on Reel
export const commentReel = async (req, res) => {
  try {
    const { comment } = req.body;
    console.log(comment)
    const { reelId } = req.params;
    const userId = req.userId;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Comment is required" });
    }

    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    reel.comments.push({
      author: userId,
      comment,
    });

    await reel.save();

    const updatedReel = await Reel.findById(reelId)
      .populate("author")
      .populate("comments.author");

    return res.status(201).json(updatedReel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllReels = async (req, res) => {
  try {
    const reel = await Reel.find({})
      .populate("author")
      .populate("comments.author");
    return res.status(200).json(reel);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
