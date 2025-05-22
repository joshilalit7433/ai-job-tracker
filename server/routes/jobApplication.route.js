import express from "express";
import { PostJobApplication,UpdateJobApplication,GetJobApplication,GetJobApplicationById,DeleteJobApplication,GetRecruiterPostedJobApplication,GetJobApplicationForRecruiter,GetUserAppliedJobApplication, approveJob, rejectJob, getPendingJobs} from "../controllers/jobApplication.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router=express.Router();

router.route("/post-job-applications").post(isAuthenticated,PostJobApplication);
router.route("/update-job-application/:id").put(isAuthenticated,UpdateJobApplication);
router.route("/get-job-applications").get(GetJobApplication);
router.route("/get-job-application-by-id/:id").get(isAuthenticated,GetJobApplicationById);
router.route("/delete-job-application/:id").delete(isAuthenticated,DeleteJobApplication);
router.route("/get-recruiter-posted-job-application/:recruiterid").get(isAuthenticated,GetRecruiterPostedJobApplication);
router.route("/get-job-application-for-recruiter").get(isAuthenticated,GetJobApplicationForRecruiter);
router.route("/get-user-applied-job-application").get(isAuthenticated,GetUserAppliedJobApplication);

router.route("/pending-jobs").get(isAdmin, getPendingJobs);
router.route("/approve-job/:id").put(isAdmin, approveJob);
router.route("/reject-job/:id").delete(isAdmin, rejectJob);




export default router; 