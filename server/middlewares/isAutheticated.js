import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    const user = await User.findById(decoded.userid).select("_id fullname email mobilenumber role");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }


    req.user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobilenumber: user.mobilenumber,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error in authentication",
      success: false,
      error: error.message,
    });
  }
};

export default isAuthenticated;
