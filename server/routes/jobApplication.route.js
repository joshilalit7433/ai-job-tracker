import express from "express";
import { PostJobApplication,UpdateJobApplication } from "../controllers/jobApplication.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";

const router=express.Router();

router.route("/postjobapplication").post(isAuthenticated,PostJobApplication);
router.route("/update/:id").put(isAuthenticated,UpdateJobApplication);

export default router;