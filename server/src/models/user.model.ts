import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/user.types";

const UserSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobilenumber: { type: Number, required: true },
    role: { type: String, enum: ["user", "recruiter", "admin"], required: true },
    resume: { type: String },
    cover_letter: { type: String },
    resume_analysis: { type: String, default: "" },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobApplication" }],
    totalJobsPosted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
