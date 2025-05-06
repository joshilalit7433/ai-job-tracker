import { User } from "../server/models/user.model..js";
import jwt from "jsonwebtoken";

export const isAdmin = async (req, res,next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        message: "please login to access this resource",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.userid);

    if (!user) {
      return res.status(400).json({
        message: "user not found",
        success: false,
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "access denied only admin can access this resource",
        success: false,
      });
    }

    req.id = user._id;
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "invalid or expired token",
      success: false,
    });
  }
};

export default isAdmin;
