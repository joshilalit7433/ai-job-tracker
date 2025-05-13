import { User } from "../models/user.model.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, mobilenumber, role } = req.body;
    console.log(fullname, email, password, mobilenumber, role);

    if (!fullname || !email || !password || !mobilenumber || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "user already exists with this email",
        success: false,
      });
    }

    const hashedpassword = await bycrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      password: hashedpassword,
      mobilenumber,
      role,
    });

    return res.status(201).json({
      message: "account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const ispaswordmatch = await bycrypt.compare(password, user.password);

    if (!ispaswordmatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokendata = {
      userid: user._id,
    };

    const token = await jwt.sign(tokendata, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobilenumber: user.mobilenumber,
      role: user.role,
      createdAt: user.createdAt
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Strict",
      })
      .json({
        message: `welcome back ${user.fullname} `,
        user,
        // token,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, mobilenumber } = req.body;

    const userId = req.user._id; // middleware authentication
    console.log("user id", userId);
    let user = await User.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }
    // updating data
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (mobilenumber) user.mobilenumber = mobilenumber;

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobilenumber: user.mobilenumber,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};



export const UploadResume = async (req, res) => {
  try {
    console.log("File received:", req.file);
    console.log("User:", req.user);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    user.resume = req.file.path;
    await user.save();

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resume: user.resume,
      success: true,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return res.status(500).json({
      message: "Server error while uploading resume",
      success: false,
    });
  }
};
