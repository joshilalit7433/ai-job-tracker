import { Request } from "express";

export interface AuthUser {
  _id: string;
  fullname: string;
  email: string;
  mobilenumber: number;
  role: string;
  resume?: string;
  cover_letter?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
