import { Request, Response } from "express";
import { JobApplication } from "../models/jobApplication.model";
import { Applicant } from "../models/applicant.model";
import { io, userSocketMap } from "../index";
import { Notification } from "../models/notification.model";
import { User } from "../models/user.model";
import { sendEmail } from "../utils/sendEmail";
import { AuthRequest } from "../types/express/AuthRequest";

export const PostJobApplication = async (req:AuthRequest, res:Response) => {
  try {
    const {
      title,
      salary,
      location,
      companyName,
      jobType,
      benefits,
      experience,
      responsibilities,
      skills,
      qualification,
      status,
      image,
      jobCategory,
    } = req.body;

    if (
      !title ||
      !salary ||
      !location ||
      !companyName ||
      !jobType ||
      !benefits ||
      !experience ||
      !responsibilities ||
      !skills ||
      !qualification ||
      !image ||
      !jobCategory
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const jobApplication = await JobApplication.create({
      user: req.user!._id,
      title,
      salary,
      location,
      companyName,
      jobType,
      benefits,
      experience,
      responsibilities,
      skills:
        typeof skills === "string"
          ? skills.split(",").map((s) => s.trim())
          : skills,
      qualification,
      status: status || "open",
      isApproved: false,
      image,
      jobCategory,
    });

    await sendEmail(
      req.user!.email,
      "Job Application Response",
      "Your job application has been submitted and is awaiting admin approval."
    );

    return res.status(201).json({
      message: "Job application submitted. Awaiting admin approval.",
      jobApplication,
      success: true,
    });
  } catch (error) {
    console.error("PostJobApplication Error:", error);
    return res.status(500).json({
      message: "Server error while posting job application",
      success: false,
    });
  }
};

export const UpdateJobApplication = async (req:AuthRequest, res:Response) => {
  try {
    const updates = req.body;
    const jobapplicationId = req.params.id;

    const jobapplication = await JobApplication.findById(jobapplicationId);

    if (!jobapplication) {
      return res.status(404).json({
        message: "Job application not found",
        success: false,
      });
    }

    if (jobapplication.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized to update this job application",
        success: false,
      });
    }

    Object.assign(jobapplication, updates);
    await jobapplication.save();

    return res.status(200).json({
      message: "Job application updated successfully",
      jobapplication,
      success: true,
    });
  } catch (error) {
    console.error("UpdateJobApplication Error:", error);
    return res.status(500).json({
      message: "Server error while updating job application",
      success: false,
    });
  }
};

export const GetJobApplication = async (req: Request, res: Response) => {
  try {
    const jobapplications = await JobApplication.find();
    return res.status(200).json({ data:jobapplications, success: true });
  } catch (error) {
    console.error("GetJobApplication Error:", error);
    return res.status(500).json({
      message: "Error fetching job applications",
      success: false,
    });
  }
};

export const getJobApplicationByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.params;

    const jobs = await JobApplication.find({
      jobCategory: categoryName,
      isApproved: true,
    });

    return res.status(200).json({
      success: true,
      jobapplications: jobs,
    });
  } catch (error) {
    console.error("getJobsByCategory Error:", error);
    return res.status(500).json({
      message: "Server error while fetching jobs by category",
      success: false,
    });
  }
};


export const GetJobApplicationById = async (req: Request, res: Response) => {
  try {
    const jobapplication = await JobApplication.findById(req.params.id);
    if (!jobapplication) {
      return res.status(404).json({ message: "Job application not found", success: false });
    }
    return res.status(200).json({ success: true, jobapplication });
  } catch (error) {
    console.error("GetJobApplicationById Error:", error);
    return res.status(500).json({ message: "Failed to fetch job application", success: false });
  }
};

export const DeleteJobApplication = async (req: AuthRequest, res: Response) => {
  try {
    const jobapplication = await JobApplication.findById(req.params.id);
    if (!jobapplication) {
      return res.status(404).json({ message: "Job application not found", success: false });
    }

    if (jobapplication.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this job", success: false });
    }

    await jobapplication.deleteOne();
    await User.findByIdAndUpdate(req.user!._id, {
      $inc: { totalJobsPosted: -1 },
    });

    return res.status(200).json({ message: "Job deleted successfully", success: true });
  } catch (error) {
    console.error("DeleteJobApplication Error:", error);
    return res.status(500).json({ message: "Server error while deleting job", success: false });
  }
};

export const GetRecruiterPostedJobApplication = async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await JobApplication.find({ user: req.user!._id });
    return res.status(200).json({ data: jobs, success: true });
  } catch (error) {
    console.error("GetRecruiterPostedJobApplication Error:", error);
    return res.status(500).json({ message: "Error fetching jobs", success: false });
  }
};


export const GetUserAppliedJobApplication = async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await Applicant.find({ user: req.user!._id }).populate("job");
    return res.status(200).json({ appliedJobs: jobs, success: true });
  } catch (error) {
    console.error("GetUserAppliedJobApplication Error:", error);
    return res.status(500).json({ message: "Error fetching applied jobs", success: false });
  }
};


export const getPendingJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await JobApplication.find({ isApproved: false });
    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error("getPendingJobs Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const approveJob = async (req: Request, res: Response) => {
  try {
    const job = await JobApplication.findById(req.params.id);
    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });

    job.isApproved = true;
    await job.save();

    await User.findByIdAndUpdate(job.user.toString(), {
      $inc: { totalJobsPosted: 1 },
    });

    await Notification.create({
      user: job.user.toString(),
      title: job.title,
      companyName: job.companyName,
      location: job.location,
    });

    const sockets = userSocketMap.get(job.user.toString());
    if (sockets) {
      sockets.forEach((socketId: string) => {
        io.to(socketId).emit("jobAlert", {
          title: job.title,
          companyName: job.companyName,
          location: job.location,
        });
      });
    }

    return res.status(200).json({ message: "Job approved successfully", job, success: true });
  } catch (error) {
    console.error("approveJob Error:", error);
    return res.status(500).json({ message: "Error approving job", success: false });
  }
};

export const rejectJob = async (req: Request, res: Response) => {
  try {
    const job = await JobApplication.findById(req.params.id);

    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });

    if (job.isApproved) {
      return res.status(400).json({
        message: "Cannot reject an already approved job",
        success: false,
      });
    }

    await JobApplication.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Job rejected and deleted", success: true });
  } catch (error) {
    console.error("rejectJob Error:", error);
    return res.status(500).json({ message: "Error rejecting job", success: false });
  }
};


export const JobCategoryCount = async (req: Request, res: Response) => {
  try {
    const jobs = await JobApplication.find({ isApproved: true });

    const counts = jobs.reduce((acc: Record<string, number>, job) => {
      acc[job.jobCategory] = (acc[job.jobCategory] || 0) + 1;
      return acc;
    }, {});

    res.json({ success: true, counts });
  } catch (error) {
    console.error("Error getting job counts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



