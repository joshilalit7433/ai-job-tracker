import express from 'express';
import { RecruiterDashboard } from '../controllers/recruiterDashboard.controller.js';
import isAuthenticated from "../middlewares/isAutheticated.js";

const router = express.Router();

router.route("/recruiter-dashboard/:recruiterId").get(isAuthenticated,RecruiterDashboard);

export default router;