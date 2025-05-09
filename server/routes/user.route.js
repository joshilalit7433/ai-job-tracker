import express from "express";
import {upload} from "../middlewares/upload.js";

import {
  register,
  login,
  updateProfile,
  logout,
  UploadResume
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/updateprofile").post(isAuthenticated, updateProfile);
router.route("/upload-resume").post(isAuthenticated,upload.single("resume"),UploadResume);

export default router;
