import express from "express";
import { PostJobApplication,UpdateJobApplication,GetJobApplication,DeleteJobApplication,GetRecruiterPostedJobApplication,GetJobApplicationForRecruiter,GetUserAppliedJobApplication} from "../controllers/jobApplication.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";

const router=express.Router();

router.route("/post-job-applications").post(isAuthenticated,PostJobApplication);
router.route("/update/:id").put(isAuthenticated,UpdateJobApplication);
router.route("/get-job-applications").get(GetJobApplication);
router.route("/delete-job-application/:id").delete(isAuthenticated,DeleteJobApplication);
router.route("/get-recruiter-posted-job-application/:recruiterid").get(isAuthenticated,GetRecruiterPostedJobApplication);
router.route("/get-job-application-for-recruiter").get(isAuthenticated,GetJobApplicationForRecruiter);
router.route("/get-user-applied-job-application").get(isAuthenticated,GetUserAppliedJobApplication);


export default router; 