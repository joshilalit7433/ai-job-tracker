
import { Document } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  mobilenumber: number;
  role: "user" | "recruiter" | "admin";
  resume?: string;
  cover_letter?: string;
  resume_analysis?: string;
  savedJobs: string[]; 
  totalJobsPosted: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
  file?: Express.Multer.File;
}
