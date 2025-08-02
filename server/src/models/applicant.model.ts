import { Schema, model, Types } from "mongoose";
import { IApplicant, ResumeAnalysis } from "../types/applicant.types";


const ResumeAnalysisSchema = new Schema<ResumeAnalysis>(
  {
    name: { type: String, required: true },
    education: { type: [String], required: true },
    projects: { type: [String], required: true },
    resumeScore: { type: Number, required: true },
    keyQualificationsMatched: { type: [String], required: true },
    skillsNotBackedByExperience: { type: [String], required: true },
    suitableJobRoles: { type: [String], required: true },
    recommendations: {
      strengthenTechnicalAlignment: { type: [String], default: [] },
      highlightEngineeringPrinciples: { type: [String], default: [] },
      improveResumeStructure: { type: [String], default: [] },
      tailorSummary: { type: [String], default: [] },
      addMetricsToProjects: { type: [String], default: [] },
    },
    finalNotes: { type: String, required: true },
    analyzedAt: { type: Date, default: Date.now },
  },
  { _id: false } 
);

const ApplicantSchema = new Schema<IApplicant>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "JobApplication",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    resume: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "interview", "rejected", "shortlisted", "hired"],
      default: "pending",
    },
    coverLetter: { type: String, required: true },
    recruiterResponse: { type: String, default: "" },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    respondedAt: { type: Date },
    resumeAnalysis: {
      type: ResumeAnalysisSchema,
      default: null,
    },
  },
  { timestamps: true }
);

export const Applicant = model<IApplicant>("Applicant", ApplicantSchema);
