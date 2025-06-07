import mongoose from "mongoose";
import { Applicant } from "../models/applicant.model.js";
import { JobApplication } from "../models/jobApplication.model.js";
import { User } from "../models/user.model.js";
import fs from "fs";
import path from "path";
import { sendEmail } from "../utils/sendEmail.js";


const skillReference = JSON.parse(
  fs.readFileSync(path.resolve("data/skills_reference.json"), "utf-8")
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


export const ApplyJobApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "User not found", success: false });

    const jobId = req.params.id;
    const resume = req.body.resume || user.resume;
    const cover_letter = req.body.cover_letter || user.cover_letter;

    if (!resume || !cover_letter) {
      return res.status(400).json({
        message: !resume ? "Please upload a resume" : "Please provide a cover letter",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID", success: false });
    }

    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can apply", success: false });
    }

    const job = await JobApplication.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    const alreadyApplied = await Applicant.findOne({ job: jobId, user: user._id });
    if (alreadyApplied) {
      return res.status(400).json({
        message: "You already applied for this job",
        success: false,
      });
    }

    const analysisText = typeof user.resume_analysis === "string" ? user.resume_analysis : "";
    const userSkills = extractSkillsFromAnalysis(analysisText);

    const jobSkills = (
      Array.isArray(job.skills)
        ? job.skills.flatMap((s) => s.split(/[\s,]+/))
        : (job.skills || "").split(/[\s,]+/)
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

    
    if (!user.resume && req.body.resume) user.resume = req.body.resume;
    if (!user.cover_letter && req.body.cover_letter) user.cover_letter = req.body.cover_letter;
    await user.save();

    return res.status(200).json({
      message: "Successfully applied to the job",
      matchedSkills,
      missingSkills,
      parsedResume: analysisText,
      success: true,
    });
  } catch (error) {
    console.error("Error applying:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};


export const checkIfApplied = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid job ID" });
    }

    const applicant = await Applicant.findOne({
      job: jobId,
      user: req.user._id,
    });

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
      appliedAt:applicant.appliedAt
    });
  } catch (error) {
    console.error("Error in checkIfApplied:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const GetApplicantsForSpecificJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Recruiters can only access this",
        success: false,
      });
    }

    const applicants = await Applicant.find({ job: jobId });

    return res.status(200).json({
      applicants,
      success: true,
    });
  } catch (error) {
    console.error("Error in GetApplicantsForSpecificJob:", error.message);
    return res.status(500).json({
      message: "Server error while fetching applicants for job",
      success: false,
    });
  }
};


export const respondToApplicant = async (req, res) => {
  try {
    const applicantId = req.params.id;
    const { recruiterResponse, status } = req.body;

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can respond to applicants",
        success: false,
      });
    }

    
    const applicant = await Applicant.findById(applicantId).populate("job");

    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
        success: false,
      });
    }

    
    const job = applicant.job;
    if (!job || job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to respond to this applicant",
        success: false,
      });
    }

    const finalResponse =
      recruiterResponse ||
      (status === "accepted"
        ? "Congratulations! You’ve been accepted."
        : "Thank you for applying. Unfortunately, you were not shortlisted.");

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

