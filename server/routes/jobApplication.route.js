import express from "express";
import { PostJobApplication,UpdateJobApplication,GetJobApplication,GetJobApplicationById,DeleteJobApplication,GetRecruiterPostedJobApplication,GetUserAppliedJobApplication, approveJob, rejectJob, getPendingJobs} from "../controllers/jobApplication.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";
import { checkRole } from "../middlewares/checkRole.js";


const router=express.Router();

router.route("/post-job-applications").post(isAuthenticated,checkRole("recruiter"),PostJobApplication);
router.route("/update-job-application/:id").put(isAuthenticated,checkRole("recruiter"),UpdateJobApplication);
router.route("/get-job-applications").get(GetJobApplication);
router.route("/get-job-application-by-id/:id").get(isAuthenticated,GetJobApplicationById);
router.route("/delete-job-application/:id").delete(isAuthenticated,checkRole("recruiter"),DeleteJobApplication);
router.route("/get-recruiter-posted-job-application/:recruiterid").get(isAuthenticated,checkRole("recruiter"),GetRecruiterPostedJobApplication);
router.route("/get-user-applied-job-application").get(isAuthenticated,checkRole("user"),GetUserAppliedJobApplication);

router.route("/pending-jobs").get(isAuthenticated,checkRole("admin"), getPendingJobs);
router.route("/approve-job/:id").put(isAuthenticated,checkRole("admin"), approveJob);
router.route("/reject-job/:id").delete(isAuthenticated,checkRole("admin"), rejectJob);




export default router; 