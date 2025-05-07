import express from "express";
import { ApplyJobApplication } from "../controllers/applicant.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";

const router=express.Router();

router.route("/applicants/:id").post(isAuthenticated,ApplyJobApplication);

export default router;