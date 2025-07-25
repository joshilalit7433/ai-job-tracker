import { Request } from "express";

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: number;
  role: string;
  resume?: string;
  coverLetter?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
