import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    mobilenumber: {
      type: Number,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "recruiter", "admin"],
    },

    resume: {
      type: String,
    },

    cover_letter: {
      type: String,
    },

    resume_analysis:{
      type: String,
      default: "",
    },

  

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobApplication",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
