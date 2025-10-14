import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { genToken } from "../utils/Token.js";

export const signup = async (req, res, next) => {
  try {
    const { name, userName, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already registered" });
    }

    const username = await User.findOne({ userName });
    if (username) {
      return res.status(400).json({ message: "username already exist" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be atleast 6 characters" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      name,  
      userName,
      email,
      password: hashed,
    });
    const token = genToken(createdUser._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(201).json(  createdUser );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(400).json({ message: "password is incorrect" });
    }

    const token = genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json( user );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "logout Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

