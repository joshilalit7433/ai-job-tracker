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

const UserSavedJobApplication = () => {
  const { user } = useSelector((store) => store.auth);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/get-saved-job`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setSavedJobs(res.data.savedJobs);
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      }
    };

    if (user?.role === "user") {
      fetchSavedJobs();
    }
  }, [user]);

  const handleDelete = async (jobId) => {
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
        toast.success("Job application removed from saved list!");
        setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
      } else {
        toast.error(res.data.message || "Failed to delete job application.");
      }
    } catch (err) {
      console.error("Error deleting job application:", err);
      toast.error("Something went wrong while deleting.");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-20 bg-[#f7e9d6]">
      <div className="max-w-6xl mx-auto ">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-10">
          Your Saved Jobs
        </h2>

        {savedJobs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            You haven't saved any jobs yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {savedJobs.map((job) => (
              <div
                key={job._id}
                className="bg-[#FAF6E9] rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition duration-300"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-600 flex items-center gap-2">
                    <BriefcaseBusiness className="w-5 h-5" />
                    {job.title}
                  </h3>
                  <p className="text-gray-700 mb-1 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    {job.company_name}
                  </p>
                  <p className="text-gray-700 mb-1 flex items-center gap-2">
                    <MapPinned className="w-4 h-4 text-gray-500" />
                    {job.location}
                  </p>
                  <p className="text-gray-700 mb-4 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-gray-500" />₹ {job.salary}
                    /year
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
