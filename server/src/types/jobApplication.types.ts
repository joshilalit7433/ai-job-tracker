import { Document, Types } from "mongoose";

export interface IJobApplication extends Document {
  user: Types.ObjectId;
  title: string;
  salary: number;
  location: string;
  company_name: string;
  job_type: "part-time" | "full-time";
  benefits?: string;
  experience: string;
  responsibilities: string;
  skills: string[];
  qualification: string;
  status: "applied" | "interviewing" | "offered" | "rejected" | "open" | "closed";
  isApproved: boolean;
  image?: string;
  jobCategory:
    | "Information Technology (IT)"
    | "Human Resources (HR)"
    | "Finance & Accounting"
    | "Marketing & Advertising"
    | "Customer Service"
    | "Product Management"
    | "Design & Creative";
  createdAt?: Date;
  updatedAt?: Date;
}
