import express from "express";
import { PostJobApplication,UpdateJobApplication,GetJobApplication,getJobApplicationByCategory,GetJobApplicationById,DeleteJobApplication,GetRecruiterPostedJobApplication,GetUserAppliedJobApplication, approveJob, rejectJob, getPendingJobs,JobCategoryCount,AnalyzeResumeController} from "../controllers/jobApplication.controller";
import isAuthenticated from "../middlewares/isAutheticated";
import { checkRole } from "../middlewares/checkRole";
import { upload } from "../middlewares/upload";


const router=express.Router();

router.post("/post-job-applications",isAuthenticated,checkRole("recruiter"),PostJobApplication);
router.put("/update-job-application/:id",isAuthenticated,checkRole("recruiter"),UpdateJobApplication);
router.get("/get-job-applications",GetJobApplication);
router.get("/get-job-category-count",JobCategoryCount);
router.get("/get-jobs-by-category/:categoryName",getJobApplicationByCategory);
router.get("/get-job-application-by-id/:id",GetJobApplicationById);
router.delete("/delete-job-application/:id",isAuthenticated,checkRole("recruiter"),DeleteJobApplication);
router.get("/get-recruiter-posted-job-application/:recruiterid",isAuthenticated,checkRole("recruiter"),GetRecruiterPostedJobApplication);
router.get("/get-user-applied-job-application",isAuthenticated,checkRole("user"),GetUserAppliedJobApplication);
router.post('/analyze-resume/:jobId',isAuthenticated,checkRole("user"), upload.single('resume'), AnalyzeResumeController);
router.get("/pending-jobs",isAuthenticated,checkRole("admin"), getPendingJobs);
router.put("/approve-job/:id",isAuthenticated,checkRole("admin"), approveJob);
router.delete("/reject-job/:id",isAuthenticated,checkRole("admin"), rejectJob);




export default router; 