import express from 'express';
import { RecruiterDashboard } from '../controllers/recruiterDashboard.controller.js';
import isAuthenticated from "../middlewares/isAutheticated.js";
import {checkRole} from "../middlewares/checkRole.js";

const router = express.Router();

router.route("/recruiter-dashboard").get(isAuthenticated,checkRole("recruiter"),RecruiterDashboard);

export default router;