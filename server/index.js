import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import connectdb from "./utils/db.js";
import dotenv from "dotenv";
import userRoute from "../server/routes/user.route.js";
import JobApplicationRoute from "../server/routes/jobApplication.route.js";
import ApplicantRoute from "../server/routes/applicant.route.js";

dotenv.config();

const app = express();

//middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const corsOptions = {
  origin: "http://localhost:5173",
  credentials:true
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

connectdb();

app.use("/api/v1/user", userRoute);
app.use("/api/v1/job-application",JobApplicationRoute);
app.use("/api/v1/applicant",ApplicantRoute);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log("server running at port " + PORT);
});
