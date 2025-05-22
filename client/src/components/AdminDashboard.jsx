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
  MoveRight
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
          toast.error("You don't have permission to access this page", {
            position: "top-center",
            theme: "dark",
          });
          navigate("/login");
          return;
        }

        fetchPendingJobs();
      } catch (error) {
        toast.error(error, {
          position: "top-center",
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
            position: "top-center",
            theme: "dark",
          });
          navigate("/login");
        } else {
          toast.error("Failed to fetch pending turf requests", {
            position: "top-center",
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

      {pendingJobs.length === 0 ? (
        <div className="text-center text-xl text-gray-500 mt-10">
          No pending jobs requests available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col items-center">
                  <p className="text-black text-lg font-bold capitalize text-center">
                    <BriefcaseBusiness className="w-5 h-5 text-gray-600 inline-block" />{" "}
                    {job.title}
                  </p>
                  <p>
                    {" "}
                    <Building2 className="w-5 h-5 text-gray-600 inline-block" />{" "}
                    {job.company_name}
                  </p>
                  <p>
                    {" "}
                    <Banknote className="w-5 h-5 text-gray-600 inline-block" />{" "}
                    {job.salary}
                  </p>
                  <p>
                    {" "}
                    <MapPinned className="w-5 h-5 text-gray-600 inline-block" />{" "}
                    {job.location}
                  </p>
                  <p>
                    {" "}
                    <Clock className="w-5 h-5 text-gray-600 inline-block" />{" "}
                    {job.job_type}
                  </p>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mt-2">
                    Status: Pending
                  </div>
                  <Link
                    to={`/job-application-details/${job._id}`}
                    className="text-blue-500 flex justify-end  "
                  >
                    View Details
                    <MoveRight className="w-5 h-5 text-blue-500 inline-block ml-2 pt-1.5" />
                  </Link>

                  
                </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
