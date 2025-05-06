import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectdb from "./utils/db.js";
import dotenv from "dotenv";
import userRoute from "../server/routes/user.route.js";
import JobApplicationRoute from "../server/routes/jobApplication.route.js";

dotenv.config();

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  crendentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

connectdb();

app.use("/api/v1/user", userRoute);
app.use("/api/v1/jobapplication",JobApplicationRoute);

app.listen(PORT, () => {
  console.log("server running at port " + PORT);
});
