import express from "express";
import { getNotifications, removeNotification } from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";

const router = express.Router();

router.get("/",isAuthenticated,getNotifications);
router.delete("/clear/:id",isAuthenticated,removeNotification);

export default router;