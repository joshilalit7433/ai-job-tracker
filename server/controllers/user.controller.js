import { User } from "../models/user.model.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JobApplication } from "../models/jobApplication.model.js";

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
      role:user.role
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

    console.log("user is", user);
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Lax",
        secure:false
      })
      .json({
        message: `welcome back ${user.fullname} `,
        user,
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

    const userId = req.user._id; 
    console.log("user id", userId);
    let user = await User.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }
  
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (mobilenumber) user.mobilenumber = mobilenumber;

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobilenumber: user.mobilenumber,
       createdAt: user.createdAt
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

    const resumePath = req.file.path.replace(/\\/g, "/"); 

    user.resume = resumePath;;
    await user.save();

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resume: user.resume,
      user,
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





export const saveJob = async (req, res) => {
  const { jobId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user || req.user.role !== "user") {
    return res.status(403).json({
      message: "Access denied. Only users can access",
      success: false,
    });
  }

  if (!user.savedJobs.includes(jobId)) {
    user.savedJobs.push(jobId);
    await user.save();
  }

  
  const jobDetails = await JobApplication.findById(jobId);

  if (!jobDetails) {
    return res.status(404).json({
      message: "Job not found",
      success: false,
    });
  }

  return res.status(200).json({
    message: "Job saved!",
    success: true,
    job: jobDetails,
  });
};



export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only users can unsave jobs.",
      });
    }

    
    user.savedJobs = user.savedJobs
      .filter(id => id && id.toString() !== jobId);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Job removed from saved list!",
    });
  } catch (error) {
    console.error("Error unsaving job:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while removing saved job.",
    });
  }
};




export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedJobs");

    if (!user || user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only users can view saved jobs.",
      });
    }

    if (!user.savedJobs || user.savedJobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No saved jobs found.",
        savedJobs: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Saved jobs retrieved successfully.",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving saved jobs.",
    });
  }
};
