import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant.js";
import {
  BriefcaseBusiness,
  Building2,
  Banknote,
  MapPinned,
  Clock,
  MoveRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const UserAppliedJobApplication = () => {
  const { user } = useSelector((store) => store.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${JOB_APPLICATION_API_END_POINT}/get-user-applied-job-application`,
          {
            withCredentials: true,
          }
        );
        setJobs(response.data.appliedJobs || []);
      } catch (err) {
        console.error("Error fetching job applications:", err.message);
        setError("Failed to fetch job applications.");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchJobApplications();
    }
  }, [user]);

  return (
    <div className="bg-[#f7e9d6] min-h-screen py-10 px-4 ">
      <div className="max-w-6xl mx-auto mt-[90px]">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
          Your Applied Job Applications
        </h1>

        {loading ? (
          <p className="text-center text-lg text-gray-700">
            Loading job applications...
          </p>
        ) : error ? (
          <p className="text-center text-lg text-red-600">{error}</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-lg text-gray-700">
            No job applications found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((application) => {
              const job = application.job;
              return job ? (
                <div
                  key={application._id}
                  className="bg-[#FAF6E9] rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden p-5 space-y-3"
                >
                  <h3 className="text-lg font-semibold text-center text-gray-800">
                    <BriefcaseBusiness className="w-5 h-5 text-blue-600 inline-block mr-1" />
                    {job.title}
                  </h3>
                  <p className="text-gray-700">
                    <Building2 className="w-5 h-5 text-gray-500 inline-block mr-1" />
                    {job.companyName}
                  </p>
                  <p className="text-gray-700">
                    <Banknote className="w-5 h-5 text-gray-500 inline-block mr-1" />
                    ₹{job.salary}
                  </p>
                  <p className="text-gray-700">
                    <MapPinned className="w-5 h-5 text-gray-500 inline-block mr-1" />
                    {job.location}
                  </p>
                  <p className="text-gray-700">
                    <Clock className="w-5 h-5 text-gray-500 inline-block mr-1" />
                    {job.jobType}
                  </p>
                  <Link
                    to={`/job-application-details/${job._id}`}
                    className="text-blue-600 hover:text-blue-700 flex justify-end items-center font-medium mt-2"
                  >
                    View Details
                    <MoveRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              ) : (
                <div
                  key={application._id}
                  className="bg-[#fff3f3] border border-red-200 rounded-xl p-4"
                >
                  <h3 className="text-red-600 font-semibold text-center">
                    This job has been removed by the recruiter.
                  </h3>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAppliedJobApplication;
