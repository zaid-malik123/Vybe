import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { uploadImage } from "../service/imageKit.service.js";
import { sendMail } from "../service/mail.service.js";
import bcrypt from "bcrypt";
import { getSocketId, io } from "../socket/socket.js";

export const currUser = async (req, res, next) => {
  try {
    const id = req.userId;

    const user = await User.findById(id)
      .select("-password")
      .populate({
        path: "posts",
        populate: [
          { path: "author", select: "name userName profileImage" },
          { path: "comments.author", select: "name userName profileImage" },
        ],
      })
      .populate({
        path: "saved",
        populate: { path: "author", select: "name userName profileImage" },
      })
      .populate({
        path: "reels",
        populate: { path: "author", select: "name userName profileImage" },
      })
      .populate("following");
    if (!user) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "This email does not exist" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // expires in 5 mins
    user.isOtpVerified = false;

    await user.save();
    await sendMail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otp || otp.length !== 4) {
      return res.status(400).json({ message: "Invalid OTP format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required" });
    }

    const hash = await bcrypt.hash(password, 10);

    user.password = hash;
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } })
      .select("-password")
      .limit(5);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, userName, gender, profileImage, bio, profession } = req.body;

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const sameUserName = await User.findOne({ userName }).select("-password");
    if (sameUserName && sameUserName._id.toString() !== req.userId) {
      return res.status(400).json({ message: "userName already exists" });
    }

    let img;
    if (req.file) {
      img = await uploadImage(req.file);
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.gender = gender || user.gender;
    user.userName = userName || user.userName;
    user.profileImage = img?.url || user.profileImage;
    user.profession = profession || user.profession;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userName } = req.params;

    if (!userName) {
      return res.status(400).json({ message: "userName must be valid" });
    }

    const user = await User.findOne({ userName })
      .select("-password")
      .populate([
        {
          path: "posts",
          populate: [
            { path: "author", select: "name userName profileImage" },
            { path: "comments.author", select: "name userName profileImage" },
          ],
        },
        {
          path: "saved",
          populate: [
            { path: "author", select: "name userName profileImage" },
            { path: "comments.author", select: "name userName profileImage" },
          ],
        },
        {
          path: "reels",
          populate: { path: "author", select: "name userName profileImage" },
        },
        { path: "followers", select: "name userName profileImage" },
        { path: "following", select: "name userName profileImage" },
      ]);

    if (!user) {
      return res.status(400).json({ message: "userName does not exist" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { targetUserId } = req.params;

    if (!targetUserId) {
      return res.status(400).json({ message: "Targeted User not found" });
    }

    if (userId === targetUserId) {
      return res.status(400).json({ message: "Do not follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ message: "User or targeted user not found" });
    }

    // Unfollow
    if (user.following.includes(targetUser._id)) {
      user.following = user.following.filter(
        (u) => u.toString() !== targetUser._id.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        (u) => u.toString() !== user._id.toString()
      );

      await user.save();
      await targetUser.save();

      return res.status(200).json({ message: "Unfollow", user });
    }

    // Follow
    user.following.push(targetUser._id);
    targetUser.followers.push(user._id);

    if (targetUser._id != userId) {
      const notification = await Notification.create({
        sender: userId,
        reciever: targetUser._id,
        type: "follow",
        message: "started following you",
      });

      const populatedNotification = await Notification.findById(
        notification._id
      ).populate("sender reciever");
      const recieverSocketId = getSocketId(targetUser._id);
      if (recieverSocketId) {
        io.to(recieverSocketId).emit("newNotification", populatedNotification);
      }
    }

    await user.save();
    await targetUser.save();

    return res.status(200).json({ message: "Follow", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const followingList = async (req, res) => {
  try {
    const result = await User.findById(req.userId);
    return res.status(200).json(result.following);
  } catch (error) {
    console.log(error);
  }
};

export const search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const result = await User.find({
      $or: [
        { userName: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getAllNotification = async (req, res)=>{
try {
  const notification = await Notification.find({
    reciever: req.userId
  }).populate("sender reciever post reel").sort({createdAt:-1})

  return res.status(200).json(notification)
} catch (error) {
  console.log(error)
}
}

export const markAsRead = async (req, res)=>{
  try {
    const {notificationId} = req.body;
    
    const notification = await Notification.findById(notificationId)

    if(Array.isArray(notificationId)){
      await Notification.updateMany(
        {_id: {$in: notificationId}, reciever: req.userId},
        {$set: {isRead: true}}
      )
    }
    else{
      await Notification.findOneAndUpdate(
        {_id: notificationId, reciever: req.userId},
        {$set: {isRead: true}}
      )
    }
    return res.status(200).json({message: "Mark as read"}) 
  } catch (error) {
    console.log(error)
  }
}