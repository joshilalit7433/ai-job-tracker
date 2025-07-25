import {Schema,model} from "mongoose";
import { IApplicant } from "../types/applicant.types";

const ApplicantSchema = new Schema<IApplicant>({
  job: {
    type:Schema.Types.ObjectId,
    ref: "JobApplication",
    required: true,
  },
  user: {
    type:Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "interview", "rejected", "shortlisted","hired"],
    default: "pending",
  },
  coverLetter: {
    type: String,
    required: true,
  },
  recruiterResponse: {
    type: String,
    default: "",
  },
  matchedSkills:{
    type:[String],
    default: [],
  },
  missingSkills:{
    type:[String],
    default: [],
  },
  respondedAt: {
    type: Date,
  }
},{timestamps:true});

export const Applicant =model<IApplicant>("Applicant", ApplicantSchema);
