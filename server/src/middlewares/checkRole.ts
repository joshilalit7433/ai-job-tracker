import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express/AuthRequest"; 

export const checkRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        message: `Access denied. Only ${role}s are allowed.`,
        success: false,
      });
    }
    next();
  };
};
