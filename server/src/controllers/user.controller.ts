
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { JobApplication } from "../models/jobApplication.model";
import { AuthRequest } from "../types/express/AuthRequest";
import admin from "utils/firebase";


export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        avatar: picture,
        firebaseUID: uid,
        role: "applicant", 
        mobileNumber: "", 
      });
    }

    const token = jwt.sign(
      { userid: user._id, role: user.role },
      process.env.SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
      .json({ message: `Welcome ${user.fullName}`, data: userData, token, success: true });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({ message: "Google login failed", success: false });
  }
};


export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, mobileNumber, role } = req.body;

    if (!fullName || !email || !password || !mobileNumber || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ fullName, email, password: hashedPassword, mobileNumber, role });

    return res.status(201).json({ message: "Account created successfully", success: true });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password ) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password", success: false });
    }

  

    const token = jwt.sign(
      { userid: user._id, role: user.role },
      process.env.SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
      .json({ message: `Welcome back ${user.fullName}`,data: userData, token, success: true });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const logout = async (req: Request, res: Response) => {
  
  try {
    res.clearCookie("token").status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const GetUser = async (req: AuthRequest, res: Response) =>{
  try {
    const user=req.user;
    res.status(200).json({success:true,user});
    
  } catch (error) {
    res.status(403).json({success:false,message:"Unauthorized access"});
    
  }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, email, mobileNumber } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) return res.status(404).json({ message: "User not found", success: false });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (mobileNumber) user.mobileNumber = mobileNumber;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        createdAt: user.createdAt,
      },
      success: true,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const UploadResume = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    const resumePath = req.file?.path.replace(/\\/g, "/");
    if (resumePath) user.resume = resumePath;
    await user.save();

    return res.status(200).json({
      message: "Resume uploaded successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    console.error("Upload Resume Error:", error);
    return res.status(500).json({ message: "Error uploading resume", success: false });
  }
};

export const saveJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user?._id);

    if (!user) return res.status(404).json({ message: "User not found", success: false });

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    const job = await JobApplication.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found", success: false });

    return res.status(200).json({ message: "Job saved!", data:job, success: true });
  } catch (error) {
    console.error("Save Job Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const unsaveJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user?._id);

    if (!user) return res.status(404).json({ message: "User not found", success: false });

    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    await user.save();

    return res.status(200).json({ message: "Job removed from saved list", success: true });
  } catch (error) {
    console.error("Unsave Job Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getSavedJobs = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).populate("savedJobs").lean();

    if (!user) return res.status(404).json({ message: "User not found", success: false });

    return res.status(200).json({
      message: "Saved jobs retrieved successfully",
      data: user.savedJobs || [],
      success: true,
    });
  } catch (error) {
    console.error("Get Saved Jobs Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
