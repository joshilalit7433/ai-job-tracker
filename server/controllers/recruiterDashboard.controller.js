import { User } from "../models/user.model.js";
import { JobApplication } from "../models/jobApplication.model.js";
import { Applicant } from "../models/applicant.model.js";

export const RecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const user = await User.findById(recruiterId);
    console.log(recruiterId);
    console.log(user);

    if (!user || user.role !== "recruiter") {
      return res.status(404).json({
        message: "Recruiter not found",
        success: false,
      });
    }

    const jobs = await JobApplication.find({ user: recruiterId });
    const JobIds = jobs.map((job) => job._id);


    const totalApplicants = await Applicant.countDocuments({
      job: { $in: JobIds },
    });





    res.status(200).json({
      message: "Recruiter dashboard data fetched successfully",
      totalJobsPosted: user.totalJobsPosted,
      totalApplicants,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
