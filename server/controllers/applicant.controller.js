import mongoose from "mongoose";
import { Applicant } from "../models/applicant.model.js";
import { JobApplication } from "../models/jobApplication.model.js";

export const ApplyJobApplication = async (req, res) => {
    try {
      const jobapplicationId = req.params.id;
  
    
      if (!mongoose.Types.ObjectId.isValid(jobapplicationId)) {
        return res.status(400).json({
          message: "Invalid Job Application ID",
          success: false,
        });
      }
  
      if (!req.user || req.user.role !== "user") {
        return res.status(403).json({
          message: "Only users can apply for job applications",
          success: false,
        });
      }
  
      const jobapplication = await JobApplication.findById(jobapplicationId);
      if (!jobapplication) {
        return res.status(404).json({
          message: "Job application not found",
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
      });
  
      return res.status(200).json({
        message: "Successfully applied to the job",
        success: true,
      });
  
    } catch (error) {
      console.error("Error applying for job:", error.message);
      return res.status(500).json({
        message: "Server error while applying",
        success: false,
      });
    }
  };
  
