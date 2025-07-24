import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express/AuthRequest.js";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies.token;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated. Token missing.",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as {
      userid: string;
    };

    const user = await User.findById(decoded.userid).select(
      "_id fullname email mobilenumber role resume cover_letter"
    );

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
      resume: user.resume,
      cover_letter: user.cover_letter,
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
      error: error.message,
    });
  }
};

export default isAuthenticated;
