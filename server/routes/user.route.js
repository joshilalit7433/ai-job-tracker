import express from "express";
import {upload} from "../middlewares/upload.js";

import {
  register,
  login,
  updateProfile,
  logout,
  UploadResume,
  saveJob,
  unsaveJob,
  getSavedJobs
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAutheticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/updateprofile").post(isAuthenticated, updateProfile);
router.route("/upload-resume").post(isAuthenticated,upload.single("resume"),UploadResume);
router.route("/saved-job/:jobId").post(isAuthenticated, saveJob);
router.route("/user-unsaved-job/:jobId").delete(isAuthenticated, unsaveJob);
router.route("/get-saved-job").get(isAuthenticated, getSavedJobs);




export default router;
