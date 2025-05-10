import express from "express";
import { ApplyJobApplication } from "../controllers/applicant.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";
import { upload } from "../middlewares/upload.js";
const router=express.Router();

router.route("/applicants/:id").post(isAuthenticated,upload.single("resume"),ApplyJobApplication);

export default router;