
import { Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  mobileNumber: number;
  role: "user" | "recruiter" | "admin";
  resume?: string;
  coverLetter?: string;
  resumeAnalysis?: string;
  savedJobs: string[]; 
  totalJobsPosted: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
  file?: Express.Multer.File;
}
