import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant.js";
import { Pencil, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
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
            withCredentials: true,
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
    if (
      !window.confirm("Are you sure you want to delete this job application?")
    )
      return;

    try {
      const res = await axios.delete(
        `${JOB_APPLICATION_API_END_POINT}/delete-job-application/${id}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Job application deleted successfully!");
        setJobs(jobs.filter((job) => job._id !== id));
      } else {
        toast.error(res.data.message || "Failed to delete job application.", {
          position: "bottom-right",
        });
      }
    } catch (err) {
      console.error("Error deleting job application:", err);
      toast.error("Something went wrong while deleting.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="min-h-screen  pt-20 px-4 pb-20 bg-[#f7e9d6]  ">
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
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 space-y-4 border border-gray-200"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-blue-700 capitalize">
                  {job.title}
                </h3>
                <p className="text-gray-600 font-medium">{job.company_name}</p>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                <p>
                  <strong>Salary:</strong> {job.salary}
                </p>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Type:</strong> {job.job_type}
                </p>
                <p>
                  <strong>Experience:</strong> {job.experience}
                </p>
                <p>
                  <strong>Benefits:</strong> {job.benefits}
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
                  <strong>Status:</strong>{" "}
                  <span
                    className={`${
                      job.status === "active"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }`}
                  >
                    {job.status}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  to={`/edit-job-applications/${job._id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-sm"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>

                <Link
                  to={`/view-applicant/${job._id}`}
                  className="ml-auto flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View Applicants
                  <MoveRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterPostedJobApplication;
