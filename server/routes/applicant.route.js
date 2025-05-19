import express from "express";
import { ApplyJobApplication,GetApplicantsForSpecificJob } from "../controllers/applicant.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";

const router=express.Router();

router.route("/apply/:id").post(isAuthenticated,ApplyJobApplication);
router.route("/get-job-applicants-for-recruiter/:jobId").get(isAuthenticated,GetApplicantsForSpecificJob);


export default router;