
import mongoose, { Types } from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { CohereClient } from "cohere-ai";
import { fileURLToPath } from "url";
import { Applicant } from "../models/applicant.model";
import { JobApplication } from "../models/jobApplication.model";
import { User } from "../models/user.model";
import { sendEmail } from "../utils/sendEmail";
import { extractResumeText } from "../utils/extractResumeText";
import { AuthRequest } from "../types/express/AuthRequest";
import { Response } from "express";
import { analyzeResumeJobFit } from "utils/jobAnalyzer";
import { ResumeAnalysis } from "../types/applicant.types";

dotenv.config();

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY! });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skillReference = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../data/skills_reference.json"),
    "utf-8"
  )
);

const normalizeSkill = (skill: string): string =>
  skill
    .toLowerCase()
    .replace(/[^a-z0-9+]/gi, "")
    .replace(/js$/, "");

const extractSkillsFromAnalysis = (text: string): string[] => {
  const normalizedText = text
    .toLowerCase()
    .replace(/[^a-z0-9\s+]/gi, " ")
    .split(/\s+/);

  const extracted = new Set<string>();

  skillReference.skills.forEach((entry: { aliases: string[] }) => {
    const aliases = entry.aliases.map(normalizeSkill);
    if (aliases.some((alias) => normalizedText.includes(alias))) {
      extracted.add(normalizeSkill(entry.aliases[0]));
    }
  });

  return [...extracted];
};

// Apply to a job

export const ApplyJobApplication = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const jobId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res
        .status(400)
        .json({ message: "Invalid job ID", success: false });
    }

    const job = await JobApplication.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    const alreadyApplied = await Applicant.findOne({
      job: jobId,
      user: user._id,
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You already applied for this job", success: false });
    }

    const resume = req.file
      ? `uploads/resumes/${req.file.filename}`
      : user.resume;
    if (!resume) {
      return res
        .status(400)
        .json({ message: "Please upload your resume first.", success: false });
    }

    const { coverLetter } = req.body;
    if (!coverLetter) {
      return res
        .status(400)
        .json({ message: "Cover letter is required.", success: false });
    }

    const resumePath = path.join(process.cwd(), resume);
    const resumeText = await extractResumeText(resumePath);

    if (req.file) {
      fs.unlink(resumePath, (err) => {
        if (err) console.warn("Failed to delete temp resume file:", err);
      });
    }

    const analysis = await analyzeResumeJobFit(
      job.responsibilities,
      resumeText
    );
    if ("error" in analysis) {
      return res.status(400).json({
        success: false,
        message: "Resume analysis failed",
        error: analysis.error,
      });
    }

    const {
      name,
      education,
      projects,
      resumeScore,
      keyQualificationsMatched,
      skillsNotBackedByExperience,
      suitableJobRoles,
      recommendations,
      finalNotes,
    } = analysis;

    const fixedAnalysis: ResumeAnalysis = {
      name,
      education,
      projects,
      resumeScore,
      keyQualificationsMatched,
      skillsNotBackedByExperience,
      suitableJobRoles,
      recommendations,
      finalNotes,
      analyzedAt: new Date(),
    };

    const userSkills = extractSkillsFromAnalysis(resumeText);
    const jobSkills = (
      Array.isArray(job.skills)
        ? job.skills.flatMap((s) => s.split(/[\s,]+/))
        : (job.skills || "").split(/[\s,]+/)
    ).map((s: string) => normalizeSkill(s.trim()));

    const matchedSkills = jobSkills.filter((skill: string) =>
      userSkills.includes(skill)
    );
    const missingSkills = jobSkills.filter(
      (skill: string) => !userSkills.includes(skill)
    );

    await Applicant.create({
      job: jobId,
      user: user._id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      resume,
      coverLetter,
      matchedSkills,
      missingSkills,
      resumeAnalysis: fixedAnalysis,
    });

    return res.status(200).json({
      message: "Successfully applied to the job",
      success: true,
      data: {
        matchedSkills,
        missingSkills,
        coverLetter,
        resumeAnalysis: fixedAnalysis,
      },
    });
  } catch (error) {
    console.error("ApplyJobApplication Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Check if user already applied for a job

export const checkIfApplied = async (req: AuthRequest, res: Response) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job ID" });
    }

    let applicant;

    if (req.user!.role === "recruiter") {
      // Make sure the job belongs to the recruiter
      const job = await JobApplication.findOne({
        _id: jobId,
        user: req.user!._id,
      });

      if (!job) {
        return res
          .status(404)
          .json({ success: false, message: "Job not found or access denied" });
      }

      // Get any applicant for this job
      applicant = await Applicant.findOne({ job: jobId }).populate(
        "user",
        "fullName email"
      );

      if (!applicant) {
        return res
          .status(404)
          .json({ success: false, message: "Applicant not found" });
      }
    } else if (req.user!.role === "user") {
      //  For users, check if they applied to this job
      applicant = await Applicant.findOne({
        job: jobId,
        user: req.user!._id,
      });

      if (!applicant) {
        return res.status(200).json({
          success: true,
          applied: false,
          message: "Application not found for this job.",
        });
      }
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    //  If applicant found and user is authorized, return their info
    return res.status(200).json({
      success: true,
      message: "Application found.",
      data: {
        applied: true,
        status: applicant.status,
        recruiterResponse: applicant.recruiterResponse || "",
        appliedAt: applicant.appliedAt,
        matchedSkills: applicant.matchedSkills || [],
        missingSkills: applicant.missingSkills || [],
        resumeAnalysis: applicant.resumeAnalysis || null,
      },
    });
  } catch (error) {
    console.error("Error in checkIfApplied:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get all applicants for a specific job

export const GetApplicantsForSpecificJob = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { jobId } = req.params;
    const applicants = await Applicant.find({ job: jobId });
    return res.status(200).json({ data: applicants, success: true });
  } catch (error) {
    console.error(
      "Error in GetApplicants For SpecificJob:",
      (error as Error).message
    );
    return res.status(500).json({
      message: "Server error while fetching applicants for job",
      success: false,
    });
  }
};

// Recruiter responds to applicant

export const respondToApplicant = async (req: AuthRequest, res: Response) => {
  try {
    const applicantId = req.params.id;
    const { recruiterResponse, status } = req.body;

    const applicant = await Applicant.findById(applicantId).populate({
      path: "job",
      populate: { path: "user", model: "User" },
    });
    if (!applicant) {
      return res
        .status(404)
        .json({ message: "Applicant not found", success: false });
    }

    const job = applicant.job;
    if (
      applicant.job &&
      "user" in applicant.job &&
      (applicant.job.user as Types.ObjectId).toString() !==
        req.user!._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const defaultMessages: Record<string, string> = {
      hired:
        "Congratulations! You have been hired. We’ll contact you with further details.",
      shortlisted:
        "You have been shortlisted. We’ll contact you for next steps.",
      interview: "You’ve been selected for interview. We’ll schedule it soon.",
      rejected: "Thank you for applying. Unfortunately, you were not selected.",
    };

    const finalResponse = recruiterResponse || defaultMessages[status] || "";

    await sendEmail(applicant.email, "Job Application Response", finalResponse);

    const updated = await Applicant.findByIdAndUpdate(
      applicantId,
      {
        recruiterResponse: finalResponse,
        status,
        respondedAt: new Date(),
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Response sent successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error sending recruiter response:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending recruiter response",
    });
  }
};

//  Generate AI-based cover letter

export const GenerateCoverLetter = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user || !user.resume) {
      return res.status(400).json({
        success: false,
        message: "Resume not found. Please upload it first.",
      });
    }

    const jobId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res
        .status(400)
        .json({ message: "Invalid job ID", success: false });
    }

    const job = await JobApplication.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    const resumePath = path.join(
      process.cwd(),
      "uploads",
      "resumes",
      path.basename(user.resume)
    );
    const resumeText = await extractResumeText(resumePath);

    const jobDescription = `
Company: ${job.companyName}
Title: ${job.title}
Location: ${job.location}
Responsibilities: ${job.responsibilities || ""}
Required Skills: ${(job.skills || []).join(", ")}
`;

    const prompt = `
Write a personalized and professional cover letter (100-150 words) tailored to the following:

Resume:
${resumeText}

Job Description:
${jobDescription}

Match the applicant's strengths to the responsibilities and skills. Use a confident and clear tone.
`;

    const response = await cohere.generate({
      model: "command",
      prompt,
      maxTokens: 300,
      temperature: 0.7,
    });

    if (!response.generations?.length) {
      return res.status(500).json({
        success: false,
        message: "AI failed to generate cover letter.",
      });
    }

    return res
      .status(200)
      .json({message:" Cover letter generated!", success: true, data: response.generations[0].text });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while generating cover letter.",
    });
  }
};



export const getResumeAnalysisForRecruiter = async (req:AuthRequest,res:Response)=>{
    try {
    const applicantId = req.params.applicantId;

    if (!mongoose.Types.ObjectId.isValid(applicantId)) {
      return res.status(400).json({ success: false, message: "Invalid applicant ID" });
    }

    const applicant = await Applicant.findById(applicantId).populate("job", "user");

    if (!applicant) {
      return res.status(404).json({ success: false, message: "Applicant not found" });
    }

    // Check access: only the recruiter who created the job can access
    const jobOwnerId = (applicant.job as any).user?.toString();
    if (req.user!.role !== "recruiter" || jobOwnerId !== req.user!._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.status(200).json({
      success: true,
      data: applicant.resumeAnalysis,
    });
  } catch (error) {
    console.error("Error fetching resume analysis:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }

}