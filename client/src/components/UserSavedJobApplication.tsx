import axios from "axios";
import { useEffect, useState } from "react";
import { USER_API_END_POINT } from "../utils/constant";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BriefcaseBusiness,
  MapPinned,
  Banknote,
  Building2,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { JobApplication } from "../types/models";
import { RootState } from "../redux/store";
import { ApiResponse } from "../types/apiResponse";

const UserSavedJobApplication = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [savedJobs, setSavedJobs] = useState<JobApplication[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get<ApiResponse<JobApplication[]>>(
          `${USER_API_END_POINT}/get-saved-job`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setSavedJobs(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
        setError("Failed to fetch saved jobs.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "user") {
      fetchSavedJobs();
    }
  }, [user]);

  const handleDelete = async (jobId: string) => {
    if (!window.confirm("Are you sure you want to remove this saved job?"))
      return;

    try {
      const res = await axios.delete(
        `${USER_API_END_POINT}/user-unsaved-job/${jobId}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Job removed from saved list!", {
          position: "bottom-right",
        });
        setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
      } else {
        toast.error(res.data.message || "Failed to delete saved job.", {
          position: "bottom-right",
        });
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      toast.error("Something went wrong while deleting.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="bg-[#f7e9d6] min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto mt-[90px]">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
          Your Saved Job Applications
        </h1>

        {loading ? (
          <p className="text-center text-lg text-gray-700">
            Loading saved jobs...
          </p>
        ) : error ? (
          <p className="text-center text-lg text-red-600">{error}</p>
        ) : savedJobs.length === 0 ? (
          <p className="text-center text-lg text-gray-700">
            No saved job applications found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job) => (
              <div
                key={job._id}
                className="bg-[#FAF6E9] rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden p-5 space-y-3"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-600 flex items-center gap-2">
                    <BriefcaseBusiness className="w-5 h-5" />
                    {job.title}
                  </h3>
                  <p className="text-gray-700 mb-1 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    {job.companyName}
                  </p>
                  <p className="text-gray-700 mb-1 flex items-center gap-2">
                    <MapPinned className="w-4 h-4 text-gray-500" />
                    {job.location}
                  </p>
                  <p className="text-gray-700 mb-4 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-gray-500" />
                    ₹ {job.salary} /year
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
                  <Link
                    to={`/job-application-details/${job._id}`}
                    className="w-full sm:w-auto text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-800 rounded-md px-4 py-2 text-sm font-medium shadow hover:bg-gray-100 transition duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSavedJobApplication;
