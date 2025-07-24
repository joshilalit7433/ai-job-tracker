import express from "express";
import { ApplyJobApplication,GetApplicantsForSpecificJob,checkIfApplied,respondToApplicant,GenerateCoverLetter } from "../controllers/applicant.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";
import { upload } from "../middlewares/upload.js"; 
import  { checkRole } from "../middlewares/checkRole.js";

const router=express.Router();

router.route("/apply/:id").post(isAuthenticated,checkRole("user"),upload.single("resume"),ApplyJobApplication);
router.route("/get-job-applicants-for-recruiter/:jobId").get(isAuthenticated,checkRole("recruiter"),GetApplicantsForSpecificJob);
router.route("/is-applied/:id").get(isAuthenticated,checkRole("user"),checkIfApplied);
router.route("/response-to-applicant/:id").post(isAuthenticated,checkRole("recruiter"),respondToApplicant);
router.route("/generate-cover-letter/:id").get(isAuthenticated,checkRole("user"),GenerateCoverLetter);



export default router;