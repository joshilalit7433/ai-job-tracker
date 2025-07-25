import express from 'express';
import { RecruiterDashboard } from '../controllers/recruiterDashboard.controller';
import isAuthenticated from "../middlewares/isAutheticated";
import {checkRole} from "../middlewares/checkRole";

const router = express.Router();

router.get("/recruiter-dashboard",isAuthenticated,checkRole("recruiter"),RecruiterDashboard);

export default router;