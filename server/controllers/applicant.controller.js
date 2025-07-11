import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { CohereClient } from "cohere-ai";

import { Applicant } from "../models/applicant.model.js";
import { JobApplication } from "../models/jobApplication.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { extractResumeText } from "../utils/extractResumeText.js";

dotenv.config();

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

const skillReference = JSON.parse(
  fs.readFileSync(path.join("data", "skills_reference.json"), "utf-8")
);

const normalizeSkill = (skill) =>
  skill.toLowerCase().replace(/[^a-z0-9+]/gi, "").replace(/js$/, "");

const extractSkillsFromAnalysis = (text) => {
  const normalizedText = text
    .toLowerCase()
    .replace(/[^a-z0-9\s+]/gi, " ")
    .split(/\s+/);

  const extracted = new Set();

  skillReference.skills.forEach((entry) => {
    const aliases = entry.aliases.map(normalizeSkill);
    if (aliases.some((alias) => normalizedText.includes(alias))) {
      extracted.add(normalizeSkill(entry.aliases[0]));
    }
  });

  return [...extracted];
};

/**
 * Apply to a job
 */
export const ApplyJobApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    const jobId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID", success: false });
    }

    const job = await JobApplication.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found", success: false });

    const alreadyApplied = await Applicant.findOne({ job: jobId, user: user._id });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You already applied for this job", success: false });
    }

    const resume = req.file
      ? `uploads/resumes/${req.file.filename}`
      : user.resume;

    if (!resume) {
      return res.status(400).json({ message: "Please upload your resume first.", success: false });
    }

    const cover_letter = req.body.cover_letter;
    if (!cover_letter) {
      return res.status(400).json({ message: "Cover letter is required.", success: false });
    }

    const resumePath = path.join(process.cwd(), resume);
    const analysisText = await extractResumeText(resumePath);

    const userSkills = extractSkillsFromAnalysis(analysisText);

    const jobSkills = (
      Array.isArray(job.skills) ? job.skills.flatMap(s => s.split(/[\s,]+/)) : (job.skills || "").split(/[\s,]+/)
    ).map((s) => normalizeSkill(s.trim()));

    const matchedSkills = jobSkills.filter((skill) => userSkills.includes(skill));
    const missingSkills = jobSkills.filter((skill) => !userSkills.includes(skill));

    await Applicant.create({
      job: jobId,
      user: user._id,
      resume,
      cover_letter,
      fullname: user.fullname,
      email: user.email,
      mobilenumber: user.mobilenumber,
      skill_gap: missingSkills,
    });

    return res.status(200).json({
      message: "Successfully applied to the job",
      matchedSkills,
      missingSkills,
      coverLetter: cover_letter,
      parsedResume: analysisText,
      success: true,
    });
  } catch (error) {
    console.error("Error applying:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

/**
 * Check if user already applied for a job
 */
export const checkIfApplied = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid job ID" });
    }

    const applicant = await Applicant.findOne({ job: jobId, user: req.user._id });

    if (!applicant) {
      return res.status(200).json({
        success: true,
        applied: false,
        message: "You can apply for this job.",
      });
    }

    return res.status(200).json({
      success: true,
      applied: true,
      message: "You have already applied for this job.",
      status: applicant.status,
      recruiterResponse: applicant.recruiterResponse || "",
      appliedAt: applicant.appliedAt,
    });
  } catch (error) {
    console.error("Error in checkIfApplied:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get all applicants for a specific job
 */
export const GetApplicantsForSpecificJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicants = await Applicant.find({ job: jobId });
    return res.status(200).json({ applicants, success: true });
  } catch (error) {
    console.error("Error in GetApplicantsForSpecificJob:", error.message);
    return res.status(500).json({
      message: "Server error while fetching applicants for job",
      success: false,
    });
  }
};

/**
 * Recruiter responds to applicant
 */
export const respondToApplicant = async (req, res) => {
  try {
    const applicantId = req.params.id;
    const { recruiterResponse, status } = req.body;

    const applicant = await Applicant.findById(applicantId).populate("job");
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found", success: false });
    }

    const job = applicant.job;
    if (!job || job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const defaultMessages = {
      hired: "Congratulations! You have been hired. We’ll contact you with further details.",
      shortlisted: "You have been shortlisted. We’ll contact you for next steps.",
      interview: "You’ve been selected for interview. We’ll schedule it soon.",
      rejected: "Thank you for applying. Unfortunately, you were not selected.",
    };

    const finalResponse = recruiterResponse || defaultMessages[status] || "";

    await sendEmail(applicant.email, "Job Application Response", finalResponse);

    await Applicant.findByIdAndUpdate(applicantId, {
      recruiterResponse: finalResponse,
      status,
      respondedAt: new Date(),
    });

    return res.status(200).json({
      message: "Response sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error sending recruiter response:", error);
    return res.status(500).json({
      message: "Server error while sending recruiter response",
      success: false,
    });
  }
};

/**
 * Generate AI-based cover letter
 */
export const GenerateCoverLetter = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.resume) {
      return res.status(400).json({ success: false, message: "Resume not found. Please upload it first." });
    }

    const jobId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID", success: false });
    }

    const job = await JobApplication.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    const resumePath = path.join(process.cwd(), "uploads", "resumes", path.basename(user.resume));
    const resumeText = await extractResumeText(resumePath);

    const jobDescription = `
Company: ${job.company_name}
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
      max_tokens: 300,
      temperature: 0.7,
    });

    if (!response.generations?.length) {
      return res.status(500).json({ success: false, message: "AI failed to generate cover letter." });
    }

    return res.status(200).json({ success: true, letter: response.generations[0].text });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while generating cover letter.",
    });
  }
};
