import { User } from "../models/user.model.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JobApplication } from "../models/jobApplication.model.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, mobilenumber, role } = req.body;

    if (!fullname || !email || !password || !mobilenumber || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bycrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      password: hashedPassword,
      mobilenumber,
      role,
    });

    return res
      .status(201)
      .json({ message: "Account created successfully", success: true });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password", success: false });
    }

    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch || user.role !== role) {
      return res
        .status(401)
        .json({
          message: "Invalid credentials or role mismatch",
          success: false,
        });
    }

    const token = jwt.sign(
      { userid: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobilenumber: user.mobilenumber,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: userData,
        token,
        success: true,
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, mobilenumber } = req.body;
    const user = await User.findById(req.user._id);

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (mobilenumber) user.mobilenumber = mobilenumber;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        mobilenumber: user.mobilenumber,
        createdAt: user.createdAt,
      },
      success: true,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const UploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const resumePath = req.file.path.replace(/\\/g, "/");
    user.resume = resumePath;
    await user.save();

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resume: user.resume,
      user,
      success: true,
    });
  } catch (error) {
    console.error("Upload Resume Error:", error);
    return res
      .status(500)
      .json({ message: "Error uploading resume", success: false });
  }
};

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    const job = await JobApplication.findById(jobId);
    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });

    return res.status(200).json({ message: "Job saved!", job, success: true });
  } catch (error) {
    console.error("Save Job Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user._id);

    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    await user.save();

    return res
      .status(200)
      .json({ message: "Job removed from saved list", success: true });
  } catch (error) {
    console.error("Unsave Job Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
const user = await User.findById(req.user._id).populate("savedJobs").lean();

    return res.status(200).json({
      message: "Saved jobs retrieved successfully",
      savedJobs: user.savedJobs || [],
      success: true,
    });
  } catch (error) {
    console.error("Get Saved Jobs Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
