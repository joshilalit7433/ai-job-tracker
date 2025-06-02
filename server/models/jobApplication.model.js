import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    job_type: {
      type: String,
      enum: ["part-time", "full-time"],
      default: "full-time",
    },
    benefits: {
      type: String,
      required: false,
    },
    experience: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
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
    isApproved: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export const JobApplication = mongoose.model(
  "JobApplication",
  JobApplicationSchema
);
