import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/user.types";

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    mobileNumber: { type: Number },
    role: { type: String, enum: ["user", "recruiter", "admin"], required: true },
    resume: { type: String },
    coverLetter: { type: String },
    savedJobs: [{ type:Schema.Types.ObjectId, ref: "JobApplication" }],
    totalJobsPosted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
