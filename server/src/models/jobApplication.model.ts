import { Schema, model } from "mongoose";
import { IJobApplication } from "../types/jobApplication.types";

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    salary: { type: Number, required: true },
    location: { type: String, required: true },
    company_name: { type: String, required: true },
    job_type: {
      type: String,
      enum: ["part-time", "full-time"],
      default: "full-time",
    },
    benefits: { type: String },
    experience: { type: String, required: true },
    responsibilities: { type: String, required: true },
    skills: { type: [String], required: true },
    qualification: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "applied",
        "interviewing",
        "offered",
        "rejected",
        "open",
        "closed",
      ],
      default: "open",
    },
    isApproved: { type: Boolean, default: false },
    image: { type: String },
    jobCategory: {
      type: String,
      enum: [
        "Information Technology (IT)",
        "Human Resources (HR)",
        "Finance & Accounting",
        "Marketing & Advertising",
        "Customer Service",
        "Product Management",
        "Design & Creative",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export const JobApplication = model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema
);
