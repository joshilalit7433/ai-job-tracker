import axios from "axios";
import {
  JOB_APPLICATION_API_END_POINT,
  USER_API_END_POINT,
} from "../utils/constant";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Banknote,
  Building2,
  MapPinned,
  Clock,
  BookMarked,
  MoveRight,
} from "lucide-react";

import { Link } from "react-router-dom";

const JobApplications = ({ filters }) => {
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        const response = await axios.get(
          `${JOB_APPLICATION_API_END_POINT}/get-job-applications`
        );
        const data = response.data;

        setTimeout(() => {
          const approvedJobs = data.jobapplications.filter(
            (job) => job.isApproved === true
          );
          setJobApplications(approvedJobs);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };
    fetchJobApplications();
  }, []);

  const isSalaryInRange = (salary, range) => {
    if (!range) return true;
    if (range === "1200000+") return salary >= 1200000;

    const [min, max] = range.split("-").map(Number);
    return salary >= min && salary <= max;
  };

  const checkLocationMatch = (jobLocation, selectedLocations) => {
    if (!selectedLocations || selectedLocations.length === 0) return true;
    
    // Convert job location to lowercase for case-insensitive comparison
    const jobLocationLower = jobLocation.toLowerCase();
    
    // Check if any of the selected locations match the job location
    return selectedLocations.some(selectedLocation => {
      const selectedLocationLower = selectedLocation.toLowerCase();
      return jobLocationLower.includes(selectedLocationLower);
    });
  };

  const filteredJobApplications = jobApplications.filter((job) => {
    const matchesSalary = isSalaryInRange(job.salary, filters.Salary);
    const matchesLocation = checkLocationMatch(job.location, filters.Location);
    const matchesCompany =
      !filters.Company ||
      job.company_name.toLowerCase().includes(filters.Company.toLowerCase());

    return matchesSalary && matchesLocation && matchesCompany;
  });

  const handleSaveJob = async (jobId) => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/saved-job/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("Job saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  return (
    <div className="px-4 pb-20 pt-10 bg-[#f7e9d6] min-h-screen">
      <div className="lg:ml-80">
        <h1 className="text-center text-2xl lg:text-3xl font-semibold mb-6">
          Available Jobs
        </h1>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading job applications...</p>
            </div>
          </div>
        ) : filteredJobApplications.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <BriefcaseBusiness className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-lg text-gray-600 mb-2">No jobs found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobApplications.map((job) => (
              <div
                key={job._id}
                className="bg-[#FAF6E9] border border-gray-200 hover:shadow-xl transition-all duration-300 rounded-xl p-6 relative group"
              >
                {/* Company Logo and Job Type */}
                <div className="flex justify-between items-center mb-4">
                  <img
                    src={job.image}
                    alt={job.company_name}
                    className="w-12 h-12 object-contain rounded-lg"
                    onError={(e) => (e.target.src = "./images/placeholder.jpg")}
                  />
                  <span className="text-xs px-3 py-1 border border-blue-500 text-blue-600 rounded-full font-medium">
                    {job.job_type}
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
                    <span className="truncate">{job.company_name}</span>
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

                  <button
                    onClick={() => handleSaveJob(job._id)}
                    className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-50"
                    title="Save Job"
                  >
                    <BookMarked className="w-5 h-5" />
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

export default JobApplications;
