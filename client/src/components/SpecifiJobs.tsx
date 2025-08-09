import { useEffect, useState } from "react";
import axios from "axios";
import {
  JOB_APPLICATION_API_END_POINT,
  USER_API_END_POINT,
} from "../utils/constant";
import {
  BriefcaseBusiness,
  MapPinned,
  BookMarked,
  MoveRight,
  Building,
  Star,
  Filter,
  TrendingUp,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import FilterJobApplications from "../components/FilterJobApplications";
import { JobApplication } from "../types/models";
import { ApiResponse } from "../types/apiResponse";
import { toast } from "react-toastify";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Filters {
  Salary: string;
  Location: string[];
  Company: string;
}

interface RouteParams extends Record<string, string | undefined> {
  categoryName?: string;
}

const SpecifiJobs = () => {
  const [allJobs, setAllJobs] = useState<JobApplication[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobApplication[]>([]);
  const [filters, setFilters] = useState<Filters>({
    Salary: "",
    Location: [],
    Company: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const limit = 2;

  const { categoryName } = useParams<RouteParams>();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse<JobApplication[]>>(
        `${JOB_APPLICATION_API_END_POINT}/get-jobs-by-category/${encodeURIComponent(
          categoryName || ""
        )}`
      );

      setAllJobs(res.data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSalaryInRange = (salary: number, range: string): boolean => {
    if (!range) return true;
    if (range === "1200000+") return salary >= 1200000;
    const [min, max] = range.split("-").map(Number);
    return salary >= min && salary <= max;
  };

  const normalizeLocation = (location: string): string =>
    location.split(" ")[0].toLowerCase();

  useEffect(() => {
    fetchJobs();
    setCurrentPage(1);
  }, [categoryName]);

  useEffect(() => {
    const filtered = allJobs.filter((job) => {
      const matchSalary = isSalaryInRange(job.salary, filters.Salary);
      const matchLocation =
        filters.Location.length === 0 ||
        filters.Location.map(normalizeLocation).includes(
          normalizeLocation(job.location)
        );
      const matchCompany =
        !filters.Company ||
        job.companyName.toLowerCase().includes(filters.Company.toLowerCase());

      return matchSalary && matchLocation && matchCompany;
    });

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [filters, allJobs]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryName]);

  const handleSaveJob = async (jobId: string) => {
    try {
      const res = await axios.post<ApiResponse<JobApplication>>(
        `${USER_API_END_POINT}/saved-job/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setSavedJobs((prev) => new Set([...prev, jobId]));
        toast.success(res.data.message || "Job saved successfully!", {
          position: "bottom-right",
        });
      } else {
        toast.error("Failed to save job.", { position: "bottom-right" });
      }
    } catch (error) {
      console.error("Failed to save job:", error);
      toast.error("Failed to save job. Please try again.");
    }
  };

  const handleFilterChange = (updatedFilters: Filters) => {
    setFilters(updatedFilters);
  };

  const formatSalary = (salary: number) => {
    if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)}L`;
    }
    return `₹${(salary / 1000).toFixed(0)}K`;
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType.toLowerCase()) {
      case "full-time":
        return "bg-green-100 text-green-800 border-green-200";
      case "part-time":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contract":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "internship":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const totalPages = Math.ceil(filteredJobs.length / limit);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // Loading skeleton component
  const JobCardSkeleton = () => (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row bg-[#f7e9d6] pt-20">
      <FilterJobApplications onFilterChange={handleFilterChange} />

      <div className="flex-1 px-4 pb-20 pt-10 min-h-screen">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            {filteredJobs.length} Positions Available
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {categoryName}
            </span>{" "}
            Opportunities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover specialized roles in {categoryName?.toLowerCase()} that
            match your expertise
          </p>
        </div>

        {/* Active Filters Display */}
        {(filters.Salary || filters.Location?.length || filters.Company) && (
          <div className="mb-8 lg:ml-[320px]">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Active Filters:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.Salary && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Salary: {filters.Salary}
                  </span>
                )}
                {filters.Location?.map((location, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    Location: {location}
                  </span>
                ))}
                {filters.Company && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    Company: {filters.Company}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="lg:ml-[320px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <JobCardSkeleton key={idx} />
            ))}
          </div>
        ) : paginatedJobs.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px] lg:ml-[320px]">
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <BriefcaseBusiness className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any {categoryName?.toLowerCase()} positions
                matching your filters.
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your search criteria or removing some filters.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="lg:ml-[320px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedJobs.map((job, index) => (
                <div
                  key={job._id}
                  className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-500 rounded-2xl p-6 relative overflow-hidden transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/30 transition-all duration-500" />

                  {/* Header */}
                  <div className="relative flex justify-between items-center mb-6">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                        <img
                          src={job.image}
                          alt={job.companyName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                            (
                              e.target as HTMLImageElement
                            ).parentElement!.innerHTML = `<Building class="w-8 h-8 text-gray-500" />`;
                          }}
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1.5 border rounded-full font-semibold ${getJobTypeColor(
                        job.jobType
                      )}`}
                    >
                      {job.jobType}
                    </span>
                  </div>

                  {/* Job Title */}
                  <div className="relative mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        <span className="truncate font-medium">
                          {job.companyName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location and Salary */}
                  <div className="relative space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinned className="w-4 h-4 text-gray-500" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold text-green-700">
                        {formatSalary(job.salary)} per year
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  {Array.isArray(job.skills) && job.skills.length > 0 && (
                    <div className="relative flex gap-2 flex-wrap mb-6">
                      {job.skills
                        .filter((skill: string) => skill.length > 0)
                        .slice(0, 3)
                        .map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1.5 rounded-full font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-100"
                          >
                            {skill}
                          </span>
                        ))}
                      {job.skills.length > 3 && (
                        <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-gray-100 text-gray-600">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="relative flex justify-between items-center pt-4 border-t border-gray-100">
                    <Link
                      to={`/job-application-details/${job._id}`}
                      className="group/link text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-2 transition-all duration-200 hover:gap-3"
                    >
                      View Details
                      <MoveRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                    </Link>

                    <button
                      onClick={() => handleSaveJob(job._id)}
                      className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-110 ${
                        savedJobs.has(job._id)
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                      }`}
                      title="Save Job"
                    >
                      <BookMarked
                        className={`w-5 h-5 ${
                          savedJobs.has(job._id) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* New Badge for featured jobs */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center w-full">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="p-3 rounded-xl bg-white border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105"
                      title="Previous Page"
                    >
                      <FiChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                      {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = idx + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = idx + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + idx;
                        } else {
                          pageNumber = currentPage - 2 + idx;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                              currentPage === pageNumber
                                ? "bg-blue-600 text-white shadow-lg scale-105"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="p-3 rounded-xl bg-white border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105"
                      title="Next Page"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>

                  <div className="mt-3 text-center">
                    <span className="text-sm text-gray-600">
                      {currentPage} out of {totalPages} page
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SpecifiJobs;
