import { JobApplication } from "../models/jobApplication.model.js";
import { Applicant } from "../models/applicant.model.js";
import { io, userSocketMap } from "../index.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

export const PostJobApplication = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can post job applications",
        success: false,
      });
    }

    const {
      title,
      salary,
      location,
      company_name,
      job_type,
      benefits,
      experience,
      responsibilities,
      skills,
      qualification,
      status,
      image
    } = req.body;

    if (
      !title ||
      !salary ||
      !location ||
      !company_name ||
      !job_type ||
      !benefits ||
      !experience ||
      !responsibilities ||
      !skills ||
      !qualification ||
      !image
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const jobApplication = await JobApplication.create({
      user: req.user._id,
      title,
      salary,
      location,
      company_name,
      job_type,
      benefits,
      experience,
      responsibilities,
      skills,
      qualification,
      status: status || "open",
      isApproved: false,
      image
    });

    

    return res.status(201).json({
      message: "Job application submitted. Awaiting admin approval.",
      jobApplication,
      success: true,
    });
  } catch (error) {
    console.error("PostJobApplication Error:", error);
    console.log(error);
    return res.status(500).json({
      message: "Server error while posting job application",
      success: false,
    });
  }
};

export const UpdateJobApplication = async (req, res) => {
  try {
    const {
      title,
      salary,
      location,
      company_name,
      job_type,
      benefits,
      experience,
      responsibilities,
      skills,
      qualification,
      status,
      image
    } = req.body;

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "only recruiters can update job applications",
        success: false,
      });
    }

    const jobapplicationId = req.params.id;
    console.log("job application ", jobapplicationId);
    const jobapplication = await JobApplication.findById(jobapplicationId);
    console.log("job application ", jobapplication);

    if (!jobapplication) {
      return res.status(400).json({
        message: "job application not found",
        success: false,
      });
    }

    if (jobapplication.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this job application",
        success: false,
      });
    }

    if (title) jobapplication.title = title;
    if (salary) jobapplication.salary = salary;
    if (location) jobapplication.location = location;
    if (company_name) jobapplication.company_name = company_name;
    if (job_type) jobapplication.job_type = job_type;
    if (benefits) jobapplication.benefits = benefits;
    if (experience) jobapplication.experience = experience;
    if (responsibilities) jobapplication.responsibilities = responsibilities;
    if (skills) jobapplication.skills = skills;
    if (qualification) jobapplication.qualification = qualification;
    if (status) jobapplication.status = status;
    if(image) jobapplication.image=image;

    await jobapplication.save();

    return res.status(200).json({
      message: "job application updated successfully",
      jobapplication,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const GetJobApplication = async (req, res) => {
  try {
    const jobapplications = await JobApplication.find();
    

    if (jobapplications.length === 0) {
      return res.status(400).json({
        message: "no job applications found",
        success: false,
      });
    }

    return res.status(200).json({
      jobapplications,
      success: true,
    });
  } catch (error) {
    console.error(
      "error fetching job applications: ",
      error.message,
      error.stack
    );
    console.log("Error fetching job applications:", error);
    return res.status(500).json({
      message: "An error occurred while fetching job applications",
      success: false,
    });
  }
};

export const GetJobApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Job Application ID is required",
      });
    }

    const jobapplication = await JobApplication.findById(id);

    if (!jobapplication) {
      return res.status(404).json({
        success: false,
        message: "job application  not found",
      });
    }

    return res.status(200).json({
      success: true,
      jobapplication,
    });
  } catch (error) {
    console.error("Error fetching job application:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job application",
    });
  }
};

export const DeleteJobApplication = async (req, res) => {
  try {
    const jobapplicationId = req.params.id;

    const jobapplication = await JobApplication.findById(jobapplicationId);

    if (!jobapplication) {
      return res.status(400).json({
        message: "job application not found",
        success: false,
      });
    }

    if (jobapplication.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this job application",
        success: false,
      });
    }

    await jobapplication.deleteOne();

    await User.findByIdAndUpdate(req.user._id,{
      $inc:{totalJobsPosted: -1}

    })

    return res.status(200).json({
      message: "Job Application Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.error("error deleting job application", error.message);
    return res.status(500).json({
      message: "Server error while deleting job application",
      success: false,
    });
  }
};

export const GetRecruiterPostedJobApplication = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "only recruiters can view their posted job applications",
        success: false,
      });
    }

    const recruiterid = req.user._id;

    if (!recruiterid) {
      return res.status(400).json({
        message: "Recruiter ID is required",
        success: false,
      });
    }

    const jobapplications = await JobApplication.find({ user: recruiterid });

    return res.status(200).json({
      jobapplications,
      success: true,
    });
  } catch (error) {
    console.error(
      "Error fetching recruiter's posted job applications:",
      error.message
    );
    console.log("Error :", error);
    return res.status(500).json({
      message:
        "Server error while fetching recruiter's posted job applications",
      success: false,
    });
  }
};

export const GetJobApplicationForRecruiter = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Access denied. Recruiters only.",
        success: false,
      });
    }

    const recruiterJobs = await JobApplication.find({ user: req.user._id });

    return res.status(200).json({
      jobApplications: recruiterJobs,
      success: true,
    });
  } catch (error) {
    console.error(
      "Error fetching recruiter's job applications:",
      error.message
    );
    return res.status(500).json({
      message: "Server error while fetching recruiter job applications",
      success: false,
    });
  }
};

export const GetUserAppliedJobApplication = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Access denied",
        success: false,
      });
    }

    const jobapplications = await Applicant.find({
      user: req.user._id,
    }).populate("job");

    return res.status(200).json({
      appliedJobs: jobapplications,
      success: true,
    });
  } catch (error) {
    console.log(error);
    console.error("Error fetching user's applied jobs:", error.message);
    return res.status(500).json({
      message: "Server error while fetching applied jobs",
      success: false,
    });
  }
};

export const getPendingJobs = async (req, res) => {
  try {
    const jobs = await JobApplication.find({ isApproved: false });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching pending jobs:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const approveJob = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can approve job applications",
        success: false,
      });
    }

    const jobId = req.params.id;
    const job = await JobApplication.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job application not found",
        success: false,
      });
    }

    job.isApproved = true;
    await job.save();

    const recruiterId = job.user.toString();

    await User.findByIdAndUpdate(recruiterId, {
      $inc: { totalJobsPosted: 1 },
    });


    const sockets = userSocketMap.get(recruiterId);

    
    await Notification.create({
      user: recruiterId,
      title: job.title,
      company_name: job.company_name,
      location: job.location,
    });

    
    if (sockets) {
      for (const socketId of sockets) {
        io.to(socketId).emit("jobAlert", {
          title: job.title,
          company_name: job.company_name,
          location: job.location,
        });
      }
    }

    return res.status(200).json({
      message: "Job application approved successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.error("Error approving job:", error.message);
    return res.status(500).json({
      message: "Server error while approving job",
      success: false,
    });
  }
};

export const rejectJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await JobApplication.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job application not found",
        success: false,
      });
    }

    await JobApplication.findByIdAndDelete(jobId);

    return res.status(200).json({
      success: true,
      message: "Job rejected and deleted successfully",
    });
  } catch (error) {
    console.error("Error rejecting job:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while rejecting job",
    });
  }
};
