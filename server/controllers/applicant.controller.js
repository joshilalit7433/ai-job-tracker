import mongoose from "mongoose";
import { Applicant } from "../models/applicant.model.js";
import { JobApplication } from "../models/jobApplication.model.js";
import { User } from "../models/user.model.js";

export const ApplyJobApplication = async (req, res) => {
    
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    

    const jobapplicationId = req.params.id;
    const { cover_letter, resume } = req.body;


    if (!cover_letter || !resume || !user.fullname || !user.email) {
      return res.status(400).json({
        message: "Missing required fields: full name, email, resume or cover letter",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobapplicationId)) {
      return res.status(400).json({
        message: "Invalid Job Application ID",
        success: false,
      });
    }

    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only users can apply for jobs",
        success: false,
      });
    }

    const jobapplication = await JobApplication.findById(jobapplicationId);
    if (!jobapplication) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const alreadyApplied = await Applicant.findOne({
      job: jobapplicationId,
      user: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    await Applicant.create({
      job: jobapplicationId,
      user: req.user._id,
      resume,
      cover_letter,
      fullname: user.fullname,
      email: user.email,
      mobilenumber: user.mobilenumber
    });

    return res.status(200).json({
      message: "Successfully applied to the job",
      success: true,
    });
  } catch (error) {
    console.error("Error applying for job:", error.message);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const GetApplicantsForSpecificJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: " Recruiters can only Access",
        success: false,
      });
    }

   
    const applicants = await Applicant.find({ job: jobId })
      

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
