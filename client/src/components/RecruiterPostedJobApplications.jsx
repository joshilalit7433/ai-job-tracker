import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant.js";
import { Pencil,MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Trash2 } from 'lucide-react';
import { toast } from "react-toastify";


const RecruiterPostedJobApplication = () => {
  const { user } = useSelector((store) => store.auth);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `${JOB_APPLICATION_API_END_POINT}/get-recruiter-posted-job-application/${user?._id}`,
        {
          withCredentials:true
        }
      );
      const data = response.data;

      if (data.success) {
        console.log("Jobs fetched successfully:", data.jobapplications);
        setJobs(data.jobapplications || []);
       
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err.message);
      setError("Failed to fetch jobs.");
      setLoading(false);
    }
  };

  if (user?._id) {
    fetchJobs();
  }
}, [user]);

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this job application?")) return;

  try {
    const res = await axios.delete(`${JOB_APPLICATION_API_END_POINT}/delete-job-application/${id}`, {
      withCredentials: true,
    });

    if (res.data.success) {
      toast.success("Job application deleted successfully!");
      setJobs(jobs.filter((job) => job._id !== id));
    } else {
      toast.error(res.data.message || "Failed to delete job application.");
    }
  } catch (err) {
    console.error("Error deleting job application:", err);
    toast.error("Something went wrong while deleting.");
  }
};



  return (
    <div className="pt-20 px-4 pb-20 bg-[#f7e9d6]  ">
      <h1 className="text-center text-2xl lg:text-3xl font-semibold mb-6">
        Your Posted Job Applications
      </h1>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-lg">No job applications found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-[#FAF6E9] rounded-xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden p-4 space-y-2"
            >
              <p className="text-black text-lg font-bold capitalize">
                Role: {job.title}
              </p>
              <p>
                <strong>Salary:</strong> {job.salary}
              </p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Company:</strong> {job.company_name}
              </p>
              <p>
                <strong>Job Type:</strong> {job.job_type}
              </p>
              <p>
                <strong>Benefits:</strong> {job.benefits}
              </p>
              <p>
                <strong>Experience:</strong> {job.experience}
              </p>
              <p>
                <strong>Responsibilities:</strong> {job.responsibilities}
              </p>
              <p>
                <strong>Skills:</strong> {job.skills}
              </p>
              <p>
                <strong>Qualification:</strong> {job.qualification}
              </p>
              <p>
                <strong>Status:</strong> {job.status}
              </p>

              <Link
                to={`/edit-job-applications/${job._id}`}
                className="  inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-800 rounded-md px-4 py-2 text-base font-medium shadow hover:bg-gray-100 transition duration-200"
              >
                <Pencil className="w-5 h-5 text-gray-600" />
                Edit Job Application
              </Link>

              <button
                onClick={() => handleDelete(job._id)}
                className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-800 rounded-md px-4 py-2 text-base font-medium shadow hover:bg-gray-100 transition duration-200"
              >
                <Trash2 className="w-5 h-5 text-gray-600" />
                Delete Job Application
              </button>

              <Link
                to={`/view-applicant/${job._id}`}
                className="text-blue-500 flex justify-end  "
              >
                View Applicant Details
                <MoveRight className="w-5 h-5 text-blue-500 inline-block ml-2 pt-1.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterPostedJobApplication;