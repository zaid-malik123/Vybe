import User from "../models/user.model.js";
import { uploadImage } from "../service/imageKit.service.js";
import { sendMail } from "../service/mail.service.js";
import bcrypt from "bcrypt";

export const currUser = async (req, res, next) => {
  try {
    const id = req.userId;

    const user = await User.findById(id).select("-password");

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
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "-password"
    );
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, userName, gender, profileImage, bio } = req.body;

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

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
try {
  const { userName } = req.params;
  
  if(!userName){
    return res.status(400).json({message: "userName must be valid"})
  }
  
 const user = await User.findOne({userName}).select("-password")
 if(!user){
    return res.status(400).json({message: "userName does not exist"})
  }

  return res.status(200).json(user)
} catch (error) {
  console.log(error)
}
}

