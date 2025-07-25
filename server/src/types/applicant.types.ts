import { Document, Types } from "mongoose";

export interface IApplicant extends Document{
    job:Types.ObjectId;
    user:Types.ObjectId;
    fullName:string;
    email:string;
    mobileNumber:number;
    resume:string;
    appliedAt: Date;
    status:"pending" | "interview" | "rejected" | "shortlisted" | "hired";
    coverLetter:string;
    recruiterResponse:string;
    matchedSkills: string[];
    missingSkills: string[];
    respondedAt: Date;
}