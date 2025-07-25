import {  Response } from "express";
import { JobApplication } from "../models/jobApplication.model";
import { Applicant } from "../models/applicant.model";
import { AuthRequest } from "../types/express/AuthRequest"; 

export const RecruiterDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const recruiterId = req.user!._id;

    // Get recruiter's posted jobs
    const jobs = await JobApplication.find({ user: recruiterId });
    const jobIds = jobs.map((job) => job._id);

    // Stats
    const totalApplicants = await Applicant.countDocuments({ job: { $in: jobIds } });
    const shortlisted = await Applicant.countDocuments({ job: { $in: jobIds }, status: "shortlisted" });
    const interviews = await Applicant.countDocuments({ job: { $in: jobIds }, status: "interview" });
    const hired = await Applicant.countDocuments({ job: { $in: jobIds }, status: "hired" });

    // Bar Chart Data
    const barData = await Applicant.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: "$job",
          applications: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "jobapplications",
          localField: "_id",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $project: {
          job: { $arrayElemAt: ["$jobDetails.title", 0] },
          applications: 1,
        },
      },
    ]);

    // Line Chart Data
    const lineData = await Applicant.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          applications: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          time: "$_id",
          applications: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      message: "Recruiter dashboard data fetched successfully",
      success: true,
      totalJobsPosted: jobs.length,
      totalApplicants,
      shortlisted,
      interviews,
      hired,
      barData,
      lineData,
    });
  } catch (error) {
    console.error("RecruiterDashboard Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
