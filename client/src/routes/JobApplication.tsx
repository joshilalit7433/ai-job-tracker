import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  MapPinned,
  BookMarked,
  MoveRight,
} from "lucide-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import {
  JOB_APPLICATION_API_END_POINT,
  USER_API_END_POINT,
} from "../utils/constant";

import { ApiResponse } from "../types/apiResponse";
import { JobApplication } from "../types/models";
import { toast } from "react-toastify";

interface JobApplicationsProps {
  filters: {
    Salary?: string;
    Location?: string[];
    Company?: string;
  };
}

const JobApplications: React.FC<JobApplicationsProps> = ({ filters }) => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    const fetchJobApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get<ApiResponse<JobApplication[]>>(
          `${JOB_APPLICATION_API_END_POINT}/get-job-applications?page=${currentPage}&limit=${limit}`
        );

        setJobApplications(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job applications:", error);
        setLoading(false);
      }
    };

    fetchJobApplications();
  }, [currentPage]);

  const isSalaryInRange = (salary: number, range?: string): boolean => {
    if (!range) return true;
    if (range === "1200000+") return salary >= 1200000;

    const [min, max] = range.split("-").map(Number);
    return salary >= min && salary <= max;
  };

  const checkLocationMatch = (
    jobLocation: string,
    selectedLocations?: string[]
  ): boolean => {
    if (!selectedLocations || selectedLocations.length === 0) return true;

    const jobLocationLower = jobLocation.toLowerCase();
    return selectedLocations.some((loc) =>
      jobLocationLower.includes(loc.toLowerCase())
    );
  };

  const filteredJobApplications = jobApplications.filter((job) => {
    const matchesSalary = isSalaryInRange(job.salary, filters.Salary);
    const matchesLocation = checkLocationMatch(job.location, filters.Location);
    const matchesCompany =
      !filters.Company ||
      job.companyName.toLowerCase().includes(filters.Company.toLowerCase());

    return matchesSalary && matchesLocation && matchesCompany;
  });

  const handleSaveJob = async (jobId: string) => {
    try {
      const res = await axios.post<ApiResponse<JobApplication>>(
        `${USER_API_END_POINT}/saved-job/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success( res.data.message || "Job saved successfully!", { position: "bottom-right" });
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
              <p className="text-lg text-gray-600">
                Loading job applications...
              </p>
            </div>
          </div>
        ) : filteredJobApplications.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <BriefcaseBusiness className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-lg text-gray-600 mb-2">No jobs found</p>
              <p className="text-sm text-gray-500">
                Try adjusting your filters
              </p>
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
                    alt={job.companyName}
                    className="w-12 h-12 object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/placeholder.jpg";
                    }}
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
                {Array.isArray(job.skills) && (
                  <div className="flex gap-2 flex-wrap mb-6">
                    {job.skills
                      .filter((skill: string) => skill.length > 0)
                      .slice(0, 3)
                      .map((skill: string, idx: number) => (
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
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-4 items-center">
          {/* left button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-white border text-[#131D4F] disabled:opacity-40 hover:bg-[#131D4F] hover:text-white transition-all"
            title="Previous Page"
          >
            <FiChevronLeft size={20} />
          </button>

          {/* text part */}
          <span className="px-4 py-1 text-[#131D4F] font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          {/* right button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-white border text-[#131D4F] disabled:opacity-40 hover:bg-[#131D4F] hover:text-white transition-all"
            title="Next Page"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobApplications;
