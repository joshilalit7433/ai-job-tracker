import express from "express";
import {upload} from "../middlewares/upload.js";
import {checkRole} from "../middlewares/checkRole.js";

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
router.route("/upload-resume").post(isAuthenticated,checkRole("user"),upload.single("resume"),UploadResume);
router.route("/saved-job/:jobId").post(isAuthenticated,checkRole("user"), saveJob);
router.route("/user-unsaved-job/:jobId").delete(isAuthenticated,checkRole("user"), unsaveJob);
router.route("/get-saved-job").get(isAuthenticated,checkRole("user"), getSavedJobs);




export default router;
