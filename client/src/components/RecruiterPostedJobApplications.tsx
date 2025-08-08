import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant";
import { Pencil, MoveRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "../redux/store";
import { JobApplication, User } from "../types/models";
import { ApiResponse } from "../types/apiResponse";

const RecruiterPostedJobApplication = () => {
  const user = useSelector((store: RootState) => store.auth.user) as User | null;
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get<ApiResponse<JobApplication[]>>(`${JOB_APPLICATION_API_END_POINT}/get-recruiter-posted-job-application/${user?._id}`, {
          withCredentials: true,
        });
        const data = response.data;

        if (data.success) {
          console.log("Jobs fetched successfully:", data);
          setJobs(data.data || []);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Error fetching jobs:", err.message);
        setError("Failed to fetch jobs.");
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchJobs();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job application?")) return;

    try {
      const res = await axios.delete(`${JOB_APPLICATION_API_END_POINT}/delete-job-application/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success( "Job application deleted successfully!", { position: "bottom-right" });
        setJobs(jobs.filter((job) => job._id !== id));
      } else {
        toast.error( "Failed to delete job application.", {
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
    <div className="min-h-screen pt-20 px-4 pb-20 bg-gradient-to-br from-[#f7e9d6] to-[#f0e6d0]">
      <h1 className="text-center text-3xl font-bold mb-10 text-[#131D4F] tracking-tight">
        Your Posted Job Applications
      </h1>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-lg">No job applications found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="relative bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col justify-between min-h-[340px] group border border-gray-100 hover:border-gray-300"
            >
              {/* Status badge */}
              <div className="absolute top-6 right-6">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition-all duration-200
                    ${job.status === "open"
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-red-50 text-red-500 border border-red-100"}`}
                >
                  {job.status}
                </span>
              </div>

              <div className="space-y-1 mb-2">
                <h3 className="text-2xl font-bold text-blue-700 capitalize group-hover:text-blue-800 transition">
                  {job.title}
                </h3>
                <p className="text-gray-600 font-medium text-base">{job.companyName}</p>
              </div>

              <div className="grid grid-cols-1 gap-1 text-sm text-gray-700 mb-4">
                <p><span className="font-semibold text-[#131D4F]">Salary:</span> {job.salary}</p>
                <p><span className="font-semibold text-[#131D4F]">Location:</span> {job.location}</p>
                <p><span className="font-semibold text-[#131D4F]">Type:</span> {job.jobType}</p>
                <p><span className="font-semibold text-[#131D4F]">Experience:</span> {job.experience}</p>
                <p><span className="font-semibold text-[#131D4F]">Benefits:</span> {job.benefits}</p>
                <p><span className="font-semibold text-[#131D4F]">Responsibilities:</span> {job.responsibilities}</p>
                <p><span className="font-semibold text-[#131D4F]">Skills:</span> {job.skills.join(", ")}</p>
                <p><span className="font-semibold text-[#131D4F]">Qualification:</span> {job.qualification}</p>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-auto flex flex-wrap gap-3 items-center">
                <Link
                  to={`/edit-job-applications/${job._id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm transition text-sm font-semibold"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm transition text-sm font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>

                <Link
                  to={`/view-applicant/${job._id}`}
                  className="ml-auto flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-full font-semibold text-sm transition"
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
