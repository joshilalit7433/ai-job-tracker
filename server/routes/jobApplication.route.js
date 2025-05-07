import express from "express";
import { PostJobApplication,UpdateJobApplication,GetJobApplication,DeleteJobApplication,GetJobApplicationForRecruiter} from "../controllers/jobApplication.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";

const router=express.Router();

router.route("/post-job-applications").post(isAuthenticated,PostJobApplication);
router.route("/update/:id").put(isAuthenticated,UpdateJobApplication);
router.route("/get-job-applications").get(GetJobApplication);
router.route("/delete-job-application/:id").delete(isAuthenticated,DeleteJobApplication);
router.route("/get-job-application-for-recruiter").get(isAuthenticated,GetJobApplicationForRecruiter);


export default router;