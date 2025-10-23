import Story from "../models/story.model.js";
import User from "../models/user.model.js";
import { uploadImage } from "../service/imageKit.service.js";

export const createStory = async (req, res) => {
  try {
    const userId = req.userId;
    const { mediaType } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.story) {
      await Story.findByIdAndDelete(user.story);
      user.story = null;
    }

    let media;

    if (req.file) {
      media = await uploadImage(req.file);
    }
    const story = await Story.create({
      author: userId,
      mediaType,
      media: media.url,
    });

    user.story = story._id;
    await user.save();

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    return res.status(201).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.userId;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(400).json({ message: "Story not found" });
    }

    // ✅ Author check (convert ObjectId → string)
    if (story.author.toString() !== userId) {
      const alreadySeen = story.viewers.includes(userId);
      if (!alreadySeen) {
        story.viewers.push(userId);
      }
    }

    await story.save();

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    return res.status(200).json(populatedStory);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getStoryByUsername = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const story = await Story.findOne({ author: user._id })
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");
    if (!story) {
      return res.status(400).json({ message: "Story not found" });
    }
    return res.status(200).json(story);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllStory = async (req, res) => {
  try {
    const currUser = req.userId;
    const user = await User.findById(currUser);
    if (!user) {
      return res.status(400).json("User not found");
    }

    const followingIds = user.following;
    const stories = await Story.find({ author: { $in: followingIds } })
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    console.log(error);
  }
};
