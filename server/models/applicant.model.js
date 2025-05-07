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
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "interview", "rejected", "accepted"],
    default: "pending",
  }
});

export const Applicant = mongoose.model("Applicant", ApplicantSchema);
