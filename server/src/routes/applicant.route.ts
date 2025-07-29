import express from "express";
import { ApplyJobApplication,GetApplicantsForSpecificJob,checkIfApplied,respondToApplicant,GenerateCoverLetter } from "../controllers/applicant.controller";
import isAuthenticated from "../middlewares/isAutheticated";
import { upload } from "../middlewares/upload"; 
import  { checkRole } from "../middlewares/checkRole";

const router=express.Router();

router.post("/apply/:id",isAuthenticated,checkRole("user"),upload.single("resume"),ApplyJobApplication);
router.get("/get-job-applicants-for-recruiter/:jobId",isAuthenticated,checkRole("recruiter"),GetApplicantsForSpecificJob);
router.get("/is-applied/:id",isAuthenticated,checkRole("user"),checkIfApplied);
router.post("/response-to-applicant/:id",isAuthenticated,checkRole("recruiter"),respondToApplicant);
router.get("/generate-cover-letter/:id",isAuthenticated,checkRole("user"),GenerateCoverLetter);



export default router;