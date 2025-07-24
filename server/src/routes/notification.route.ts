import express from "express";
import { getNotifications, removeNotification } from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";

const router = express.Router();

router.route("/").get(isAuthenticated,getNotifications);
router.route("/clear/:id").delete(isAuthenticated,removeNotification);

export default router;