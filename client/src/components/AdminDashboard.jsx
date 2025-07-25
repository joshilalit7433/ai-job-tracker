import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant.js";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BriefcaseBusiness,
  Banknote,
  Building2,
  MapPinned,
  Clock,
  MoveRight,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        if (!user || user.role !== "admin") {
          navigate("/login");
          return;
        }

        fetchPendingJobs();
      } catch (error) {
        toast.error(error, {
          position: "bottom-right",
          theme: "dark",
        });
        navigate("/login");
      }
    };

    const fetchPendingJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${JOB_APPLICATION_API_END_POINT}/pending-jobs`,
          { withCredentials: true }
        );
        setPendingJobs(response.data.jobs);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.error("Access denied. Only admins can view this page", {
            position: "bottom-right",
            theme: "dark",
          });
          navigate("/login");
        } else {
          toast.error("Failed to fetch pending turf requests", {
            position: "bottom-right",
            theme: "dark",
          });
        }
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7e9d6] p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

      {pendingJobs.length === 0 ? (
        <div className="text-center text-xl text-gray-500 mt-10">
          No pending jobs requests available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingJobs.map((job) => (
            <div
              key={job._id}
              className="bg-[#FAF6E9] border border-gray-200 hover:shadow-xl transition-all duration-300 rounded-xl p-6 relative group"
            >
              {/* Company Logo and Job Type */}
              <div className="flex justify-between items-center mb-4">
                <img
                  src={job.image}
                  alt={job.companyName}
                  className="w-12 h-12 object-contain rounded-lg"
                  onError={(e) => (e.target.src = "./images/placeholder.jpg")}
                />
                <span className="text-xs px-3 py-1 border border-blue-500 text-blue-600 rounded-full font-medium">
                  {job.jobType}
                </span>
              </div>

              {/* Job Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {job.title}
              </h3>

              {/* Company and Location */}
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <BriefcaseBusiness className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{job.companyName}</span>
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPinned className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{job.location}</span>
                </p>
              </div>

              {/* Skills */}
              {typeof job.skills === "string" && (
                <div className="flex gap-2 flex-wrap mb-6">
                  {job.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter((skill) => skill.length > 0)
                    .slice(0, 3)
                    .map((skill, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          idx % 2 === 0
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <Link
                  to={`/job-application-details/${job._id}`}
                  className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  View Details
                  <MoveRight className="w-4 h-4" />
                </Link>

                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                  Status: Pending
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
