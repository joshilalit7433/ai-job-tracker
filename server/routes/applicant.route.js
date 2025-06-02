import express from "express";
import { ApplyJobApplication,GetApplicantsForSpecificJob,checkIfApplied,respondToApplicant } from "../controllers/applicant.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";

const router=express.Router();

router.route("/apply/:id").post(isAuthenticated,ApplyJobApplication);
router.route("/get-job-applicants-for-recruiter/:jobId").get(isAuthenticated,GetApplicantsForSpecificJob);
router.route("/is-applied/:id").get(isAuthenticated,checkIfApplied);
router.route("/response-to-applicant/:id").post(isAuthenticated,respondToApplicant);



export default router;