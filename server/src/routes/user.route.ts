import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  UploadResume,
  saveJob,
  unsaveJob,
  getSavedJobs,
  GetUser
} from "../controllers/user.controller";
import { upload } from "../middlewares/upload";
import isAuthenticated from "../middlewares/isAutheticated";
import { checkRole } from "../middlewares/checkRole";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getuser", isAuthenticated, GetUser);
router.post("/updateprofile", isAuthenticated, updateProfile);
router.post("/upload-resume", isAuthenticated, checkRole("user"), upload.single("resume"), UploadResume);
router.post("/saved-job/:jobId", isAuthenticated, checkRole("user"), saveJob);
router.delete("/user-unsaved-job/:jobId", isAuthenticated, checkRole("user"), unsaveJob);
router.get("/get-saved-job", isAuthenticated, checkRole("user"), getSavedJobs);

export default router;
