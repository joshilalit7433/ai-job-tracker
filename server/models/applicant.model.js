import mongoose from "mongoose";

const ApplicantSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobApplication",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobilenumber: {
    type: Number,
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "interview", "rejected", "accepted"],
    default: "pending",
  },
  cover_letter: {
    type: String,
    required: true
  }
});

export const Applicant = mongoose.model("Applicant", ApplicantSchema);
