import { Request } from "express";
import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  mobileNumber: number;
  role: "user" | "recruiter" | "admin";
  resume?: string;
  coverLetter?: string;
  savedJobs: string[]; 
  totalJobsPosted: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Request {
  params: { id: any; };
  user?: IUser;
  file?: Express.Multer.File;
}
