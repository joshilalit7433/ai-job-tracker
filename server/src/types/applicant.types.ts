import { Document, Types } from "mongoose";

export interface ResumeAnalysis {
  name: string;
  education: string[];
  projects: string[];
  resumeScore: number;
  keyQualificationsMatched: string[];
  skillsNotBackedByExperience: string[];
  suitableJobRoles: string[];
  recommendations: {
    strengthenTechnicalAlignment: string[];
    highlightEngineeringPrinciples: string[];
    improveResumeStructure: string[];
    tailorSummary: string[];
    addMetricsToProjects: string[];
  };
  finalNotes: string;
  analyzedAt: Date;
}

export interface IApplicant extends Document {
  job: Types.ObjectId;
  user: Types.ObjectId;
  fullName: string;
  email: string;
  mobileNumber: number;
  resume: string;
  appliedAt: Date;
  status: "pending" | "interview" | "rejected" | "shortlisted" | "hired";
  coverLetter: string;
  recruiterResponse: string;
  matchedSkills: string[];
  missingSkills: string[];
  respondedAt?: Date;
  resumeAnalysis?: ResumeAnalysis;
}
